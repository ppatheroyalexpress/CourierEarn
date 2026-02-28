package com.courierearn.data.repository

import com.courierearn.data.database.dao.TransactionDao
import com.courierearn.data.database.dao.MonthlySummaryDao
import com.courierearn.data.database.entities.TransactionEntity
import com.courierearn.data.database.entities.MonthlySummaryEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TransactionRepositoryImpl @Inject constructor(
    private val transactionDao: TransactionDao,
    private val monthlySummaryDao: MonthlySummaryDao
) {
    
    // Get all transactions
    fun getAllTransactions(): Flow<List<TransactionEntity>> {
        return transactionDao.getAllTransactions()
    }
    
    // Get transaction by specific date
    suspend fun getTransactionByDate(date: LocalDate): TransactionEntity? {
        return transactionDao.getTransactionByDate(date)
    }
    
    // Get transactions for date range
    fun getTransactionsByDateRange(startDate: LocalDate, endDate: LocalDate): Flow<List<TransactionEntity>> {
        return transactionDao.getTransactionsByDateRange(startDate, endDate)
    }
    
    // Get transactions for specific month
    fun getTransactionsByMonth(yearMonth: String): Flow<List<TransactionEntity>> {
        return transactionDao.getTransactionsByMonth(yearMonth)
    }
    
    // Get last 7 days transactions
    fun getLastSevenDaysTransactions(startDate: LocalDate): Flow<List<TransactionEntity>> {
        return transactionDao.getLastSevenDaysTransactions(startDate)
    }
    
    // Save or update transaction
    suspend fun saveTransaction(transaction: TransactionEntity) {
        val existingTransaction = transactionDao.getTransactionByDate(transaction.date)
        
        if (existingTransaction != null) {
            transactionDao.updateTransaction(transaction)
        } else {
            transactionDao.insertTransaction(transaction)
        }
        
        // Update monthly summary
        updateMonthlySummary(transaction.date.yearMonth)
    }
    
    // Delete transaction by date
    suspend fun deleteTransactionByDate(date: LocalDate) {
        transactionDao.deleteTransactionByDate(date)
        updateMonthlySummary(date.yearMonth)
    }
    
    // Delete all transactions
    suspend fun deleteAllTransactions() {
        transactionDao.deleteAllTransactions()
        monthlySummaryDao.deleteAllMonthlySummaries()
    }
    
    // Get monthly statistics
    suspend fun getMonthlyStatistics(yearMonth: String): MonthlyStatistics? {
        val totalCashCollect = transactionDao.getTotalCashCollectByMonth(yearMonth) ?: 0
        val totalSenderPay = transactionDao.getTotalSenderPayByMonth(yearMonth) ?: 0
        val totalRejectedFoc = transactionDao.getTotalRejectedFocByMonth(yearMonth) ?: 0
        val totalEc = transactionDao.getTotalEcByMonth(yearMonth) ?: 0
        val totalEarnings = transactionDao.getTotalEarningsByMonth(yearMonth) ?: 0
        
        return MonthlyStatistics(
            yearMonth = yearMonth,
            totalCashCollectCount = totalCashCollect,
            totalSenderPayCount = totalSenderPay,
            totalRejectedFocCount = totalRejectedFoc,
            totalEcCount = totalEc,
            totalEarnings = totalEarnings
        )
    }
    
    // Update monthly summary after transaction changes
    private suspend fun updateMonthlySummary(yearMonth: YearMonth) {
        val stats = getMonthlyStatistics(yearMonth.toString())
        
        if (stats != null) {
            val calculation = MonthlySummaryEntity.calculateMonthlySummary(
                totalCashCollectCount = stats.totalCashCollectCount,
                totalSenderPayCount = stats.totalSenderPayCount,
                totalRejectedFocCount = stats.totalRejectedFocCount,
                totalEcCount = stats.totalEcCount
            )
            
            val summary = MonthlySummaryEntity(
                yearMonth = yearMonth,
                totalCashCollectCount = stats.totalCashCollectCount,
                totalSenderPayCount = stats.totalSenderPayCount,
                totalRejectedFocCount = stats.totalRejectedFocCount,
                totalEcCount = stats.totalEcCount,
                standardEarnings = calculation.standardEarnings,
                ecBonus = calculation.ecBonus,
                monthlyTotal = calculation.monthlyTotal,
                createdAt = java.time.Instant.now(),
                updatedAt = java.time.Instant.now()
            )
            
            monthlySummaryDao.insertMonthlySummary(summary)
        }
    }
    
    data class MonthlyStatistics(
        val yearMonth: String,
        val totalCashCollectCount: Int,
        val totalSenderPayCount: Int,
        val totalRejectedFocCount: Int,
        val totalEcCount: Int,
        val totalEarnings: Int
    )
}

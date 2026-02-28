package com.courierearn.data.repository

import com.courierearn.data.database.entities.TransactionEntity
import com.courierearn.data.database.entities.MonthlySummaryEntity
import com.courierearn.domain.model.Transaction
import com.courierearn.domain.model.MonthlySummary
import com.courierearn.domain.repository.TransactionRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TransactionRepositoryMapper @Inject constructor(
    private val transactionRepositoryImpl: TransactionRepositoryImpl
) : TransactionRepository {
    
    override fun getAllTransactions(): Flow<List<Transaction>> {
        return transactionRepositoryImpl.getAllTransactions().map { entities ->
            entities.map { it.toDomainModel() }
        }
    }
    
    override suspend fun getTransactionByDate(date: LocalDate): Transaction? {
        return transactionRepositoryImpl.getTransactionByDate(date)?.toDomainModel()
    }
    
    override fun getTransactionsByDateRange(startDate: LocalDate, endDate: LocalDate): Flow<List<Transaction>> {
        return transactionRepositoryImpl.getTransactionsByDateRange(startDate, endDate).map { entities ->
            entities.map { it.toDomainModel() }
        }
    }
    
    override fun getTransactionsByMonth(yearMonth: String): Flow<List<Transaction>> {
        return transactionRepositoryImpl.getTransactionsByMonth(yearMonth).map { entities ->
            entities.map { it.toDomainModel() }
        }
    }
    
    override fun getLastSevenDaysTransactions(startDate: LocalDate): Flow<List<Transaction>> {
        return transactionRepositoryImpl.getLastSevenDaysTransactions(startDate).map { entities ->
            entities.map { it.toDomainModel() }
        }
    }
    
    override suspend fun saveTransaction(transaction: Transaction) {
        transactionRepositoryImpl.saveTransaction(transaction.toEntity())
    }
    
    override suspend fun deleteTransactionByDate(date: LocalDate) {
        transactionRepositoryImpl.deleteTransactionByDate(date)
    }
    
    override suspend fun deleteAllTransactions() {
        transactionRepositoryImpl.deleteAllTransactions()
    }
    
    override suspend fun getMonthlyStatistics(yearMonth: String): MonthlyStatistics? {
        return transactionRepositoryImpl.getMonthlyStatistics(yearMonth)?.let { stats ->
            MonthlyStatistics(
                yearMonth = stats.yearMonth,
                totalCashCollect = stats.totalCashCollect,
                totalSenderPay = stats.totalSenderPay,
                totalRejected = stats.totalRejected,
                totalFoc = stats.totalFoc,
                totalEc = stats.totalEc,
                totalEarnings = stats.totalEarnings
            )
        }
    }
    
    override suspend fun getMonthlySummary(yearMonth: YearMonth): MonthlySummary? {
        val stats = getMonthlyStatistics(yearMonth.toString())
        return if (stats != null) {
            val calculation = MonthlySummary.calculateMonthlySummary(
                totalCashCollect = stats.totalCashCollect,
                totalSenderPay = stats.totalSenderPay,
                totalRejected = stats.totalRejected,
                totalFoc = stats.totalFoc,
                totalEc = stats.totalEc
            )
            
            MonthlySummary(
                yearMonth = yearMonth,
                totalCashCollect = stats.totalCashCollect,
                totalSenderPay = stats.totalSenderPay,
                totalRejected = stats.totalRejected,
                totalFoc = stats.totalFoc,
                totalEc = stats.totalEc,
                standardEarnings = calculation.standardEarnings,
                ecBonus = calculation.ecBonus,
                monthlyTotal = calculation.monthlyTotal
            )
        } else {
            null
        }
    }
}

// Extension functions for mapping
fun TransactionEntity.toDomainModel(): Transaction {
    return Transaction(
        id = id,
        date = date,
        cashCollect = cashCollect,
        senderPay = senderPay,
        rejected = rejected,
        foc = foc,
        ec = ec,
        dailyTotal = dailyTotal
    )
}

fun Transaction.toEntity(): TransactionEntity {
    return TransactionEntity(
        id = id,
        date = date,
        cashCollect = cashCollect,
        senderPay = senderPay,
        rejected = rejected,
        foc = foc,
        ec = ec,
        dailyTotal = dailyTotal,
        createdAt = java.time.Instant.now(),
        updatedAt = java.time.Instant.now()
    )
}

package com.courierearn.domain.repository

import com.courierearn.domain.model.Transaction
import com.courierearn.domain.model.MonthlySummary
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate
import java.time.YearMonth

interface TransactionRepository {
    // Get all transactions
    fun getAllTransactions(): Flow<List<Transaction>>
    
    // Get transaction by specific date
    suspend fun getTransactionByDate(date: LocalDate): Transaction?
    
    // Get transactions for date range
    fun getTransactionsByDateRange(startDate: LocalDate, endDate: LocalDate): Flow<List<Transaction>>
    
    // Get transactions for specific month
    fun getTransactionsByMonth(yearMonth: String): Flow<List<Transaction>>
    
    // Get last 7 days transactions
    fun getLastSevenDaysTransactions(startDate: LocalDate): Flow<List<Transaction>>
    
    // Save or update transaction
    suspend fun saveTransaction(transaction: Transaction)
    
    // Delete transaction by date
    suspend fun deleteTransactionByDate(date: LocalDate)
    
    // Delete all transactions
    suspend fun deleteAllTransactions()
    
    // Get monthly statistics
    suspend fun getMonthlyStatistics(yearMonth: String): MonthlyStatistics?
    
    // Get monthly summary
    suspend fun getMonthlySummary(yearMonth: YearMonth): MonthlySummary?
    
    data class MonthlyStatistics(
        val yearMonth: String,
        val totalCashCollect: Int,
        val totalSenderPay: Int,
        val totalRejected: Int,
        val totalFoc: Int,
        val totalEc: Int,
        val totalEarnings: Int
    )
}

package com.courierearn.data.database.dao

import androidx.room.*
import com.courierearn.data.database.entities.TransactionEntity
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

@Dao
interface TransactionDao {
    
    @Query("SELECT * FROM transactions ORDER BY date DESC")
    fun getAllTransactions(): Flow<List<TransactionEntity>>
    
    @Query("SELECT * FROM transactions WHERE date = :date")
    suspend fun getTransactionByDate(date: LocalDate): TransactionEntity?
    
    @Query("SELECT * FROM transactions WHERE date BETWEEN :startDate AND :endDate ORDER BY date DESC")
    fun getTransactionsByDateRange(startDate: LocalDate, endDate: LocalDate): Flow<List<TransactionEntity>>
    
    @Query("SELECT * FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth ORDER BY date DESC")
    fun getTransactionsByMonth(yearMonth: String): Flow<List<TransactionEntity>>
    
    @Query("SELECT COUNT(*) FROM transactions WHERE date = :date")
    suspend fun getTransactionCountForDate(date: LocalDate): Int
    
    @Query("SELECT SUM(cashCollect) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalCashCollectByMonth(yearMonth: String): Int?
    
    @Query("SELECT SUM(senderPay) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalSenderPayByMonth(yearMonth: String): Int?
    
    @Query("SELECT SUM(rejected) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalRejectedByMonth(yearMonth: String): Int?
    
    @Query("SELECT SUM(foc) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalFocByMonth(yearMonth: String): Int?
    
    @Query("SELECT SUM(ec) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalEcByMonth(yearMonth: String): Int?
    
    @Query("SELECT SUM(dailyTotal) FROM transactions WHERE strftime('%Y-%m', date) = :yearMonth")
    suspend fun getTotalEarningsByMonth(yearMonth: String): Int?
    
    @Query("SELECT * FROM transactions WHERE date >= :startDate ORDER BY date DESC LIMIT 7")
    fun getLastSevenDaysTransactions(startDate: LocalDate): Flow<List<TransactionEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: TransactionEntity)
    
    @Update
    suspend fun updateTransaction(transaction: TransactionEntity)
    
    @Delete
    suspend fun deleteTransaction(transaction: TransactionEntity)
    
    @Query("DELETE FROM transactions WHERE date = :date")
    suspend fun deleteTransactionByDate(date: LocalDate)
    
    @Query("DELETE FROM transactions")
    suspend fun deleteAllTransactions()
}

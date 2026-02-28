package com.courierearn.data.database.dao

import androidx.room.*
import com.courierearn.data.database.entities.MonthlySummaryEntity
import kotlinx.coroutines.flow.Flow
import java.time.YearMonth

@Dao
interface MonthlySummaryDao {
    
    @Query("SELECT * FROM monthly_summaries ORDER BY yearMonth DESC")
    fun getAllMonthlySummaries(): Flow<List<MonthlySummaryEntity>>
    
    @Query("SELECT * FROM monthly_summaries WHERE yearMonth = :yearMonth")
    suspend fun getMonthlySummaryByYearMonth(yearMonth: YearMonth): MonthlySummaryEntity?
    
    @Query("SELECT * FROM monthly_summaries WHERE yearMonth BETWEEN :startMonth AND :endMonth ORDER BY yearMonth DESC")
    fun getMonthlySummariesByRange(startMonth: YearMonth, endMonth: YearMonth): Flow<List<MonthlySummaryEntity>>
    
    @Query("SELECT * FROM monthly_summaries ORDER BY yearMonth DESC LIMIT 1")
    suspend fun getLatestMonthlySummary(): MonthlySummaryEntity?
    
    @Query("SELECT SUM(monthlyTotal) FROM monthly_summaries WHERE yearMonth BETWEEN :startMonth AND :endMonth")
    suspend fun getTotalEarningsByRange(startMonth: YearMonth, endMonth: YearMonth): Int?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMonthlySummary(summary: MonthlySummaryEntity)
    
    @Update
    suspend fun updateMonthlySummary(summary: MonthlySummaryEntity)
    
    @Delete
    suspend fun deleteMonthlySummary(summary: MonthlySummaryEntity)
    
    @Query("DELETE FROM monthly_summaries WHERE yearMonth = :yearMonth")
    suspend fun deleteMonthlySummaryByYearMonth(yearMonth: YearMonth)
    
    @Query("DELETE FROM monthly_summaries")
    suspend fun deleteAllMonthlySummaries()
}

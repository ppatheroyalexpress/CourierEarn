package com.courierearn.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.YearMonth

@Entity(tableName = "monthly_summaries")
data class MonthlySummaryEntity(
    @PrimaryKey 
    val yearMonth: YearMonth,
    val totalCashCollectCount: Int,
    val totalSenderPayCount: Int,
    val totalRejectedFocCount: Int,
    val totalEcCount: Int,
    val standardEarnings: Int,
    val ecBonus: Int,
    val monthlyTotal: Int,
    val createdAt: java.time.Instant,
    val updatedAt: java.time.Instant
) {
    companion object {
        fun calculateMonthlySummary(
            totalCashCollectCount: Int,
            totalSenderPayCount: Int,
            totalRejectedFocCount: Int,
            totalEcCount: Int
        ): MonthlyCalculation {
            val standardEarnings = (totalCashCollectCount * 200) + (totalSenderPayCount * 100) + (totalRejectedFocCount * 0)
            val ecBonus = totalEcCount * 600
            val monthlyTotal = standardEarnings + ecBonus
            
            return MonthlyCalculation(
                standardEarnings = standardEarnings,
                ecBonus = ecBonus,
                monthlyTotal = monthlyTotal
            )
        }
    }
    
    data class MonthlyCalculation(
        val standardEarnings: Int,
        val ecBonus: Int,
        val monthlyTotal: Int
    )
}

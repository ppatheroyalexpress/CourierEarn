package com.courierearn.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.YearMonth

@Entity(tableName = "monthly_summaries")
data class MonthlySummaryEntity(
    @PrimaryKey 
    val yearMonth: YearMonth,
    val totalCashCollect: Int,
    val totalSenderPay: Int,
    val totalRejected: Int,
    val totalFoc: Int,
    val totalEc: Int,
    val standardEarnings: Int,
    val ecBonus: Int,
    val monthlyTotal: Int,
    val createdAt: java.time.Instant,
    val updatedAt: java.time.Instant
) {
    companion object {
        fun calculateMonthlySummary(
            totalCashCollect: Int,
            totalSenderPay: Int,
            totalRejected: Int,
            totalFoc: Int,
            totalEc: Int
        ): MonthlyCalculation {
            val standardEarnings = (totalCashCollect * 200) + (totalSenderPay * 100) + (totalRejected * 0) + (totalFoc * 0)
            val ecBonus = totalEc * 600
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

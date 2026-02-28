package com.courierearn.domain.model

import java.time.YearMonth

data class MonthlySummary(
    val yearMonth: YearMonth,
    val totalCashCollect: Int,
    val totalSenderPay: Int,
    val totalRejected: Int,
    val totalFoc: Int,
    val totalEc: Int,
    val standardEarnings: Int,
    val ecBonus: Int,
    val monthlyTotal: Int
) {
    fun getTotalDeliveries(): Int {
        return totalCashCollect + totalSenderPay + totalRejected + totalFoc
    }
    
    fun getMonthProgressPercentage(targetEarnings: Int = 100000): Int {
        return if (targetEarnings > 0) {
            ((monthlyTotal.toFloat() / targetEarnings.toFloat()) * 100).toInt()
        } else {
            0
        }
    }
    
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

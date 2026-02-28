package com.courierearn.domain.model

import java.time.LocalDate

data class Transaction(
    val id: String,
    val date: LocalDate,
    val cashCollect: Int,
    val senderPay: Int,
    val rejected: Int,
    val foc: Int,
    val ec: Int,
    val dailyTotal: Int
) {
    companion object {
        fun calculateDailyTotal(
            cashCollect: Int,
            senderPay: Int,
            rejected: Int,
            foc: Int
        ): Int {
            return (cashCollect * 200) + (senderPay * 100) + (rejected * 0) + (foc * 0)
        }
    }
    
    fun getTotalDeliveries(): Int {
        return cashCollect + senderPay + rejected + foc
    }
    
    fun getTransactionSummary(): String {
        return "Cash Collect: $cashCollect, Sender Pay: $senderPay, EC: $ec"
    }
}

package com.courierearn.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.Instant
import java.time.LocalDate

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey 
    val id: String,
    val date: LocalDate,
    val cashCollect: Int,
    val senderPay: Int,
    val rejected: Int,
    val foc: Int,
    val ec: Int,
    val dailyTotal: Int,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    // Calculate daily total based on transaction types
    companion object {
        fun calculateDailyTotal(
            cashCollect: Int,
            senderPay: Int,
            rejected: Int,
            foc: Int
        ): Int {
            return (cashCollect * 200) + (senderPay * 100) + (rejected * 0) + (foc * 0)
        }
        
        fun generateId(date: LocalDate): String {
            return "transaction_${date.toString()}"
        }
    }
}

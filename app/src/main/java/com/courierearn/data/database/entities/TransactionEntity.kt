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
    val cashCollectCount: Int,
    val senderPayCount: Int,
    val rejectedFocCount: Int,
    val ecCount: Int,
    val dailyTotal: Int,
    val createdAt: Instant,
    val updatedAt: Instant
) {
    // Calculate daily total based on transaction types
    companion object {
        fun calculateDailyTotal(
            cashCollectCount: Int,
            senderPayCount: Int,
            rejectedFocCount: Int
        ): Int {
            return (cashCollectCount * 200) + (senderPayCount * 100) + (rejectedFocCount * 0)
        }
    }
}

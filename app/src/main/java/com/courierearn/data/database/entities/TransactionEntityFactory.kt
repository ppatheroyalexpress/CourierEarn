package com.courierearn.data.database.entities

import java.time.Instant
import java.time.LocalDate

object TransactionEntityFactory {
    
    fun createTransaction(
        date: LocalDate,
        cashCollect: Int = 0,
        senderPay: Int = 0,
        rejected: Int = 0,
        foc: Int = 0,
        ec: Int = 0
    ): TransactionEntity {
        val now = Instant.now()
        val dailyTotal = TransactionEntity.calculateDailyTotal(
            cashCollect = cashCollect,
            senderPay = senderPay,
            rejected = rejected,
            foc = foc
        )
        
        return TransactionEntity(
            id = TransactionEntity.generateId(date),
            date = date,
            cashCollect = cashCollect,
            senderPay = senderPay,
            rejected = rejected,
            foc = foc,
            ec = ec,
            dailyTotal = dailyTotal,
            createdAt = now,
            updatedAt = now
        )
    }
    
    fun createEmptyTransaction(date: LocalDate): TransactionEntity {
        return createTransaction(
            date = date,
            cashCollect = 0,
            senderPay = 0,
            rejected = 0,
            foc = 0,
            ec = 0
        )
    }
    
    fun updateTransaction(
        existing: TransactionEntity,
        cashCollect: Int = existing.cashCollect,
        senderPay: Int = existing.senderPay,
        rejected: Int = existing.rejected,
        foc: Int = existing.foc,
        ec: Int = existing.ec
    ): TransactionEntity {
        val dailyTotal = TransactionEntity.calculateDailyTotal(
            cashCollect = cashCollect,
            senderPay = senderPay,
            rejected = rejected,
            foc = foc
        )
        
        return existing.copy(
            cashCollect = cashCollect,
            senderPay = senderPay,
            rejected = rejected,
            foc = foc,
            ec = ec,
            dailyTotal = dailyTotal,
            updatedAt = Instant.now()
        )
    }
}

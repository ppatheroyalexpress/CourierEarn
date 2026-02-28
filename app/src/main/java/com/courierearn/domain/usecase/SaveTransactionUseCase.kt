package com.courierearn.domain.usecase

import com.courierearn.domain.model.Transaction
import com.courierearn.domain.repository.TransactionRepository
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SaveTransactionUseCase @Inject constructor(
    private val transactionRepository: TransactionRepository
) {
    
    suspend operator fun invoke(
        date: LocalDate = LocalDate.now(),
        cashCollect: Int = 0,
        senderPay: Int = 0,
        rejected: Int = 0,
        foc: Int = 0,
        ec: Int = 0
    ): Result<Unit> {
        return try {
            val existingTransaction = transactionRepository.getTransactionByDate(date)
            
            val transaction = if (existingTransaction != null) {
                existingTransaction.copy(
                    cashCollect = cashCollect,
                    senderPay = senderPay,
                    rejected = rejected,
                    foc = foc,
                    ec = ec,
                    dailyTotal = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
                )
            } else {
                Transaction(
                    id = generateTransactionId(date),
                    date = date,
                    cashCollect = cashCollect,
                    senderPay = senderPay,
                    rejected = rejected,
                    foc = foc,
                    ec = ec,
                    dailyTotal = Transaction.calculateDailyTotal(cashCollect, senderPay, rejected, foc)
                )
            }
            
            transactionRepository.saveTransaction(transaction)
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
    
    private fun generateTransactionId(date: LocalDate): String {
        return "transaction_${date.toString()}"
    }
}

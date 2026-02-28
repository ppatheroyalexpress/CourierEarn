package com.courierearn.domain.usecase

import com.courierearn.domain.model.HomeScreenData
import com.courierearn.domain.model.CommissionData
import com.courierearn.domain.model.MonthToDateData
import com.courierearn.domain.model.Transaction
import com.courierearn.domain.repository.TransactionRepository
import com.courierearn.domain.repository.SettingsRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GetHomeScreenDataUseCase @Inject constructor(
    private val transactionRepository: TransactionRepository,
    private val settingsRepository: SettingsRepository
) {
    
    operator fun invoke(): Flow<HomeScreenData> {
        val today = LocalDate.now()
        val yesterday = today.minusDays(1)
        val currentMonth = YearMonth.from(today)
        val sevenDaysAgo = today.minusDays(7)
        
        // Combine multiple flows
        return combine(
            settingsRepository.getSettingValueFlow("user_name"),
            transactionRepository.getTransactionByDate(yesterday),
            transactionRepository.getTransactionByDate(today),
            transactionRepository.getMonthlyStatistics(currentMonth.toString()),
            transactionRepository.getLastSevenDaysTransactions(sevenDaysAgo)
        ) { userName, yesterdayTransaction, todayTransaction, monthlyStats, recentTransactions ->
            
            val userNameValue = userName ?: "PPA | 30 (Chanmyathazi East)"
            val yesterdayCommission = calculateCommissionData(yesterdayTransaction)
            val todayCommission = calculateCommissionData(todayTransaction)
            val monthToDateData = calculateMonthToDateData(monthlyStats, currentMonth)
            val recentTransactionList = recentTransactions.take(5) // Show last 5 transactions
            
            HomeScreenData(
                userName = userNameValue,
                yesterdayCommission = yesterdayCommission,
                todayCommission = todayCommission,
                monthToDateData = monthToDateData,
                recentTransactions = recentTransactionList
            )
        }
    }
    
    private fun calculateCommissionData(transaction: Transaction?): CommissionData {
        return if (transaction != null) {
            CommissionData(
                totalAmount = transaction.dailyTotal,
                totalDeliveries = transaction.getTotalDeliveries()
            )
        } else {
            CommissionData(
                totalAmount = 0,
                totalDeliveries = 0
            )
        }
    }
    
    private fun calculateMonthToDateData(
        monthlyStats: TransactionRepository.MonthlyStatistics?,
        currentMonth: YearMonth
    ): MonthToDateData {
        return if (monthlyStats != null) {
            val calculation = MonthlySummary.calculateMonthlySummary(
                totalCashCollect = monthlyStats.totalCashCollect,
                totalSenderPay = monthlyStats.totalSenderPay,
                totalRejected = monthlyStats.totalRejected,
                totalFoc = monthlyStats.totalFoc,
                totalEc = monthlyStats.totalEc
            )
            
            MonthToDateData(
                totalAmount = calculation.monthlyTotal,
                totalDeliveries = monthlyStats.totalCashCollect + monthlyStats.totalSenderPay + 
                               monthlyStats.totalRejected + monthlyStats.totalFoc,
                ecBonus = calculation.ecBonus,
                progressPercentage = getMonthProgressPercentage(currentMonth)
            )
        } else {
            MonthToDateData(
                totalAmount = 0,
                totalDeliveries = 0,
                ecBonus = 0,
                progressPercentage = 0
            )
        }
    }
    
    private fun getMonthProgressPercentage(currentMonth: YearMonth): Int {
        val today = LocalDate.now()
        val currentDay = today.dayOfMonth
        val daysInMonth = currentMonth.lengthOfMonth()
        
        return if (daysInMonth > 0) {
            ((currentDay.toFloat() / daysInMonth.toFloat()) * 100).toInt()
        } else {
            0
        }
    }
}

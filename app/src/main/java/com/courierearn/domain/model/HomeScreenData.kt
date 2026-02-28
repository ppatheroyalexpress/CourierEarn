package com.courierearn.domain.model

data class HomeScreenData(
    val userName: String,
    val yesterdayCommission: CommissionData,
    val todayCommission: CommissionData,
    val monthToDateData: MonthToDateData,
    val recentTransactions: List<Transaction>
)

data class CommissionData(
    val totalAmount: Int,
    val totalDeliveries: Int
)

data class MonthToDateData(
    val totalAmount: Int,
    val totalDeliveries: Int,
    val ecBonus: Int,
    val progressPercentage: Int
) {
    fun getFormattedProgress(): String {
        return "$progressPercentage% Complete"
    }
    
    fun getFormattedEcBonus(): String {
        return "EC Bonus: $ecBonus MMK"
    }
}

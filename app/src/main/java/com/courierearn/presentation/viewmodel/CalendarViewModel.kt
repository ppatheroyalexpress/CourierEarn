package com.courierearn.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.courierearn.domain.model.Transaction
import com.courierearn.domain.repository.TransactionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject

@HiltViewModel
class CalendarViewModel @Inject constructor(
    private val transactionRepository: TransactionRepository
) : ViewModel() {
    
    private val _currentMonth = MutableStateFlow(YearMonth.now())
    val currentMonth: StateFlow<YearMonth> = _currentMonth.asStateFlow()
    
    private val _transactions = MutableStateFlow<List<Transaction>>(emptyList())
    val transactions: StateFlow<List<Transaction>> = _transactions.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    init {
        loadTransactions()
    }
    
    private fun loadTransactions() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                transactionRepository.getAllTransactions().collect { transactionList ->
                    _transactions.value = transactionList
                    _isLoading.value = false
                }
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load transactions: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    fun navigateToPreviousMonth() {
        _currentMonth.value = _currentMonth.value.minusMonths(1)
    }
    
    fun navigateToNextMonth() {
        _currentMonth.value = _currentMonth.value.plusMonths(1)
    }
    
    fun goToCurrentMonth() {
        _currentMonth.value = YearMonth.now()
    }
    
    fun hasDataForDate(date: LocalDate): Boolean {
        return _transactions.value.any { it.date == date }
    }
    
    fun getTransactionForDate(date: LocalDate): Transaction? {
        return _transactions.value.find { it.date == date }
    }
    
    fun isOffDay(date: LocalDate): Boolean {
        // Default off days: Sunday (7) and Saturday (6)
        return date.dayOfWeek.value in listOf(6, 7)
    }
    
    fun refreshData() {
        loadTransactions()
    }
    
    fun clearError() {
        _errorMessage.value = null
    }
}

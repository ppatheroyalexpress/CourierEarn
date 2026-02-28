package com.courierearn.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.courierearn.domain.usecase.SaveTransactionUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class DataEntryViewModel @Inject constructor(
    private val saveTransactionUseCase: SaveTransactionUseCase
) : ViewModel() {
    
    // Form state
    private val _selectedDate = MutableStateFlow(LocalDate.now())
    val selectedDate: StateFlow<LocalDate> = _selectedDate.asStateFlow()
    
    private val _cashCollectCount = MutableStateFlow("0")
    val cashCollectCount: StateFlow<String> = _cashCollectCount.asStateFlow()
    
    private val _senderPayCount = MutableStateFlow("0")
    val senderPayCount: StateFlow<String> = _senderPayCount.asStateFlow()
    
    private val _rejectedCount = MutableStateFlow("0")
    val rejectedCount: StateFlow<String> = _rejectedCount.asStateFlow()
    
    private val _ecCount = MutableStateFlow("0")
    val ecCount: StateFlow<String> = _ecCount.asStateFlow()
    
    // UI state
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()
    
    private val _dailyTotal = MutableStateFlow(0)
    val dailyTotal: StateFlow<Int> = _dailyTotal.asStateFlow()
    
    init {
        calculateDailyTotal()
    }
    
    fun updateDate(date: LocalDate) {
        _selectedDate.value = date
        clearForm()
    }
    
    fun updateCashCollectCount(count: String) {
        _cashCollectCount.value = count
        calculateDailyTotal()
    }
    
    fun updateSenderPayCount(count: String) {
        _senderPayCount.value = count
        calculateDailyTotal()
    }
    
    fun updateRejectedCount(count: String) {
        _rejectedCount.value = count
        calculateDailyTotal()
    }
    
    fun updateEcCount(count: String) {
        _ecCount.value = count
        calculateDailyTotal()
    }
    
    private fun calculateDailyTotal() {
        viewModelScope.launch {
            try {
                val cashCollect = _cashCollectCount.value.toIntOrNull() ?: 0
                val senderPay = _senderPayCount.value.toIntOrNull() ?: 0
                val rejected = _rejectedCount.value.toIntOrNull() ?: 0
                val foc = 0 // FOC is included in rejected for simplicity
                
                val total = (cashCollect * 200) + (senderPay * 100) + (rejected * 0) + (foc * 0)
                _dailyTotal.value = total
            } catch (e: NumberFormatException) {
                _errorMessage.value = "Please enter valid numbers"
            }
        }
    }
    
    fun clearForm() {
        _cashCollectCount.value = "0"
        _senderPayCount.value = "0"
        _rejectedCount.value = "0"
        _ecCount.value = "0"
        _dailyTotal.value = 0
        _errorMessage.value = null
        _successMessage.value = null
    }
    
    fun saveTransaction() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            _successMessage.value = null
            
            try {
                val cashCollect = _cashCollectCount.value.toIntOrNull() ?: 0
                val senderPay = _senderPayCount.value.toIntOrNull() ?: 0
                val rejected = _rejectedCount.value.toIntOrNull() ?: 0
                val foc = 0 // FOC is included in rejected
                val ec = _ecCount.value.toIntOrNull() ?: 0
                
                val result = saveTransactionUseCase(
                    date = _selectedDate.value,
                    cashCollect = cashCollect,
                    senderPay = senderPay,
                    rejected = rejected,
                    foc = foc,
                    ec = ec
                )
                
                if (result.isSuccess) {
                    _successMessage.value = "Transaction saved successfully!"
                    clearForm()
                } else {
                    _errorMessage.value = "Failed to save transaction: ${result.exceptionOrNull()?.message}"
                }
                
                _isLoading.value = false
            } catch (e: Exception) {
                _errorMessage.value = "Error saving transaction: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    fun clearError() {
        _errorMessage.value = null
    }
    
    fun clearSuccessMessage() {
        _successMessage.value = null
    }
    
    fun getFormattedDailyTotal(): String {
        return "${_dailyTotal.value} MMK"
    }
    
    fun getSelectedDateFormatted(): String {
        val date = _selectedDate.value
        return "${date.month.name} ${date.dayOfMonth}, ${date.year}"
    }
}

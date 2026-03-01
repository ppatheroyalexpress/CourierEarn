package com.courierearn.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.courierearn.domain.model.HomeScreenData
import com.courierearn.domain.usecase.GetHomeScreenDataUseCase
import com.courierearn.domain.usecase.SaveTransactionUseCase
import com.courierearn.printer.PrintResult
import com.courierearn.printer.ThermalPrinterService
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getHomeScreenDataUseCase: GetHomeScreenDataUseCase,
    private val saveTransactionUseCase: SaveTransactionUseCase,
    private val thermalPrinterService: ThermalPrinterService
) : ViewModel() {
    
    private val _homeScreenData = MutableStateFlow<HomeScreenData?>(null)
    val homeScreenData: StateFlow<HomeScreenData?> = _homeScreenData.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _isPrinting = MutableStateFlow(false)
    val isPrinting: StateFlow<Boolean> = _isPrinting.asStateFlow()
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    private val _printMessage = MutableStateFlow<String?>(null)
    val printMessage: StateFlow<String?> = _printMessage.asStateFlow()
    
    init {
        loadHomeScreenData()
    }
    
    private fun loadHomeScreenData() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                getHomeScreenDataUseCase().collect { data ->
                    _homeScreenData.value = data
                    _isLoading.value = false
                }
            } catch (e: Exception) {
                _errorMessage.value = "Failed to load home screen data: ${e.message}"
                _isLoading.value = false
            }
        }
    }
    
    fun refreshData() {
        loadHomeScreenData()
    }
    
    fun saveTodayTransaction(
        cashCollect: Int,
        senderPay: Int,
        rejected: Int,
        foc: Int,
        ec: Int
    ) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            
            try {
                val result = saveTransactionUseCase(
                    date = LocalDate.now(),
                    cashCollect = cashCollect,
                    senderPay = senderPay,
                    rejected = rejected,
                    foc = foc,
                    ec = ec
                )
                
                if (result.isSuccess) {
                    // Data saved successfully, refresh will happen automatically through flow
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
    
    fun printTodayReceipt() {
        viewModelScope.launch {
            _isPrinting.value = true
            _printMessage.value = null
            _errorMessage.value = null
            
            try {
                val todayTransaction = _homeScreenData.value?.todayTransaction
                if (todayTransaction == null) {
                    _errorMessage.value = "No transaction data available for today"
                    _isPrinting.value = false
                    return@launch
                }
                
                val result = thermalPrinterService.printTodayReceipt(todayTransaction)
                
                when (result) {
                    is PrintResult.Success -> {
                        _printMessage.value = "Receipt printed successfully!"
                    }
                    is PrintResult.Error -> {
                        _errorMessage.value = "Printing failed: ${result.message}"
                    }
                }
            } catch (e: Exception) {
                _errorMessage.value = "Error printing receipt: ${e.message}"
            } finally {
                _isPrinting.value = false
            }
        }
    }
    
    fun printDailySummary() {
        viewModelScope.launch {
            _isPrinting.value = true
            _printMessage.value = null
            _errorMessage.value = null
            
            try {
                val todayTransactions = _homeScreenData.value?.todayTransactions ?: emptyList()
                
                if (todayTransactions.isEmpty()) {
                    _errorMessage.value = "No transactions available for today"
                    _isPrinting.value = false
                    return@launch
                }
                
                val result = thermalPrinterService.printDailySummary(todayTransactions)
                
                when (result) {
                    is PrintResult.Success -> {
                        _printMessage.value = "Daily summary printed successfully!"
                    }
                    is PrintResult.Error -> {
                        _errorMessage.value = "Printing failed: ${result.message}"
                    }
                }
            } catch (e: Exception) {
                _errorMessage.value = "Error printing summary: ${e.message}"
            } finally {
                _isPrinting.value = false
            }
        }
    }
    
    fun isPrinterConnected(): Boolean {
        return thermalPrinterService.isPrinterConnected()
    }
    
    fun clearError() {
        _errorMessage.value = null
    }
    
    fun clearPrintMessage() {
        _printMessage.value = null
    }
}

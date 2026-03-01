package com.courierearn.presentation.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.courierearn.work.ReminderScheduler
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ReminderViewModel @Inject constructor(
    private val reminderScheduler: ReminderScheduler
) : ViewModel() {
    
    private val _isReminderEnabled = MutableStateFlow(false)
    val isReminderEnabled: StateFlow<Boolean> = _isReminderEnabled.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage.asStateFlow()
    
    private val _successMessage = MutableStateFlow<String?>(null)
    val successMessage: StateFlow<String?> = _successMessage.asStateFlow()
    
    init {
        checkReminderStatus()
    }
    
    private fun checkReminderStatus() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                _isReminderEnabled.value = reminderScheduler.isReminderScheduled()
            } catch (e: Exception) {
                _errorMessage.value = "Failed to check reminder status: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun enableDailyReminder() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            _successMessage.value = null
            
            try {
                reminderScheduler.scheduleDailyReminder()
                _isReminderEnabled.value = true
                _successMessage.value = "Daily reminder enabled at 8:00 PM"
            } catch (e: Exception) {
                _errorMessage.value = "Failed to enable reminder: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun disableDailyReminder() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            _successMessage.value = null
            
            try {
                reminderScheduler.cancelDailyReminder()
                _isReminderEnabled.value = false
                _successMessage.value = "Daily reminder disabled"
            } catch (e: Exception) {
                _errorMessage.value = "Failed to disable reminder: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun testReminder() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = null
            _successMessage.value = null
            
            try {
                reminderScheduler.scheduleImmediateReminder()
                _successMessage.value = "Test reminder sent! You should receive a notification shortly."
            } catch (e: Exception) {
                _errorMessage.value = "Failed to send test reminder: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }
    
    fun clearMessages() {
        _errorMessage.value = null
        _successMessage.value = null
    }
    
    fun refreshStatus() {
        checkReminderStatus()
    }
}

package com.courierearn.domain.repository

import kotlinx.coroutines.flow.Flow

interface SettingsRepository {
    // Get all settings as Flow
    fun getAllSettings(): Flow<Map<String, String>>
    
    // Get specific setting value
    suspend fun getSettingValue(key: String): String?
    
    // Get setting value as Flow
    fun getSettingValueFlow(key: String): Flow<String?>
    
    // Save setting
    suspend fun saveSetting(key: String, value: String)
    
    // Save multiple settings
    suspend fun saveSettings(settings: Map<String, String>)
    
    // Delete setting
    suspend fun deleteSetting(key: String)
    
    // Get user name
    suspend fun getUserName(): String
    
    // Save user name
    suspend fun saveUserName(name: String)
    
    // Get reminder enabled status
    suspend fun isReminderEnabled(): Boolean
    
    // Save reminder enabled status
    suspend fun saveReminderEnabled(enabled: Boolean)
    
    // Get reminder time
    suspend fun getReminderTime(): String
    
    // Save reminder time
    suspend fun saveReminderTime(time: String)
    
    // Get app version
    suspend fun getAppVersion(): String
    
    // Check if first launch
    suspend fun isFirstLaunch(): Boolean
    
    // Set first launch to false
    suspend fun setFirstLaunchCompleted()
    
    // Get all app settings
    suspend fun getAppSettings(): AppSettings
    
    data class AppSettings(
        val userName: String,
        val reminderEnabled: Boolean,
        val reminderTime: String,
        val appVersion: String,
        val isFirstLaunch: Boolean
    )
}

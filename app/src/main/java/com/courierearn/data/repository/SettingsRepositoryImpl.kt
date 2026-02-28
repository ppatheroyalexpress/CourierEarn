package com.courierearn.data.repository

import com.courierearn.data.database.dao.SettingsDao
import com.courierearn.data.database.entities.SettingsEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.time.Instant
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SettingsRepositoryImpl @Inject constructor(
    private val settingsDao: SettingsDao
) {
    
    // Get all settings as Flow
    fun getAllSettings(): Flow<Map<String, String>> {
        return settingsDao.getAllSettings().map { settings ->
            settings.associate { it.key to it.value }
        }
    }
    
    // Get specific setting value
    suspend fun getSettingValue(key: String): String? {
        return settingsDao.getSettingValue(key)
    }
    
    // Get setting value as Flow
    fun getSettingValueFlow(key: String): Flow<String?> {
        return getAllSettings().map { it[key] }
    }
    
    // Save setting
    suspend fun saveSetting(key: String, value: String) {
        val setting = SettingsEntity(
            key = key,
            value = value,
            updatedAt = Instant.now()
        )
        settingsDao.insertSetting(setting)
    }
    
    // Save multiple settings
    suspend fun saveSettings(settings: Map<String, String>) {
        val settingEntities = settings.map { (key, value) ->
            SettingsEntity(
                key = key,
                value = value,
                updatedAt = Instant.now()
            )
        }
        settingsDao.insertSettings(settingEntities)
    }
    
    // Delete setting
    suspend fun deleteSetting(key: String) {
        settingsDao.deleteSettingByKey(key)
    }
    
    // Get user name
    suspend fun getUserName(): String {
        return getSettingValue("user_name") ?: "PPA | 30 (Chanmyathazi East)"
    }
    
    // Save user name
    suspend fun saveUserName(name: String) {
        saveSetting("user_name", name)
    }
    
    // Get reminder enabled status
    suspend fun isReminderEnabled(): Boolean {
        return getSettingValue("reminder_enabled")?.toBoolean() ?: true
    }
    
    // Save reminder enabled status
    suspend fun saveReminderEnabled(enabled: Boolean) {
        saveSetting("reminder_enabled", enabled.toString())
    }
    
    // Get reminder time
    suspend fun getReminderTime(): String {
        return getSettingValue("reminder_time") ?: "20:00"
    }
    
    // Save reminder time
    suspend fun saveReminderTime(time: String) {
        saveSetting("reminder_time", time)
    }
    
    // Get app version
    suspend fun getAppVersion(): String {
        return getSettingValue("app_version") ?: "1.0.0"
    }
    
    // Check if first launch
    suspend fun isFirstLaunch(): Boolean {
        return getSettingValue("first_launch")?.toBoolean() ?: true
    }
    
    // Set first launch to false
    suspend fun setFirstLaunchCompleted() {
        saveSetting("first_launch", "false")
    }
    
    // Get all app settings as a data class
    suspend fun getAppSettings(): AppSettings {
        return AppSettings(
            userName = getUserName(),
            reminderEnabled = isReminderEnabled(),
            reminderTime = getReminderTime(),
            appVersion = getAppVersion(),
            isFirstLaunch = isFirstLaunch()
        )
    }
    
    data class AppSettings(
        val userName: String,
        val reminderEnabled: Boolean,
        val reminderTime: String,
        val appVersion: String,
        val isFirstLaunch: Boolean
    )
}

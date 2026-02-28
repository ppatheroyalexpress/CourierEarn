package com.courierearn.data.repository

import com.courierearn.domain.repository.SettingsRepository
import com.courierearn.data.repository.SettingsRepositoryImpl
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SettingsRepositoryMapper @Inject constructor(
    private val settingsRepositoryImpl: SettingsRepositoryImpl
) : SettingsRepository {
    
    override fun getAllSettings(): Flow<Map<String, String>> {
        return settingsRepositoryImpl.getAllSettings()
    }
    
    override suspend fun getSettingValue(key: String): String? {
        return settingsRepositoryImpl.getSettingValue(key)
    }
    
    override fun getSettingValueFlow(key: String): Flow<String?> {
        return settingsRepositoryImpl.getSettingValueFlow(key)
    }
    
    override suspend fun saveSetting(key: String, value: String) {
        settingsRepositoryImpl.saveSetting(key, value)
    }
    
    override suspend fun saveSettings(settings: Map<String, String>) {
        settingsRepositoryImpl.saveSettings(settings)
    }
    
    override suspend fun deleteSetting(key: String) {
        settingsRepositoryImpl.deleteSetting(key)
    }
    
    override suspend fun getUserName(): String {
        return settingsRepositoryImpl.getUserName()
    }
    
    override suspend fun saveUserName(name: String) {
        settingsRepositoryImpl.saveUserName(name)
    }
    
    override suspend fun isReminderEnabled(): Boolean {
        return settingsRepositoryImpl.isReminderEnabled()
    }
    
    override suspend fun saveReminderEnabled(enabled: Boolean) {
        settingsRepositoryImpl.saveReminderEnabled(enabled)
    }
    
    override suspend fun getReminderTime(): String {
        return settingsRepositoryImpl.getReminderTime()
    }
    
    override suspend fun saveReminderTime(time: String) {
        settingsRepositoryImpl.saveReminderTime(time)
    }
    
    override suspend fun getAppVersion(): String {
        return settingsRepositoryImpl.getAppVersion()
    }
    
    override suspend fun isFirstLaunch(): Boolean {
        return settingsRepositoryImpl.isFirstLaunch()
    }
    
    override suspend fun setFirstLaunchCompleted() {
        settingsRepositoryImpl.setFirstLaunchCompleted()
    }
    
    override suspend fun getAppSettings(): AppSettings {
        return settingsRepositoryImpl.getAppSettings()
    }
}

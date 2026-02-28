package com.courierearn.data.preferences

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "courier_earn_preferences")

@Singleton
class DataStoreManager @Inject constructor(
    private val context: Context
) {
    private val dataStore = context.dataStore
    
    // Preference keys
    companion object {
        val USER_NAME = stringPreferencesKey("user_name")
        val REMINDER_ENABLED = booleanPreferencesKey("reminder_enabled")
        val REMINDER_TIME = stringPreferencesKey("reminder_time")
        val APP_VERSION = stringPreferencesKey("app_version")
        val FIRST_LAUNCH = booleanPreferencesKey("first_launch")
        val THEME_MODE = stringPreferencesKey("theme_mode")
        val BACKUP_ENABLED = booleanPreferencesKey("backup_enabled")
        val LAST_BACKUP_TIME = longPreferencesKey("last_backup_time")
    }
    
    // User name
    suspend fun saveUserName(name: String) {
        dataStore.edit { preferences ->
            preferences[USER_NAME] = name
        }
    }
    
    fun getUserName(): Flow<String> {
        return dataStore.data.map { preferences ->
            preferences[USER_NAME] ?: "PPA | 30 (Chanmyathazi East)"
        }
    }
    
    // Reminder settings
    suspend fun saveReminderEnabled(enabled: Boolean) {
        dataStore.edit { preferences ->
            preferences[REMINDER_ENABLED] = enabled
        }
    }
    
    fun isReminderEnabled(): Flow<Boolean> {
        return dataStore.data.map { preferences ->
            preferences[REMINDER_ENABLED] ?: true
        }
    }
    
    suspend fun saveReminderTime(time: String) {
        dataStore.edit { preferences ->
            preferences[REMINDER_TIME] = time
        }
    }
    
    fun getReminderTime(): Flow<String> {
        return dataStore.data.map { preferences ->
            preferences[REMINDER_TIME] ?: "20:00"
        }
    }
    
    // App version
    suspend fun saveAppVersion(version: String) {
        dataStore.edit { preferences ->
            preferences[APP_VERSION] = version
        }
    }
    
    fun getAppVersion(): Flow<String> {
        return dataStore.data.map { preferences ->
            preferences[APP_VERSION] ?: "1.0.0"
        }
    }
    
    // First launch
    suspend fun setFirstLaunchCompleted() {
        dataStore.edit { preferences ->
            preferences[FIRST_LAUNCH] = false
        }
    }
    
    fun isFirstLaunch(): Flow<Boolean> {
        return dataStore.data.map { preferences ->
            preferences[FIRST_LAUNCH] ?: true
        }
    }
    
    // Theme mode
    suspend fun saveThemeMode(mode: String) {
        dataStore.edit { preferences ->
            preferences[THEME_MODE] = mode
        }
    }
    
    fun getThemeMode(): Flow<String> {
        return dataStore.data.map { preferences ->
            preferences[THEME_MODE] ?: "system"
        }
    }
    
    // Backup settings
    suspend fun saveBackupEnabled(enabled: Boolean) {
        dataStore.edit { preferences ->
            preferences[BACKUP_ENABLED] = enabled
        }
    }
    
    fun isBackupEnabled(): Flow<Boolean> {
        return dataStore.data.map { preferences ->
            preferences[BACKUP_ENABLED] ?: false
        }
    }
    
    suspend fun saveLastBackupTime(timestamp: Long) {
        dataStore.edit { preferences ->
            preferences[LAST_BACKUP_TIME] = timestamp
        }
    }
    
    fun getLastBackupTime(): Flow<Long> {
        return dataStore.data.map { preferences ->
            preferences[LAST_BACKUP_TIME] ?: 0L
        }
    }
    
    // Clear all preferences
    suspend fun clearAllPreferences() {
        dataStore.edit { preferences ->
            preferences.clear()
        }
    }
}

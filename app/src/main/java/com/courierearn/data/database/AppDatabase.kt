package com.courierearn.data.database

import androidx.room.*
import androidx.sqlite.db.SupportSQLiteDatabase
import com.courierearn.data.database.dao.*
import com.courierearn.data.database.entities.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import javax.inject.Inject
import javax.inject.Provider

@Database(
    entities = [
        TransactionEntity::class,
        SettingsEntity::class,
        MonthlySummaryEntity::class
    ],
    version = 2,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    
    abstract fun transactionDao(): TransactionDao
    abstract fun settingsDao(): SettingsDao
    abstract fun monthlySummaryDao(): MonthlySummaryDao
    
    class Callback @Inject constructor(
        private val database: Provider<AppDatabase>
    ) : RoomDatabase.Callback() {
        
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            val appDatabase = database.get()
            
            // Insert default settings in a coroutine
            CoroutineScope(Dispatchers.IO).launch {
                populateDefaultSettings(appDatabase.settingsDao())
            }
        }
        
        private suspend fun populateDefaultSettings(settingsDao: SettingsDao) {
            val defaultSettings = listOf(
                SettingsEntity(
                    key = "reminder_enabled",
                    value = "true",
                    updatedAt = Instant.now()
                ),
                SettingsEntity(
                    key = "reminder_time",
                    value = "20:00",
                    updatedAt = Instant.now()
                ),
                SettingsEntity(
                    key = "user_name",
                    value = "PPA | 30 (Chanmyathazi East)",
                    updatedAt = Instant.now()
                ),
                SettingsEntity(
                    key = "app_version",
                    value = "1.0.0",
                    updatedAt = Instant.now()
                ),
                SettingsEntity(
                    key = "first_launch",
                    value = "true",
                    updatedAt = Instant.now()
                )
            )
            
            settingsDao.insertSettings(defaultSettings)
        }
    }
}

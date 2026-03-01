package com.courierearn.work

import android.content.Context
import androidx.work.*
import dagger.hilt.android.qualifiers.ApplicationContext
import java.time.LocalTime
import java.time.ZoneId
import java.util.concurrent.TimeUnit
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ReminderScheduler @Inject constructor(
    @ApplicationContext private val context: Context
) {
    
    fun scheduleDailyReminder() {
        val currentTime = LocalTime.now()
        val scheduledTime = LocalTime.of(20, 0) // 8:00 PM
        
        val initialDelay = if (currentTime.isBefore(scheduledTime)) {
            java.time.Duration.between(currentTime, scheduledTime).toMillis()
        } else {
            // If it's already past 8 PM, schedule for tomorrow
            java.time.Duration.between(currentTime, scheduledTime).plusDays(1).toMillis()
        }
        
        val dailyWorkRequest = PeriodicWorkRequestBuilder<DailyDataReminderWorker>(
            1, TimeUnit.DAYS
        )
            .setInitialDelay(initialDelay, TimeUnit.MILLISECONDS)
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                    .setRequiresBatteryNotLow(false)
                    .build()
            )
            .addTag(DailyDataReminderWorker.WORK_NAME)
            .build()
        
        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            DailyDataReminderWorker.WORK_NAME,
            ExistingPeriodicWorkPolicy.UPDATE,
            dailyWorkRequest
        )
    }
    
    fun cancelDailyReminder() {
        WorkManager.getInstance(context).cancelUniqueWork(DailyDataReminderWorker.WORK_NAME)
    }
    
    fun isReminderScheduled(): Boolean {
        val workInfos = WorkManager.getInstance(context)
            .getWorkInfosByTag(DailyDataReminderWorker.WORK_NAME)
            .get()
        
        return workInfos.any { !it.state.isFinished }
    }
    
    fun scheduleImmediateReminder() {
        val oneTimeWorkRequest = OneTimeWorkRequestBuilder<DailyDataReminderWorker>()
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.NOT_REQUIRED)
                    .setRequiresBatteryNotLow(false)
                    .build()
            )
            .addTag(DailyDataReminderWorker.WORK_NAME)
            .build()
        
        WorkManager.getInstance(context).enqueue(oneTimeWorkRequest)
    }
}

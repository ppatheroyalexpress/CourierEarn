package com.courierearn

import android.app.Application
import dagger.hilt.android.HiltAndroidApp
import javax.inject.Inject

@HiltAndroidApp
class CourierEarnApplication : Application() {
    
    @Inject
    lateinit var reminderScheduler: com.courierearn.work.ReminderScheduler
    
    override fun onCreate() {
        super.onCreate()
        // Schedule daily reminder at 8 PM
        reminderScheduler.scheduleDailyReminder()
    }
}

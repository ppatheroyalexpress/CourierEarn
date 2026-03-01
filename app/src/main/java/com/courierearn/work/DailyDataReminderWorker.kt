package com.courierearn.work

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import androidx.hilt.work.HiltWorker
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.courierearn.R
import com.courierearn.domain.repository.TransactionRepository
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.time.LocalDate

@HiltWorker
class DailyDataReminderWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted workerParams: WorkerParameters,
    private val transactionRepository: TransactionRepository
) : CoroutineWorker(context, workerParams) {

    override suspend fun doWork(): Result {
        return try {
            val today = LocalDate.now()
            val hasDataForToday = checkIfDataExistsForDate(today)
            
            if (!hasDataForToday) {
                sendReminderNotification(today)
            }
            
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }
    
    private suspend fun checkIfDataExistsForDate(date: LocalDate): Boolean {
        return try {
            val transactions = transactionRepository.getTransactionsByDate(date)
            transactions.isNotEmpty()
        } catch (e: Exception) {
            false
        }
    }
    
    private fun sendReminderNotification(date: LocalDate) {
        val notificationManager = applicationContext.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        // Create notification channel for Android 8.0+
        val channelId = "daily_reminder_channel"
        val channelName = "Daily Data Reminder"
        val channel = NotificationChannel(
            channelId,
            channelName,
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Reminds to enter daily delivery data"
            enableLights(true)
            enableVibration(true)
        }
        
        notificationManager.createNotificationChannel(channel)
        
        // Create notification
        val notification = NotificationCompat.Builder(applicationContext, channelId)
            .setSmallIcon(R.drawable.ic_notification) // You'll need to add this icon
            .setContentTitle("Daily Data Reminder")
            .setContentText("Don't forget to enter your delivery data for today!")
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("You haven't entered any delivery data for ${date.dayOfMonth} ${date.month.name} ${date.year}. Tap to open the app and add your data now.")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()
        
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    companion object {
        const val NOTIFICATION_ID = 1001
        const val WORK_NAME = "DailyDataReminderWork"
    }
}

package com.courierearn

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class CourierEarnApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
    }
}

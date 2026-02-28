package com.courierearn.data.database.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.Instant

@Entity(tableName = "settings")
data class SettingsEntity(
    @PrimaryKey 
    val key: String,
    val value: String,
    val updatedAt: Instant
)

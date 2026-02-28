package com.courierearn.presentation.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen() {
    var reminderEnabled by remember { mutableStateOf(true) }
    var reminderTime by remember { mutableStateOf("8:00 PM") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Settings",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 24.dp)
        )
        
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // User Profile Section
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "User Profile",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                        
                        SettingItem(
                            title = "Name",
                            subtitle = "PPA | 30 (Chanmyathazi East)",
                            onClick = { /* Edit profile */ }
                        )
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        
                        SettingItem(
                            title = "Version",
                            subtitle = "v1.0.0 (Yam)",
                            onClick = { /* Check for updates */ }
                        )
                    }
                }
            }
            
            item {
                // Reminder Settings
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Reminder Settings",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = "Daily Reminder",
                                    style = MaterialTheme.typography.bodyLarge
                                )
                                Text(
                                    text = "Remind to enter daily data at $reminderTime",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            
                            Switch(
                                checked = reminderEnabled,
                                onCheckedChange = { reminderEnabled = it }
                            )
                        }
                        
                        if (reminderEnabled) {
                            Spacer(modifier = Modifier.height(12.dp))
                            
                            OutlinedButton(
                                onClick = { /* Change reminder time */ },
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Change Time: $reminderTime")
                            }
                        }
                    }
                }
            }
            
            item {
                // Data Management
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Data Management",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                        
                        SettingItem(
                            title = "Backup Data",
                            subtitle = "Export all data to JSON file",
                            onClick = { /* Backup data */ }
                        )
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        
                        SettingItem(
                            title = "Restore Data",
                            subtitle = "Import data from backup file",
                            onClick = { /* Restore data */ }
                        )
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        
                        SettingItem(
                            title = "Clear All Data",
                            subtitle = "Delete all transaction records",
                            onClick = { /* Clear data */ },
                            isDestructive = true
                        )
                    }
                }
            }
            
            item {
                // About Section
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "About",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )
                        
                        SettingItem(
                            title = "CourierEarn",
                            subtitle = "Courier Commission Tracker for CATZ (East Section)",
                            onClick = { /* Show app info */ }
                        )
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        
                        SettingItem(
                            title = "Help & Support",
                            subtitle = "Get help with the app",
                            onClick = { /* Open help */ }
                        )
                        
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        
                        SettingItem(
                            title = "Privacy Policy",
                            subtitle = "View privacy policy",
                            onClick = { /* Open privacy policy */ }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SettingItem(
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    isDestructive: Boolean = false
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge,
                color = if (isDestructive) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = if (isDestructive) 
                    MaterialTheme.colorScheme.error 
                else 
                    MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        TextButton(onClick = onClick) {
            Text(
                text = if (isDestructive) "Clear" else "Edit",
                color = if (isDestructive) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
            )
        }
    }
}

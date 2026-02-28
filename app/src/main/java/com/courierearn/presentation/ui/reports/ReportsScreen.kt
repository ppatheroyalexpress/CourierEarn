package com.courierearn.presentation.ui.reports

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Reports",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 24.dp)
        )
        
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // Monthly Summary Card
                SummaryCard(
                    title = "Monthly Summary",
                    subtitle = "Current month earnings",
                    totalEarnings = "0 MMK",
                    totalDeliveries = 0,
                    ecBonus = "0 MMK"
                )
            }
            
            item {
                // Weekly Summary Card
                SummaryCard(
                    title = "Weekly Summary",
                    subtitle = "This week earnings",
                    totalEarnings = "0 MMK",
                    totalDeliveries = 0,
                    ecBonus = "0 MMK"
                )
            }
            
            item {
                // Export Options
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Export Options",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 16.dp)
                        )
                        
                        ExportOptionButton(
                            text = "Export Monthly Report (PDF)",
                            onClick = { /* Export PDF */ }
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        ExportOptionButton(
                            text = "Export Weekly Report (PDF)",
                            onClick = { /* Export PDF */ }
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        ExportOptionButton(
                            text = "Print Receipt (Bluetooth)",
                            onClick = { /* Print via Bluetooth */ }
                        )
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        ExportOptionButton(
                            text = "Backup Data (JSON)",
                            onClick = { /* Backup data */ }
                        )
                    }
                }
            }
            
            item {
                // Transaction Breakdown
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Text(
                            text = "Transaction Breakdown",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(bottom = 16.dp)
                        )
                        
                        TransactionBreakdownItem(
                            type = "Cash Collect",
                            count = 0,
                            value = "0 MMK",
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        TransactionBreakdownItem(
                            type = "Sender Pay",
                            count = 0,
                            value = "0 MMK",
                            color = MaterialTheme.colorScheme.secondary
                        )
                        
                        TransactionBreakdownItem(
                            type = "Rejected/FOC",
                            count = 0,
                            value = "0 MMK",
                            color = MaterialTheme.colorScheme.outline
                        )
                        
                        TransactionBreakdownItem(
                            type = "EC Bonus",
                            count = 0,
                            value = "0 MMK",
                            color = MaterialTheme.colorScheme.tertiary
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SummaryCard(
    title: String,
    subtitle: String,
    totalEarnings: String,
    totalDeliveries: Int,
    ecBonus: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(bottom = 4.dp)
            )
            
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Total Deliveries",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = totalDeliveries.toString(),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                Column {
                    Text(
                        text = "Total Earnings",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = totalEarnings,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                
                Column {
                    Text(
                        text = "EC Bonus",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        text = ecBonus,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.tertiary
                    )
                }
            }
        }
    }
}

@Composable
fun ExportOptionButton(
    text: String,
    onClick: () -> Unit
) {
    OutlinedButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(text)
    }
}

@Composable
fun TransactionBreakdownItem(
    type: String,
    count: Int,
    value: String,
    color: androidx.compose.ui.graphics.Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Card(
                modifier = Modifier.size(12.dp),
                colors = CardDefaults.cardColors(containerColor = color)
            ) {}
            
            Spacer(modifier = Modifier.width(8.dp))
            
            Text(
                text = type,
                style = MaterialTheme.typography.bodyMedium
            )
        }
        
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "$count × ",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

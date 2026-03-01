package com.courierearn.presentation.ui.reports

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import java.time.LocalDate
import java.time.YearMonth

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ReportsFragment(
    viewModel: ReportsViewModel = hiltViewModel()
) {
    val isLoading by viewModel.isLoading.collectAsStateWithLifecycle()
    val errorMessage by viewModel.errorMessage.collectAsStateWithLifecycle()
    val successMessage by viewModel.successMessage.collectAsStateWithLifecycle()
    val monthlyData by remember { mutableStateOf(viewModel.getCurrentMonthData()) }
    val weeklyData by remember { mutableStateOf(viewModel.getCurrentWeekData()) }
    
    // Show error snackbar
    LaunchedEffect(errorMessage) {
        errorMessage?.let {
            // Handle error display (e.g., show snackbar)
        }
    }
    
    // Show success snackbar
    LaunchedEffect(successMessage) {
        successMessage?.let {
            // Handle success display (e.g., show snackbar)
        }
    }
    
    Box(modifier = Modifier.fillMaxSize()) {
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
                        totalEarnings = "${monthlyData.totalEarnings} MMK",
                        totalDeliveries = monthlyData.totalDeliveries,
                        ecBonus = "${monthlyData.ecBonus} MMK"
                    )
                }
                
                item {
                    // Weekly Summary Card
                    SummaryCard(
                        title = "Weekly Summary",
                        subtitle = "This week earnings",
                        totalEarnings = "${weeklyData.totalEarnings} MMK",
                        totalDeliveries = weeklyData.totalDeliveries,
                        ecBonus = "${weeklyData.ecBonus} MMK"
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
                                onClick = { 
                                    viewModel.generateMonthlyReport(YearMonth.now())
                                },
                                enabled = !isLoading
                            )
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            ExportOptionButton(
                                text = "Export Weekly Report (PDF)",
                                onClick = { 
                                    val today = LocalDate.now()
                                    val weekStart = today.minusDays(today.dayOfWeek.value % 7L)
                                    val weekEnd = weekStart.plusDays(6)
                                    viewModel.generateWeeklyReport(weekStart, weekEnd)
                                },
                                enabled = !isLoading
                            )
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            ExportOptionButton(
                                text = "Print Receipt (Bluetooth)",
                                onClick = { /* Print via Bluetooth */ },
                                enabled = !isLoading
                            )
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            ExportOptionButton(
                                text = "Backup Data (JSON)",
                                onClick = { /* Backup data */ },
                                enabled = !isLoading
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
                                count = monthlyData.cashCollectCount,
                                value = "${monthlyData.cashCollectCount * 200} MMK",
                                color = MaterialTheme.colorScheme.primary
                            )
                            
                            TransactionBreakdownItem(
                                type = "Sender Pay",
                                count = monthlyData.senderPayCount,
                                value = "${monthlyData.senderPayCount * 100} MMK",
                                color = MaterialTheme.colorScheme.secondary
                            )
                            
                            TransactionBreakdownItem(
                                type = "Rejected/FOC",
                                count = monthlyData.rejectedCount + monthlyData.focCount,
                                value = "0 MMK",
                                color = MaterialTheme.colorScheme.outline
                            )
                            
                            TransactionBreakdownItem(
                                type = "EC Bonus",
                                count = 0,
                                value = "${monthlyData.ecBonus} MMK",
                                color = MaterialTheme.colorScheme.tertiary
                            )
                        }
                    }
                }
            }
        }
        
        // Loading indicator
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Card {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "Generating PDF Report...",
                            style = MaterialTheme.typography.bodyMedium
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
    onClick: () -> Unit,
    enabled: Boolean = true
) {
    OutlinedButton(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        enabled = enabled
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

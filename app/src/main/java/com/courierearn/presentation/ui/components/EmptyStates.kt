package com.courierearn.presentation.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Comprehensive Empty States Component
 * Provides engaging and actionable empty states across the app
 */

sealed class EmptyStateType {
    object NoData : EmptyStateType()
    object NoTransactions : EmptyStateType()
    object NoPrinters : EmptyStateType()
    object NoReports : EmptyStateType()
    object NoReminders : EmptyStateType()
    object NoSearchResults : EmptyStateType()
    object NoInternet : EmptyStateType()
    object FirstLaunch : EmptyStateType()
}

data class EmptyStateInfo(
    val title: String,
    val description: String,
    val type: EmptyStateType,
    val primaryAction: EmptyAction? = null,
    val secondaryAction: EmptyAction? = null,
    val illustration: String? = null
)

data class EmptyAction(
    val text: String,
    val action: () -> Unit,
    val icon: ImageVector? = null
)

@Composable
fun EmptyStateScreen(
    emptyStateInfo: EmptyStateInfo,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier
                .padding(24.dp)
                .fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(32.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // Illustration/Icon
                getEmptyStateIllustration(emptyStateInfo.type)
                
                // Title
                Text(
                    text = emptyStateInfo.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center
                )
                
                // Description
                Text(
                    text = emptyStateInfo.description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    lineHeight = 20.sp
                )
                
                // Actions
                Column(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    emptyStateInfo.primaryAction?.let { primary ->
                        Button(
                            onClick = primary.action,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                primary.icon?.let { icon ->
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = null,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Text(primary.text)
                            }
                        }
                    }
                    
                    emptyStateInfo.secondaryAction?.let { secondary ->
                        OutlinedButton(
                            onClick = secondary.action,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                secondary.icon?.let { icon ->
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = null,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Text(secondary.text)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun EmptyStateInline(
    emptyStateInfo: EmptyStateInfo,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Icon
            Icon(
                imageVector = getEmptyStateIcon(emptyStateInfo.type),
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            // Content
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                Text(
                    text = emptyStateInfo.title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                
                Text(
                    text = emptyStateInfo.description,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                // Primary Action
                emptyStateInfo.primaryAction?.let { primary ->
                    TextButton(onClick = primary.action) {
                        Text(primary.text)
                    }
                }
            }
        }
    }
}

@Composable
fun NoDataEmptyState(
    onAddData: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Data Yet",
        description = "Start tracking your deliveries by adding your first transaction. Your data will appear here once you've made your first entry.",
        type = EmptyStateType.NoData,
        primaryAction = EmptyAction(
            text = "Add Your First Delivery",
            action = onAddData,
            icon = Icons.Default.Add
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoTransactionsEmptyState(
    onAddTransaction: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Transactions",
        description = "You haven't recorded any transactions yet. Tap the button below to add your first delivery record.",
        type = EmptyStateType.NoTransactions,
        primaryAction = EmptyAction(
            text = "Add Transaction",
            action = onAddTransaction,
            icon = Icons.Default.Add
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoPrintersEmptyState(
    onConnectPrinter: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Printers Found",
        description = "No Bluetooth printers are connected. Make sure your printer is paired with this device and try again.",
        type = EmptyStateType.NoPrinters,
        primaryAction = EmptyAction(
            text = "Connect Printer",
            action = onConnectPrinter,
            icon = Icons.Default.Bluetooth
        ),
        secondaryAction = EmptyAction(
            text = "Bluetooth Settings",
            action = { /* Open Bluetooth settings */ },
            icon = Icons.Default.Settings
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoReportsEmptyState(
    onGenerateReport: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Reports Available",
        description = "Reports will be available once you have recorded some transactions. Start adding data to generate your first report.",
        type = EmptyStateType.NoReports,
        primaryAction = EmptyAction(
            text = "Add Data",
            action = onGenerateReport,
            icon = Icons.Default.Add
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoRemindersEmptyState(
    onEnableReminder: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "Reminders Disabled",
        description = "Daily reminders are currently disabled. Enable reminders to get notified at 8 PM if you haven't entered your delivery data.",
        type = EmptyStateType.NoReminders,
        primaryAction = EmptyAction(
            text = "Enable Reminders",
            action = onEnableReminder,
            icon = Icons.Default.Notifications
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoSearchResultsEmptyState(
    searchQuery: String,
    onClearSearch: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Results Found",
        description = "No transactions found for \"$searchQuery\". Try searching with different keywords or clear the search to see all transactions.",
        type = EmptyStateType.NoSearchResults,
        primaryAction = EmptyAction(
            text = "Clear Search",
            action = onClearSearch,
            icon = Icons.Default.Clear
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun NoInternetEmptyState(
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "No Internet Connection",
        description = "You're offline. Check your internet connection and try again to access all features.",
        type = EmptyStateType.NoInternet,
        primaryAction = EmptyAction(
            text = "Retry",
            action = onRetry,
            icon = Icons.Default.Refresh
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
fun FirstLaunchEmptyState(
    onGetStarted: () -> Unit,
    modifier: Modifier = Modifier
) {
    val emptyStateInfo = EmptyStateInfo(
        title = "Welcome to CourierEarn!",
        description = "Your delivery tracking companion. Start by adding your first delivery record to begin tracking your earnings and progress.",
        type = EmptyStateType.FirstLaunch,
        primaryAction = EmptyAction(
            text = "Get Started",
            action = onGetStarted,
            icon = Icons.Default.PlayArrow
        ),
        secondaryAction = EmptyAction(
            text = "Learn More",
            action = { /* Show tutorial */ },
            icon = Icons.Default.Help
        )
    )
    
    EmptyStateScreen(
        emptyStateInfo = emptyStateInfo,
        modifier = modifier
    )
}

@Composable
private fun getEmptyStateIllustration(type: EmptyStateType) {
    Box(
        modifier = Modifier
            .size(120.dp)
            .background(
                color = MaterialTheme.colorScheme.primaryContainer,
                shape = RoundedCornerShape(60.dp)
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = getEmptyStateIcon(type),
            contentDescription = null,
            modifier = Modifier.size(60.dp),
            tint = MaterialTheme.colorScheme.primary
        )
    }
}

private fun getEmptyStateIcon(type: EmptyStateType): ImageVector {
    return when (type) {
        is EmptyStateType.NoData -> Icons.Default.Inbox
        is EmptyStateType.NoTransactions -> Icons.Default.ReceiptLong
        is EmptyStateType.NoPrinters -> Icons.Default.PrintDisabled
        is EmptyStateType.NoReports -> Icons.Default.Assessment
        is EmptyStateType.NoReminders -> Icons.Default.NotificationsOff
        is EmptyStateType.NoSearchResults -> Icons.Default.SearchOff
        is EmptyStateType.NoInternet -> Icons.Default.WifiOff
        is EmptyStateType.FirstLaunch -> Icons.Default.EmojiEvents
    }
}

// Empty state messages
object EmptyStateMessages {
    const val NO_DATA_TITLE = "No Data Yet"
    const val NO_DATA_DESCRIPTION = "Start tracking your deliveries by adding your first transaction."
    
    const val NO_TRANSACTIONS_TITLE = "No Transactions"
    const val NO_TRANSACTIONS_DESCRIPTION = "You haven't recorded any transactions yet."
    
    const val NO_PRINTERS_TITLE = "No Printers Found"
    const val NO_PRINTERS_DESCRIPTION = "No Bluetooth printers are connected."
    
    const val NO_REPORTS_TITLE = "No Reports Available"
    const val NO_REPORTS_DESCRIPTION = "Reports will be available once you have recorded transactions."
    
    const val NO_REMINDERS_TITLE = "Reminders Disabled"
    const val NO_REMINDERS_DESCRIPTION = "Daily reminders are currently disabled."
    
    const val NO_SEARCH_RESULTS_TITLE = "No Results Found"
    const val NO_SEARCH_RESULTS_DESCRIPTION = "No transactions found for your search."
    
    const val NO_INTERNET_TITLE = "No Internet Connection"
    const val NO_INTERNET_DESCRIPTION = "You're offline. Check your internet connection."
    
    const val FIRST_LAUNCH_TITLE = "Welcome to CourierEarn!"
    const val FIRST_LAUNCH_DESCRIPTION = "Your delivery tracking companion."
}

// Empty state actions
object EmptyStateActions {
    fun addData(action: () -> Unit) = EmptyAction(
        text = "Add Data",
        action = action,
        icon = Icons.Default.Add
    )
    
    fun connectPrinter(action: () -> Unit) = EmptyAction(
        text = "Connect Printer",
        action = action,
        icon = Icons.Default.Bluetooth
    )
    
    fun enableReminders(action: () -> Unit) = EmptyAction(
        text = "Enable Reminders",
        action = action,
        icon = Icons.Default.Notifications
    )
    
    fun getStarted(action: () -> Unit) = EmptyAction(
        text = "Get Started",
        action = action,
        icon = Icons.Default.PlayArrow
    )
    
    fun retry(action: () -> Unit) = EmptyAction(
        text = "Retry",
        action = action,
        icon = Icons.Default.Refresh
    )
}

package com.courierearn.presentation.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

/**
 * Error Recovery Mechanisms
 * Provides comprehensive error recovery and user guidance
 */

sealed class RecoveryAction {
    object Retry : RecoveryAction()
    object Refresh : RecoveryAction()
    object Restart : RecoveryAction()
    object ClearCache : RecoveryAction()
    object CheckPermissions : RecoveryAction()
    object EnableBluetooth : RecoveryAction()
    object GrantStorage : RecoveryAction()
    object ContactSupport : RecoveryAction()
    object ReportBug : RecoveryAction()
    data class Custom(val action: String, val icon: ImageVector) : RecoveryAction()
}

data class RecoveryOption(
    val action: RecoveryAction,
    val description: String,
    val steps: List<String> = emptyList(),
    val isRecommended: Boolean = false,
    val execute: suspend () -> RecoveryResult
)

sealed class RecoveryResult {
    object Success : RecoveryResult()
    data class Partial(val message: String) : RecoveryResult()
    data class Failed(val error: String) : RecoveryResult()
    object RequiresUserAction : RecoveryResult()
}

@Composable
fun ErrorRecoveryDialog(
    errorTitle: String,
    errorDescription: String,
    recoveryOptions: List<RecoveryOption>,
    onDismiss: () -> Unit,
    onRecoveryComplete: (RecoveryResult) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedOption by remember { mutableStateOf<RecoveryOption?>(null) }
    var isExecuting by remember { mutableStateOf(false) }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        modifier = modifier
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Error Title
                Text(
                    text = errorTitle,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.error
                )
                
                // Error Description
                Text(
                    text = errorDescription,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurface
                )
                
                // Recovery Options
                if (recoveryOptions.isNotEmpty()) {
                    Text(
                        text = "How to fix this:",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium
                    )
                    
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        recoveryOptions.forEach { option ->
                            RecoveryOptionCard(
                                option = option,
                                isSelected = selectedOption == option,
                                onSelect = { selectedOption = option },
                                isExecuting = isExecuting && selectedOption == option
                            )
                        }
                    }
                }
                
                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel")
                    }
                    
                    Button(
                        onClick = {
                            selectedOption?.let { option ->
                                isExecuting = true
                                // Execute recovery action
                                onRecoveryComplete(RecoveryResult.Success) // Simplified for now
                                isExecuting = false
                                onDismiss()
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = selectedOption != null && !isExecuting
                    ) {
                        if (isExecuting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                        }
                        Text(if (isExecuting) "Fixing..." else "Apply Fix")
                    }
                }
            }
        }
    }
}

@Composable
private fun RecoveryOptionCard(
    option: RecoveryOption,
    isSelected: Boolean,
    onSelect: () -> Unit,
    isExecuting: Boolean
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .let { if (isSelected) it else it },
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected)
                MaterialTheme.colorScheme.primaryContainer
            else
                MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = if (isSelected) 8.dp else 2.dp
        ),
        onClick = onSelect
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = getRecoveryActionIcon(option.action),
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = if (isSelected)
                        MaterialTheme.colorScheme.primary
                    else
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Text(
                    text = getRecoveryActionTitle(option.action),
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = if (option.isRecommended) FontWeight.Bold else FontWeight.Medium,
                    color = if (isSelected)
                        MaterialTheme.colorScheme.primary
                    else
                        MaterialTheme.colorScheme.onSurface
                )
                
                if (option.isRecommended) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Text(
                            text = "Recommended",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                }
            }
            
            Text(
                text = option.description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            if (option.steps.isNotEmpty()) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Text(
                        text = "Steps:",
                        style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Medium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    option.steps.forEachIndexed { index, step ->
                        Text(
                            text = "${index + 1}. $step",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
            
            if (isExecuting) {
                LinearProgressIndicator(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
fun QuickRecoveryActions(
    errorType: String,
    onAction: (RecoveryAction) -> Unit,
    modifier: Modifier = Modifier
) {
    val actions = getQuickRecoveryActions(errorType)
    
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text(
                text = "Quick Actions:",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Medium
            )
            
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                actions.take(3).forEach { action ->
                    OutlinedButton(
                        onClick = { onAction(action) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            Icon(
                                imageVector = getRecoveryActionIcon(action),
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = getRecoveryActionTitle(action),
                                style = MaterialTheme.typography.labelSmall
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ErrorRecoveryGuide(
    errorType: String,
    modifier: Modifier = Modifier
) {
    val guide = getErrorRecoveryGuide(errorType)
    
    Card(
        modifier = modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Guide Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Help,
                    contentDescription = null,
                    modifier = Modifier.size(24.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                
                Text(
                    text = "Recovery Guide",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
            }
            
            // Guide Content
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.verticalScroll(rememberScrollState())
            ) {
                guide.sections.forEach { section ->
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Text(
                                text = section.title,
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            
                            section.content.forEach { content ->
                                Text(
                                    text = content,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
            }
            
            // Contact Support
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer
                )
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Support,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.error
                    )
                    
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = "Still having trouble?",
                            style = MaterialTheme.typography.titleSmall,
                            fontWeight = FontWeight.Medium,
                            color = MaterialTheme.colorScheme.error
                        )
                        
                        Text(
                            text = "Contact our support team for assistance",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onErrorContainer
                        )
                    }
                    
                    OutlinedButton(
                        onClick = { /* Contact support */ },
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = MaterialTheme.colorScheme.error
                        )
                    ) {
                        Text("Contact")
                    }
                }
            }
        }
    }
}

private fun getRecoveryActionIcon(action: RecoveryAction): ImageVector {
    return when (action) {
        is RecoveryAction.Retry -> Icons.Default.Refresh
        is RecoveryAction.Refresh -> Icons.Default.Sync
        is RecoveryAction.Restart -> Icons.Default.RestartAlt
        is RecoveryAction.ClearCache -> Icons.Default.Clear
        is RecoveryAction.CheckPermissions -> Icons.Default.Security
        is RecoveryAction.EnableBluetooth -> Icons.Default.Bluetooth
        is RecoveryAction.GrantStorage -> Icons.Default.SdCard
        is RecoveryAction.ContactSupport -> Icons.Default.Support
        is RecoveryAction.ReportBug -> Icons.Default.BugReport
        is RecoveryAction.Custom -> action.icon
    }
}

private fun getRecoveryActionTitle(action: RecoveryAction): String {
    return when (action) {
        is RecoveryAction.Retry -> "Retry"
        is RecoveryAction.Refresh -> "Refresh"
        is RecoveryAction.Restart -> "Restart App"
        is RecoveryAction.ClearCache -> "Clear Cache"
        is RecoveryAction.CheckPermissions -> "Check Permissions"
        is RecoveryAction.EnableBluetooth -> "Enable Bluetooth"
        is RecoveryAction.GrantStorage -> "Grant Storage Access"
        is RecoveryAction.ContactSupport -> "Contact Support"
        is RecoveryAction.ReportBug -> "Report Bug"
        is RecoveryAction.Custom -> action.action
    }
}

private fun getQuickRecoveryActions(errorType: String): List<RecoveryAction> {
    return when (errorType.lowercase()) {
        "network" -> listOf(
            RecoveryAction.Retry,
            RecoveryAction.Refresh,
            RecoveryAction.CheckPermissions
        )
        "bluetooth" -> listOf(
            RecoveryAction.EnableBluetooth,
            RecoveryAction.Retry,
            RecoveryAction.Restart
        )
        "storage" -> listOf(
            RecoveryAction.GrantStorage,
            RecoveryAction.ClearCache,
            RecoveryAction.Retry
        )
        "permission" -> listOf(
            RecoveryAction.CheckPermissions,
            RecoveryAction.Restart
        )
        else -> listOf(
            RecoveryAction.Retry,
            RecoveryAction.Refresh
        )
    }
}

private fun getErrorRecoveryGuide(errorType: String): ErrorRecoveryGuide {
    return when (errorType.lowercase()) {
        "network" -> ErrorRecoveryGuide(
            sections = listOf(
                GuideSection(
                    title = "Check Internet Connection",
                    content = listOf(
                        "Ensure Wi-Fi or mobile data is enabled",
                        "Try switching between Wi-Fi and mobile data",
                        "Check if other apps can access the internet"
                    )
                ),
                GuideSection(
                    title = "App Permissions",
                    content = listOf(
                        "Go to Settings > Apps > CourierEarn",
                        "Check if network permissions are granted",
                        "Enable all required permissions"
                    )
                )
            )
        )
        "bluetooth" -> ErrorRecoveryGuide(
            sections = listOf(
                GuideSection(
                    title = "Enable Bluetooth",
                    content = listOf(
                        "Swipe down from top of screen",
                        "Tap Bluetooth icon to enable",
                        "Ensure Bluetooth is discoverable"
                    )
                ),
                GuideSection(
                    title = "Pair Printer",
                    content = listOf(
                        "Put printer in pairing mode",
                        "Go to Bluetooth settings",
                        "Select your printer from the list"
                    )
                )
            )
        )
        "storage" -> ErrorRecoveryGuide(
            sections = listOf(
                GuideSection(
                    title = "Grant Storage Permission",
                    content = listOf(
                        "Go to Settings > Apps > CourierEarn",
                        "Tap Permissions > Storage",
                        "Allow storage access"
                    )
                ),
                GuideSection(
                    title = "Check Storage Space",
                    content = listOf(
                        "Ensure device has sufficient storage",
                        "Clear unnecessary files if needed",
                        "Try using external storage"
                    )
                )
            )
        )
        else -> ErrorRecoveryGuide(
            sections = listOf(
                GuideSection(
                    title = "General Troubleshooting",
                    content = listOf(
                        "Restart the app",
                        "Check for app updates",
                        "Clear app cache",
                        "Restart your device"
                    )
                )
            )
        )
    }
}

data class GuideSection(
    val title: String,
    val content: List<String>
)

data class ErrorRecoveryGuide(
    val sections: List<GuideSection>
)

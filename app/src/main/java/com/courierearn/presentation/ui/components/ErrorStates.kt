package com.courierearn.presentation.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.unit.sp

/**
 * Comprehensive Error States Component
 * Provides consistent error handling and recovery across the app
 */

sealed class ErrorType {
    object Network : ErrorType()
    object Validation : ErrorType()
    object Database : ErrorType()
    object Permission : ErrorType()
    object Bluetooth : ErrorType()
    object Storage : ErrorType()
    object Printer : ErrorType()
    object Export : ErrorType()
    object Unknown : ErrorType()
}

data class ErrorInfo(
    val title: String,
    val message: String,
    val type: ErrorType,
    val recoveryActions: List<ErrorAction> = emptyList(),
    val isCritical: Boolean = false
)

data class ErrorAction(
    val text: String,
    val action: () -> Unit,
    val isPrimary: Boolean = false
)

@Composable
fun ErrorScreen(
    errorInfo: ErrorInfo,
    modifier: Modifier = Modifier,
    onDismiss: (() -> Unit)? = null
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
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Error Icon
                Icon(
                    imageVector = getErrorIcon(errorInfo.type),
                    contentDescription = null,
                    modifier = Modifier.size(64.dp),
                    tint = if (errorInfo.isCritical) 
                        MaterialTheme.colorScheme.error 
                    else 
                        MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                // Error Title
                Text(
                    text = errorInfo.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = if (errorInfo.isCritical) 
                        MaterialTheme.colorScheme.error 
                    else 
                        MaterialTheme.colorScheme.onSurface,
                    textAlign = TextAlign.Center
                )
                
                // Error Message
                Text(
                    text = errorInfo.message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
                
                // Recovery Actions
                if (errorInfo.recoveryActions.isNotEmpty()) {
                    Column(
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        errorInfo.recoveryActions.forEach { action ->
                            Button(
                                onClick = action.action,
                                modifier = Modifier.fillMaxWidth(),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (action.isPrimary)
                                        MaterialTheme.colorScheme.primary
                                    else
                                        MaterialTheme.colorScheme.surfaceVariant
                                )
                            ) {
                                Text(
                                    text = action.text,
                                    color = if (action.isPrimary)
                                        MaterialTheme.colorScheme.onPrimary
                                    else
                                        MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }
                }
                
                // Dismiss Action
                onDismiss?.let { dismiss ->
                    OutlinedButton(
                        onClick = dismiss,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Dismiss")
                    }
                }
            }
        }
    }
}

@Composable
fun ErrorOverlay(
    errorInfo: ErrorInfo?,
    modifier: Modifier = Modifier,
    onDismiss: () -> Unit
) {
    errorInfo?.let { error ->
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(Color.Black.copy(alpha = 0.5f)),
            contentAlignment = Alignment.Center
        ) {
            Card(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Icon(
                        imageVector = getErrorIcon(error.type),
                        contentDescription = null,
                        modifier = Modifier.size(32.dp),
                        tint = MaterialTheme.colorScheme.error
                    )
                    
                    Text(
                        text = error.title,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.error,
                        textAlign = TextAlign.Center
                    )
                    
                    Text(
                        text = error.message,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                    
                    if (error.recoveryActions.isNotEmpty()) {
                        error.recoveryActions.firstOrNull { it.isPrimary }?.let { primaryAction ->
                            Button(
                                onClick = primaryAction.action,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(primaryAction.text)
                            }
                        }
                    }
                    
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Dismiss")
                    }
                }
            }
        }
    }
}

@Composable
fun InlineError(
    message: String,
    modifier: Modifier = Modifier,
    onRetry: (() -> Unit)? = null
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.errorContainer
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Error,
                contentDescription = null,
                modifier = Modifier.size(20.dp),
                tint = MaterialTheme.colorScheme.error
            )
            
            Text(
                text = message,
                modifier = Modifier.weight(1f),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onErrorContainer
            )
            
            onRetry?.let { retry ->
                IconButton(onClick = retry) {
                    Icon(
                        imageVector = Icons.Default.Refresh,
                        contentDescription = "Retry",
                        modifier = Modifier.size(20.dp),
                        tint = MaterialTheme.colorScheme.error
                    )
                }
            }
        }
    }
}

@Composable
fun ValidationError(
    fieldName: String,
    errorMessage: String,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        Icon(
            imageVector = Icons.Default.ErrorOutline,
            contentDescription = null,
            modifier = Modifier.size(16.dp),
            tint = MaterialTheme.colorScheme.error
        )
        
        Text(
            text = "$fieldName: $errorMessage",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.error,
            fontSize = 12.sp
        )
    }
}

@Composable
fun NetworkError(
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Network Error",
        message = "Unable to connect to the server. Please check your internet connection and try again.",
        type = ErrorType.Network,
        recoveryActions = listOf(
            ErrorAction(
                text = "Retry",
                action = onRetry,
                isPrimary = true
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

@Composable
fun PermissionError(
    permission: String,
    onRequestPermission: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Permission Required",
        message = "This app needs $permission permission to function properly. Please grant the permission to continue.",
        type = ErrorType.Permission,
        recoveryActions = listOf(
            ErrorAction(
                text = "Grant Permission",
                action = onRequestPermission,
                isPrimary = true
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

@Composable
fun BluetoothError(
    onEnableBluetooth: () -> Unit,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Bluetooth Error",
        message = "Unable to connect to Bluetooth printer. Please ensure Bluetooth is enabled and the printer is paired.",
        type = ErrorType.Bluetooth,
        recoveryActions = listOf(
            ErrorAction(
                text = "Enable Bluetooth",
                action = onEnableBluetooth,
                isPrimary = true
            ),
            ErrorAction(
                text = "Retry",
                action = onRetry
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

@Composable
fun StorageError(
    onGrantStorage: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Storage Error",
        message = "Unable to access storage. Please grant storage permission to save files.",
        type = ErrorType.Storage,
        recoveryActions = listOf(
            ErrorAction(
                text = "Grant Storage Permission",
                action = onGrantStorage,
                isPrimary = true
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

@Composable
fun PrinterError(
    errorMessage: String,
    onRetry: () -> Unit,
    onSettings: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Printer Error",
        message = errorMessage,
        type = ErrorType.Printer,
        recoveryActions = listOf(
            ErrorAction(
                text = "Retry",
                action = onRetry,
                isPrimary = true
            ),
            ErrorAction(
                text = "Printer Settings",
                action = onSettings
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

@Composable
fun ExportError(
    errorMessage: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val errorInfo = ErrorInfo(
        title = "Export Failed",
        message = errorMessage,
        type = ErrorType.Export,
        recoveryActions = listOf(
            ErrorAction(
                text = "Try Again",
                action = onRetry,
                isPrimary = true
            )
        )
    )
    
    ErrorScreen(
        errorInfo = errorInfo,
        modifier = modifier
    )
}

private fun getErrorIcon(errorType: ErrorType): ImageVector {
    return when (errorType) {
        is ErrorType.Network -> Icons.Default.WifiOff
        is ErrorType.Validation -> Icons.Default.ErrorOutline
        is ErrorType.Database -> Icons.Default.Storage
        is ErrorType.Permission -> Icons.Default.Security
        is ErrorType.Bluetooth -> Icons.Default.BluetoothDisabled
        is ErrorType.Storage -> Icons.Default.SdCardAlert
        is ErrorType.Printer -> Icons.Default.PrintDisabled
        is ErrorType.Export -> Icons.Default.FileDownloadOff
        is ErrorType.Unknown -> Icons.Default.Error
    }
}

// Predefined error messages
object ErrorMessages {
    const val NETWORK_ERROR = "Network connection failed. Please check your internet connection."
    const val VALIDATION_ERROR = "Please check your input and try again."
    const val DATABASE_ERROR = "Database operation failed. Please try again."
    const val PERMISSION_ERROR = "Required permission not granted."
    const val BLUETOOTH_ERROR = "Bluetooth connection failed. Please check your Bluetooth settings."
    const val STORAGE_ERROR = "Storage access denied. Please grant storage permission."
    const val PRINTER_ERROR = "Printer connection failed. Please check your printer."
    const val EXPORT_ERROR = "Export failed. Please try again."
    const val UNKNOWN_ERROR = "An unexpected error occurred. Please try again."
}

// Error recovery actions
object ErrorActions {
    fun retry(action: () -> Unit) = ErrorAction(
        text = "Retry",
        action = action,
        isPrimary = true
    )
    
    fun refresh(action: () -> Unit) = ErrorAction(
        text = "Refresh",
        action = action,
        isPrimary = true
    )
    
    fun dismiss(action: () -> Unit) = ErrorAction(
        text = "Dismiss",
        action = action
    )
    
    fun settings(action: () -> Unit) = ErrorAction(
        text = "Settings",
        action = action
    )
}

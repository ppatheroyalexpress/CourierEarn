package com.courierearn.presentation.ui.dataentry

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DataEntryScreen() {
    var cashCollectCount by remember { mutableStateOf("") }
    var senderPayCount by remember { mutableStateOf("") }
    var rejectedFocCount by remember { mutableStateOf("") }
    var ecCount by remember { mutableStateOf("") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Text(
            text = "Data Entry",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(bottom = 24.dp)
        )
        
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                // Cash Collect
                TransactionInputCard(
                    title = "Cash Collect",
                    subtitle = "200 MMK per transaction",
                    value = cashCollectCount,
                    onValueChange = { cashCollectCount = it },
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            item {
                // Sender Pay
                TransactionInputCard(
                    title = "Sender Pay",
                    subtitle = "100 MMK per transaction",
                    value = senderPayCount,
                    onValueChange = { senderPayCount = it },
                    color = MaterialTheme.colorScheme.secondary
                )
            }
            
            item {
                // Rejected/FOC
                TransactionInputCard(
                    title = "Rejected/FOC",
                    subtitle = "0 MMK per transaction",
                    value = rejectedFocCount,
                    onValueChange = { rejectedFocCount = it },
                    color = MaterialTheme.colorScheme.outline
                )
            }
            
            item {
                // EC Count
                TransactionInputCard(
                    title = "EC Count",
                    subtitle = "600 MMK per piece (calculated at month end)",
                    value = ecCount,
                    onValueChange = { ecCount = it },
                    color = MaterialTheme.colorScheme.tertiary
                )
            }
            
            item {
                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = { /* Clear form */ },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Clear")
                    }
                    
                    Button(
                        onClick = { /* Save data */ },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Save")
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TransactionInputCard(
    title: String,
    subtitle: String,
    value: String,
    onValueChange: (String) -> Unit,
    color: androidx.compose.ui.graphics.Color
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
            
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(bottom = 12.dp)
            )
            
            OutlinedTextField(
                value = value,
                onValueChange = onValueChange,
                label = { Text("Enter Quantity") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }
    }
}

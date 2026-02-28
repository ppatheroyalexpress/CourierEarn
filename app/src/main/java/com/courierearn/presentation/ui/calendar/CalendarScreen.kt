package com.courierearn.presentation.ui.calendar

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import java.time.LocalDate
import java.time.YearMonth

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarScreen() {
    var currentMonth by remember { mutableStateOf(YearMonth.now()) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { 
                currentMonth = currentMonth.minusMonths(1)
            }) {
                Text("◀")
            }
            
            Text(
                text = "${currentMonth.month.name} ${currentMonth.year}",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            
            IconButton(onClick = { 
                currentMonth = currentMonth.plusMonths(1)
            }) {
                Text("▶")
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Calendar Grid
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                // Weekday headers
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat").forEach { day ->
                        Text(
                            text = day,
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.Center
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Calendar days
                LazyVerticalGrid(
                    columns = GridCells.Fixed(7),
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    val daysInMonth = generateCalendarDays(currentMonth)
                    items(daysInMonth) { day ->
                        CalendarDayItem(day = day)
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Legend
        Card(
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Legend",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    LegendItem(color = MaterialTheme.colorScheme.primary, label = "Has Data")
                    LegendItem(color = MaterialTheme.colorScheme.surfaceVariant, label = "No Data")
                    LegendItem(color = MaterialTheme.colorScheme.tertiary, label = "Today")
                }
            }
        }
    }
}

@Composable
fun CalendarDayItem(day: CalendarDay) {
    Card(
        modifier = Modifier
            .size(40.dp)
            .padding(2.dp),
        colors = CardDefaults.cardColors(
            containerColor = when {
                day.isToday -> MaterialTheme.colorScheme.tertiaryContainer
                day.hasData -> MaterialTheme.colorScheme.primaryContainer
                else -> MaterialTheme.colorScheme.surfaceVariant
            }
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Text(
                text = day.dayOfMonth.toString(),
                style = MaterialTheme.typography.bodySmall,
                color = when {
                    day.isToday -> MaterialTheme.colorScheme.onTertiaryContainer
                    day.hasData -> MaterialTheme.colorScheme.onPrimaryContainer
                    else -> MaterialTheme.colorScheme.onSurfaceVariant
                }
            )
        }
    }
}

@Composable
fun LegendItem(color: androidx.compose.ui.graphics.Color, label: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Card(
            modifier = Modifier.size(16.dp),
            colors = CardDefaults.cardColors(containerColor = color)
        ) {}
        
        Spacer(modifier = Modifier.width(4.dp))
        
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall
        )
    }
}

data class CalendarDay(
    val dayOfMonth: Int,
    val hasData: Boolean = false,
    val isToday: Boolean = false
)

fun generateCalendarDays(yearMonth: YearMonth): List<CalendarDay> {
    val today = LocalDate.now()
    val firstDayOfMonth = yearMonth.atDay(1)
    val lastDayOfMonth = yearMonth.atEndOfMonth()
    val firstDayOfWeek = firstDayOfMonth.dayOfWeek.value % 7 // Adjust for Sunday start
    
    val days = mutableListOf<CalendarDay>()
    
    // Add empty days for alignment
    repeat(firstDayOfWeek) {
        days.add(CalendarDay(dayOfMonth = 0))
    }
    
    // Add actual days
    for (day in 1..lastDayOfMonth.dayOfMonth) {
        days.add(
            CalendarDay(
                dayOfMonth = day,
                hasData = false, // TODO: Check if day has data
                isToday = yearMonth.year == today.year && 
                         yearMonth.month == today.month && 
                         day == today.dayOfMonth
            )
        )
    }
    
    return days
}

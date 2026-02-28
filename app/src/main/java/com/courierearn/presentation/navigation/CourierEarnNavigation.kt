package com.courierearn.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.courierearn.presentation.ui.home.HomeScreen
import com.courierearn.presentation.ui.dataentry.DataEntryScreen
import com.courierearn.presentation.ui.calendar.CalendarScreen
import com.courierearn.presentation.ui.reports.ReportsScreen
import com.courierearn.presentation.ui.settings.SettingsScreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CourierEarnNavigation(
    navController: NavController = rememberNavController(),
    modifier: Modifier = Modifier
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            NavigationBar {
                BottomNavigationItem(
                    route = "home",
                    label = "Home",
                    icon = "Home",
                    currentRoute = currentRoute,
                    navController = navController
                )
                BottomNavigationItem(
                    route = "data_entry",
                    label = "Data Entry",
                    icon = "Edit",
                    currentRoute = currentRoute,
                    navController = navController
                )
                BottomNavigationItem(
                    route = "calendar",
                    label = "Calendar",
                    icon = "CalendarMonth",
                    currentRoute = currentRoute,
                    navController = navController
                )
                BottomNavigationItem(
                    route = "reports",
                    label = "Reports",
                    icon = "Assessment",
                    currentRoute = currentRoute,
                    navController = navController
                )
                BottomNavigationItem(
                    route = "settings",
                    label = "Settings",
                    icon = "Settings",
                    currentRoute = currentRoute,
                    navController = navController
                )
            }
        },
        modifier = modifier
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "home",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("home") {
                HomeScreen()
            }
            composable("data_entry") {
                DataEntryScreen()
            }
            composable("calendar") {
                CalendarScreen()
            }
            composable("reports") {
                ReportsScreen()
            }
            composable("settings") {
                SettingsScreen()
            }
        }
    }
}

@Composable
fun RowScope.BottomNavigationItem(
    route: String,
    label: String,
    icon: String,
    currentRoute: String?,
    navController: NavController
) {
    NavigationBarItem(
        icon = { 
            // TODO: Add proper icons
            Text(icon.first().toString())
        },
        label = { Text(label) },
        selected = currentRoute == route,
        onClick = {
            navController.navigate(route) {
                popUpTo(navController.graph.findStartDestination().id) {
                    saveState = true
                }
                launchSingleTop = true
                restoreState = true
            }
        }
    )
}

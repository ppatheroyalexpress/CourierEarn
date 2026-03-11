import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: '#f3f4f6',
                height: 60,
                paddingBottom: 8,
            },
            headerShown: false,
        }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Summary',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="apps-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="delivery"
                options={{
                    title: 'Delivery',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="paper-plane-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="pickup"
                options={{
                    title: 'Pickup',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="archive-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="kpi"
                options={{
                    title: 'Performance',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }: { color: string, size: number }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

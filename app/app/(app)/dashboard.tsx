import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { greeting } from '@courierearn/shared';
import { StatusTicker, Card } from '@courierearn/ui';

export default function DashboardScreen() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [summary, setSummary] = useState({
        todayCommission: 0,
        todayPickupTotal: 0,
        todayDeliveryTotal: 0,
        todayCashCollect: 0,
        todayNotCashCollect: 0,
        todayEc: 0,
        todayHouses: 0,
        todayParcels: 0,
        mtdEarnings: 0,
        mtdEc: 0,
    });
    const [tickerText, setTickerText] = useState("Loading...");
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUser(session.user);
            try {
                // Fetch from the web API for consistency
                const [summaryRes, tickerRes] = await Promise.all([
                    fetch('https://courier-earn.vercel.app/api/dashboard/summary', {
                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                    }),
                    fetch('https://courier-earn.vercel.app/api/dashboard/ticker', {
                        headers: { 'Authorization': `Bearer ${session.access_token}` }
                    })
                ]);

                if (summaryRes.ok) {
                    const data = await summaryRes.json();
                    setSummary(data);
                }
                if (tickerRes.ok) {
                    const data = await tickerRes.json();
                    setTickerText(data.text);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setTickerText("Error loading data");
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.greeting}>{greeting()}, {user?.email?.split('@')[0] || 'Courier'}</Text>
                <Text style={styles.subtitle}>Here's what's happening today.</Text>
            </View>

            <StatusTicker text={tickerText} />

            <View style={styles.grid}>
                <View style={styles.fullWidthCard}>
                    <Card variant="elevated">
                        <Text style={styles.cardLabel}>Today's Commission</Text>
                        <Text style={styles.cardValue}>{summary.todayCommission.toFixed(2)}</Text>
                    </Card>
                </View>
                
                <View style={styles.row}>
                    <View style={styles.halfWidthCard}>
                        <Card variant="elevated">
                            <Text style={styles.cardLabel}>Today's Delivery</Text>
                            <Text style={styles.cardValue}>{summary.todayCashCollect} ({summary.todayNotCashCollect})</Text>
                            <Text style={styles.cardSublabel}>Cash (Not Cash)</Text>
                        </Card>
                    </View>
                    <View style={styles.halfWidthCard}>
                        <Card variant="elevated">
                            <Text style={styles.cardLabel}>Today's Pickup</Text>
                            <Text style={styles.cardValue}>{summary.todayHouses} ({summary.todayParcels})</Text>
                            <Text style={styles.cardSublabel}>Houses (Parcels)</Text>
                        </Card>
                    </View>
                </View>
                
                <View style={styles.row}>
                    <View style={styles.halfWidthCard}>
                        <Card variant="inverse" padding={30}>
                            <Text style={[styles.cardLabel, styles.inverseText]}>MTD Earnings</Text>
                            <Text style={[styles.cardValue, styles.inverseText]}>{summary.mtdEarnings.toFixed(2)}</Text>
                            <Text style={[styles.cardSublabel, styles.inverseText]}>MMK</Text>
                        </Card>
                    </View>
                    <View style={styles.halfWidthCard}>
                        <Card variant="elevated">
                            <Text style={styles.cardLabel}>Month to Date EC</Text>
                            <Text style={styles.cardValue}>{summary.mtdEc}</Text>
                            <Text style={styles.cardSublabel}>pcs</Text>
                        </Card>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    grid: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    fullWidthCard: {
        width: '100%',
    },
    halfWidthCard: {
        flex: 1,
    },
    footer: {
        marginTop: 16,
        marginBottom: 40,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    cardSublabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 4,
    },
    cardValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000',
    },
    cardValueSmall: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    unit: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#666',
    },
    inverseCard: {
        backgroundColor: '#000',
        margin: -20,
        padding: 20,
        borderRadius: 20,
    },
    inverseText: {
        color: '#fff',
    }
});

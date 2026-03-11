import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { Card } from '@courierearn/ui';

export default function KPIScreen() {
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState<any>(null);
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // For now, let's try to fetch from the web API or use a placeholder
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch("https://courier-earn.vercel.app/api/kpi/current", {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setKpiData(data);
                }
            } catch (err) {
                console.error("Error fetching KPI:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <header style={styles.header}>
                <View>
                    <Text style={styles.title}>KPI Performance</Text>
                    <Text style={styles.subtitle}>Track your delivery and pickup targets.</Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowHelp(true)}
                    style={styles.helpButton}
                >
                    <Text style={styles.helpText}>?</Text>
                </TouchableOpacity>
            </header>

            <Modal
                transparent={true}
                visible={showHelp}
                animationType="fade"
                onRequestClose={() => setShowHelp(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>KPI Scoring Rules</Text>
                            <TouchableOpacity onPress={() => setShowHelp(false)}>
                                <Text style={styles.closeIcon}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.ruleItem}>
                            <View>
                                <Text style={styles.ruleLabel}>Delivery Waybill</Text>
                                <Text style={styles.ruleSub}>Base Points</Text>
                            </View>
                            <Text style={styles.ruleValue}>+1.0</Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <View>
                                <Text style={styles.ruleLabel}>Pickup Location</Text>
                                <Text style={styles.ruleSub}>Efficiency</Text>
                            </View>
                            <Text style={styles.ruleValue}>+1.0</Text>
                        </View>

                        <View style={styles.ruleItem}>
                            <View>
                                <Text style={styles.ruleLabel}>Pickup Waybill</Text>
                                <Text style={styles.ruleSub}>Volume Bonus</Text>
                            </View>
                            <Text style={styles.ruleValue}>+0.1</Text>
                        </View>

                        <View style={styles.penaltyBox}>
                            <Text style={styles.penaltyTitle}>Warning Penalty:</Text>
                            <Text style={styles.penaltyText}>
                                Any recorded violation or warning during the month will result in an automatic grade reduction, regardless of total points.
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.grid}>
                <View style={styles.blackCard}>
                    <Text style={styles.cardHeaderSmall}>Daily Points</Text>
                    <Text style={styles.cardValueLarge}>{kpiData?.dailyPoints?.total?.toFixed(1) || "0.0"}</Text>
                </View>

                <Card padding={30}>
                    <Text style={styles.cardHeaderSmallGrey}>Monthly Achievement</Text>
                    <Text style={styles.cardValueLargeBlack}>{kpiData?.monthlyKpi?.total_points || 0}</Text>
                </Card>
            </View>

            <View style={styles.targetsSection}>
                <Text style={styles.sectionTitle}>Branch {kpiData?.branch?.toUpperCase() || 'A'} Targets</Text>
                <Text style={styles.sectionSubtitle}>Grade thresholds and performance metrics for your assigned branch.</Text>

                <View style={styles.gradesList}>
                    {kpiData?.grades?.map((g: any) => (
                        <View key={g.grade} style={styles.gradeItem}>
                            <Text style={styles.gradeLabel}>Grade {g.grade}</Text>
                            <Text style={styles.gradePoints}>{g.monthly_ll_point} pts <Text style={styles.gradeUnit}>monthly</Text></Text>
                        </View>
                    ))}
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
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    helpButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    helpText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 30,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '900',
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    closeIcon: {
        fontSize: 20,
        color: '#999',
    },
    ruleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    ruleLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    ruleSub: {
        fontSize: 10,
        color: '#999',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    ruleValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    penaltyBox: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ddd',
    },
    penaltyTitle: {
        fontWeight: 'bold',
        fontSize: 13,
        marginBottom: 4,
    },
    penaltyText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    grid: {
        gap: 16,
        marginBottom: 24,
    },
    blackCard: {
        backgroundColor: '#000',
        padding: 30,
        borderRadius: 32,
    },
    cardHeaderSmall: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    cardValueLarge: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
    },
    cardHeaderSmallGrey: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    cardValueLargeBlack: {
        fontSize: 40,
        fontWeight: '900',
        color: '#000',
    },
    targetsSection: {
        backgroundColor: '#fff',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 20,
    },
    gradesList: {
        gap: 0,
    },
    gradeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    gradeLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    gradePoints: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    gradeUnit: {
        fontSize: 10,
        color: '#bbb',
        textTransform: 'uppercase',
    }
});

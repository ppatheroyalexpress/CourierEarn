import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { Input, Button, DatePicker, Card } from '@courierearn/ui';
import { useRouter } from 'expo-router';

export default function DeliveryScreen() {
    const router = useRouter();
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [cashCollect, setCashCollect] = useState<string>('0');
    const [notCashCollect, setNotCashCollect] = useState<string>('0');
    const [ec, setEc] = useState<string>('0');
    const [userRowId, setUserRowId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const { data } = await supabase.auth.getUser();
            const uid = data.user?.id;
            if (!uid) {
                setMessage({ type: 'error', text: "Please sign in to save entries." });
                setLoadingUser(false);
                return;
            }

            const { data: profile, error } = await supabase
                .from("users")
                .select("id")
                .eq("auth_user_id", uid)
                .single();

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setUserRowId(profile?.id);
            }
            setLoadingUser(false);
        };
        loadUser();
    }, []);

    const total = Number(cashCollect || 0) + Number(notCashCollect || 0) + Number(ec || 0);

    const handleSave = async () => {
        setMessage(null);
        if (!userRowId) {
            setMessage({ type: 'error', text: "User not loaded. Please try again." });
            return;
        }
        if (total <= 0) {
            setMessage({ type: 'error', text: "Please enter at least one delivery." });
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.from("transactions").insert({
                user_id: userRowId,
                pickup_location: "daily-delivery",
                dropoff_location: date,
                amount: total,
                cash_collect: Number(cashCollect || 0),
                not_cash: Number(notCashCollect || 0),
                ec: Number(ec || 0),
                status: "delivered",
                delivered_at: new Date(date).toISOString(),
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({ type: 'success', text: "Saved delivery entry successfully!" });
                setCashCollect('0');
                setNotCashCollect('0');
                setEc('0');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "An error occurred" });
        } finally {
            setSaving(false);
        }
    };

    if (loadingUser) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Delivery Entry</Text>
                <View style={{ width: 40 }} />
            </View>

            {message && (
                <View style={[styles.message, message.type === 'error' ? styles.error : styles.success]}>
                    <Text style={[styles.messageText, message.type === 'error' ? styles.errorText : styles.successText]}>
                        {message.text}
                    </Text>
                </View>
            )}

            <Card padding={24}>
                <DatePicker
                    label="Date"
                    value={date}
                    onChange={setDate}
                />

                <View style={styles.inputRow}>
                    <View style={styles.flex1}>
                        <Input
                            label="Cash Collect"
                            value={cashCollect}
                            onChangeText={setCashCollect}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.flex1}>
                        <Input
                            label="Not Cash"
                            value={notCashCollect}
                            onChangeText={setNotCashCollect}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <Input
                    label="EC Delivery"
                    value={ec}
                    onChangeText={setEc}
                    keyboardType="numeric"
                />
            </Card>

            <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Deliveries</Text>
                <Text style={styles.summaryValue}>{total}</Text>
            </View>

            <Button
                label={saving ? "Saving..." : "Save Entry"}
                onPress={handleSave}
                disabled={saving || total <= 0}
            />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },
    backText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    error: {
        backgroundColor: '#fef2f2',
    },
    success: {
        backgroundColor: '#f0fdf4',
    },
    messageText: {
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#b91c1c',
    },
    successText: {
        color: '#15803d',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    summaryCard: {
        backgroundColor: '#000',
        padding: 30,
        borderRadius: 24,
        alignItems: 'center',
        marginVertical: 24,
    },
    summaryLabel: {
        color: '#888',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    summaryValue: {
        color: '#fff',
        fontSize: 48,
        fontWeight: '900',
    }
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { Card, Button, Input } from '@courierearn/ui';
import { useRouter } from 'expo-router';

type Profile = {
    id: string;
    auth_user_id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    branch: string | null;
    phone: string | null;
};

export default function ProfileScreen() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    const [authEmail, setAuthEmail] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [totalEarnings, setTotalEarnings] = useState<number>(0);
    const [kpi, setKpi] = useState<number>(0);

    useEffect(() => {
        const loadProfile = async () => {
            const { data } = await supabase.auth.getUser();
            const uid = data.user?.id || null;
            const email = data.user?.email || null;
            setUserId(uid);
            setAuthEmail(email);

            if (uid) {
                const { data: rows } = await supabase
                    .from("users")
                    .select("*")
                    .eq("auth_user_id", uid)
                    .limit(1);
                const p = rows?.[0] ?? null;
                setProfile(p);

                // Fetch basic stats
                const { data: txSum } = await supabase
                    .from("transactions")
                    .select("amount")
                    .eq("user_id", p?.id ?? "");

                const earnings = (txSum || []).reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
                setTotalEarnings(earnings);
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            const payload = {
                auth_user_id: userId,
                email: authEmail,
                full_name: profile?.full_name?.toLowerCase() || null,
                branch: profile?.branch?.toLowerCase() || null,
                phone: profile?.phone?.toLowerCase() || null,
            };

            if (profile?.id) {
                await supabase.from("users").update(payload).eq("id", profile.id);
            } else {
                await supabase.from("users").insert(payload);
            }
            alert("Profile updated successfully!");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
    };

    if (loading) {
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
                <Text style={styles.title}>Your Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    <Text style={[styles.editButton, saving && { opacity: 0.5 }]}>
                        {saving ? "..." : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                    {profile?.avatar_url ? (
                        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                    ) : (
                        <Text style={styles.avatarPlaceholder}>
                            {profile?.full_name?.[0]?.toUpperCase() || "C"}
                        </Text>
                    )}
                </View>
                <TouchableOpacity style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Change Photo</Text>
                </TouchableOpacity>
            </View>

            <Card padding={24}>
                <Input
                    label="Username"
                    value={profile?.full_name || ""}
                    onChangeText={(text: string) => setProfile((p: Profile | null) => p ? { ...p, full_name: text } : null)}
                    placeholder="e.g. ppa | 30"
                />

                <Input
                    label="Email Address"
                    value={authEmail || ""}
                    onChangeText={() => { }}
                    error="Email cannot be changed"
                />

                <View style={styles.inputRow}>
                    <View style={styles.flex1}>
                        <Input
                            label="Branch"
                            value={profile?.branch || ""}
                            onChangeText={(text: string) => setProfile((p: Profile | null) => p ? { ...p, branch: text } : null)}
                            placeholder="A, B, C..."
                        />
                    </View>
                    <View style={styles.flex1}>
                        <Input
                            label="Phone"
                            value={profile?.phone || ""}
                            onChangeText={(text: string) => setProfile((p: Profile | null) => p ? { ...p, phone: text } : null)}
                            placeholder="09..."
                        />
                    </View>
                </View>
            </Card>

            <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.whiteCard]}>
                    <Text style={styles.statLabelGrey}>Total Earnings</Text>
                    <Text style={styles.statValueBlack}>{totalEarnings.toFixed(2)}</Text>
                </View>
                <View style={[styles.statCard, styles.blackCard]}>
                    <Text style={styles.statLabelWhite}>KPI Points</Text>
                    <Text style={styles.statValueWhite}>{kpi.toFixed(1)}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    editButton: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e5e7eb',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        fontSize: 48,
        fontWeight: '900',
        color: '#9ca3af',
    },
    uploadButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
    },
    uploadButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    inputRow: {
        flexDirection: 'row',
        gap: 16,
    },
    flex1: {
        flex: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        alignItems: 'center',
    },
    whiteCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
    },
    blackCard: {
        backgroundColor: '#000',
    },
    statLabelGrey: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statLabelWhite: {
        fontSize: 10,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValueBlack: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
    },
    statValueWhite: {
        fontSize: 20,
        fontWeight: '900',
        color: '#fff',
    },
    logoutButton: {
        marginTop: 40,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase/client';
import { Button, Card } from '@courierearn/ui';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            // In a real Expo app, this would use expo-auth-session
            // For now, we'll simulate a login or show a message
            // Wait 2 seconds to simulate
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Re-direct to dashboard for demo if they are not in a real flow
            router.replace('/(app)/dashboard');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>CE</Text>
                    </View>
                </View>

                <View style={styles.header}>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account to continue tracking your earnings.</Text>
                </View>

                <Card padding={32}>
                    <Button
                        label={loading ? "Redirecting..." : "Continue with Google"}
                        onPress={handleGoogleSignIn}
                        disabled={loading}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Securely powered by Supabase</Text>
                    </View>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 80,
        height: 80,
        backgroundColor: '#000',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    footer: {
        marginTop: 32,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 24,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ccc',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

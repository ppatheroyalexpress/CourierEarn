import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'flat' | 'inverse';
    padding?: number;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'elevated', padding = 16 }) => {
    return (
        <View style={[
            styles.card,
            variant === 'elevated' && styles.elevated,
            variant === 'flat' && styles.flat,
            variant === 'inverse' && styles.inverse,
            { padding },
            Platform.OS === 'web' && (styles.webCard as any)
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        marginVertical: 8,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    flat: {
        shadowOpacity: 0,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    inverse: {
        backgroundColor: '#000',
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    webCard: {
        // @ts-ignore
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        }
    } as any
});

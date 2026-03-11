import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onPress, variant = 'primary', disabled = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' ? styles.primary : styles.secondary,
                disabled && styles.disabled,
                Platform.OS === 'web' && (styles.webButton as any)
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[
                styles.text,
                variant === 'secondary' && styles.secondaryText
            ]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primary: {
        backgroundColor: '#000',
    },
    secondary: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    secondaryText: {
        color: '#000',
    },
    webButton: {
        // @ts-ignore
        cursor: 'pointer',
        // @ts-ignore
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:active': {
            transform: 'scale(0.98)',
        }
    } as any
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DatePickerProps {
    label: string;
    value: string; // ISO format string (yyyy-mm-dd)
    onChange: (value: string) => void;
    error?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({ label, value, onChange, error }) => {
    const [show, setShow] = useState(false);

    const dateValue = value ? new Date(value) : new Date();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                onPress={() => setShow(true)}
                style={[styles.pickerButton, error && styles.errorInput]}
            >
                <Text style={styles.valueText}>{value || "Select Date"}</Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShow(false);
                        if (selectedDate) {
                            onChange(selectedDate.toISOString().split('T')[0]);
                        }
                    }}
                />
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginLeft: 4,
    },
    pickerButton: {
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    valueText: {
        fontSize: 16,
        color: '#111827',
    },
    errorInput: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
});

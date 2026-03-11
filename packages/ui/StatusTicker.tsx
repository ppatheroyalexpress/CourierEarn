import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform, Dimensions } from 'react-native';

interface StatusTickerProps {
    text: string;
    duration?: number;
}

export const StatusTicker: React.FC<StatusTickerProps> = ({ text, duration = 15000 }) => {
    const animatedValue = useRef(new Animated.Value(Dimensions.get('window').width)).current;

    useEffect(() => {
        const startAnimation = () => {
            animatedValue.setValue(Dimensions.get('window').width);
            Animated.loop(
                Animated.timing(animatedValue, {
                    toValue: -Dimensions.get('window').width,
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        };

        startAnimation();
    }, [duration, text]);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.tickerWrapper, { transform: [{ translateX: animatedValue }] }]}>
                <Text style={styles.text} numberOfLines={1}>{text}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
        justifyContent: 'center',
        marginVertical: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    tickerWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        paddingHorizontal: 16,
    }
});

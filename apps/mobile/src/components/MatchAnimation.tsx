import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '../theme';

/**
 * MatchAnimation — confetti-style celebration shown when a match is found.
 * Uses reanimated for a burst + glow effect.
 */
export function MatchAnimation({ title }: { title: string }) {
    const { width } = useWindowDimensions();
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const glowScale = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 300 });
        scale.value = withSequence(
            withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
            withTiming(1, { duration: 200 }),
        );
        glowScale.value = withDelay(
            200,
            withTiming(2, { duration: 800, easing: Easing.out(Easing.ease) }),
        );
    }, []);

    const cardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const glowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: glowScale.value }],
        opacity: 0.3,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.glow, glowStyle]} />
            <Animated.View style={[styles.card, cardStyle]}>
                <Text style={styles.emoji}>🎉</Text>
                <Text style={styles.heading}>It's a Match!</Text>
                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>
                <Text style={styles.subtitle}>
                    You both want to watch this!
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bg.overlay,
    },
    glow: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: Colors.accent.secondary,
    },
    card: {
        alignItems: 'center',
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    emoji: {
        fontSize: 64,
        marginBottom: Spacing.md,
    },
    heading: {
        ...Typography.heading1,
        color: Colors.accent.secondary,
        textAlign: 'center',
    },
    title: {
        ...Typography.heading3,
        color: Colors.text.primary,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: Spacing.xs,
    },
});

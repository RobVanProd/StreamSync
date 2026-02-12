import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withTiming,
    useSharedValue,
    withDelay,
} from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing } from '../theme';
import { useEffect } from 'react';

/**
 * SkeletonLoader — animated placeholder for loading states.
 * Renders a pulsing rectangular shimmer.
 */
export function SkeletonLoader({
    width = '100%',
    height = 20,
    borderRadius = BorderRadius.sm,
    delay = 0,
}: {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    delay?: number;
}) {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withRepeat(
                withTiming(0.7, { duration: 800 }),
                -1,
                true,
            ),
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                style,
                {
                    width: width as any,
                    height,
                    borderRadius,
                },
            ]}
        />
    );
}

/** Card-shaped skeleton for the swipe deck. */
export function CardSkeleton() {
    return (
        <View style={styles.cardSkeleton}>
            <SkeletonLoader height={400} borderRadius={BorderRadius.lg} />
            <View style={styles.cardSkeletonContent}>
                <SkeletonLoader width="70%" height={24} delay={100} />
                <SkeletonLoader width="40%" height={16} delay={200} />
                <SkeletonLoader width="90%" height={14} delay={300} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: Colors.bg.tertiary,
    },
    cardSkeleton: {
        padding: Spacing.md,
    },
    cardSkeletonContent: {
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
});

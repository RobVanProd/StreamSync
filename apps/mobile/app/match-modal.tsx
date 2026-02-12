import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MatchAnimation } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../src/theme';

/**
 * Match Moment Modal — presented as a transparent overlay.
 * Triggered via Socket.io match_found event or after a swipe-match.
 */
export default function MatchModalScreen() {
    const router = useRouter();
    const { title = 'A Great Movie' } = useLocalSearchParams<{ title: string }>();

    // Trigger success haptic on mount (native only)
    React.useEffect(() => {
        if (Platform.OS !== 'web') {
            const Haptics = require('expo-haptics');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, []);

    return (
        <View style={styles.container}>
            <MatchAnimation title={title} />

            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.button, styles.primaryBtn, Shadows.button]}
                    onPress={() => {
                        router.push('/matches');
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnText}>Add to Tonight's List 📺</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.secondaryBtn]}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnTextSecondary}>Keep Swiping</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bg.overlay,
    },
    buttons: {
        position: 'absolute',
        bottom: 80,
        left: Spacing.lg,
        right: Spacing.lg,
        gap: Spacing.md,
    },
    button: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    primaryBtn: {
        backgroundColor: Colors.accent.secondary,
    },
    secondaryBtn: {
        backgroundColor: Colors.bg.tertiary,
        borderWidth: 1,
        borderColor: Colors.border.medium,
    },
    btnText: {
        ...Typography.button,
        color: Colors.text.primary,
    },
    btnTextSecondary: {
        ...Typography.button,
        color: Colors.text.secondary,
    },
});

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaWrapper } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../src/theme';
import { TMDB_ATTRIBUTION } from '@streamsync/shared';
import { loginAsGuest, createRoom, joinRoom } from '../src/api';

/**
 * Welcome Screen — "Create Room" / "Join Room"
 * First screen after launch. Fastest path to first swipe.
 */
export default function WelcomeScreen() {
    const router = useRouter();
    const [joinCode, setJoinCode] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!displayName.trim()) {
            Alert.alert('Enter a name', 'Please enter your display name.');
            return;
        }
        setLoading(true);
        try {
            const auth = await loginAsGuest(displayName.trim());
            await AsyncStorage.setItem('user_id', auth.userId ?? auth.sub ?? '');
            const room = await createRoom();
            router.push({
                pathname: '/lobby',
                params: {
                    roomId: room.roomId,
                    roomCode: room.code,
                    userId: auth.userId ?? auth.sub ?? '',
                    displayName: displayName.trim(),
                },
            });
        } catch (err: any) {
            Alert.alert('Error', err?.message ?? 'Failed to create room');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!displayName.trim()) {
            Alert.alert('Enter a name', 'Please enter your display name.');
            return;
        }
        if (joinCode.length < 4) return;
        setLoading(true);
        try {
            const auth = await loginAsGuest(displayName.trim());
            await AsyncStorage.setItem('user_id', auth.userId ?? auth.sub ?? '');
            const room = await joinRoom(joinCode);
            router.push({
                pathname: '/lobby',
                params: {
                    roomId: room.roomId,
                    roomCode: room.code,
                    userId: auth.userId ?? auth.sub ?? '',
                    displayName: displayName.trim(),
                },
            });
        } catch (err: any) {
            Alert.alert('Error', err?.message ?? 'Failed to join room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaWrapper>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.logo}>🎬</Text>
                    <Text style={styles.title}>StreamSync</Text>
                    <Text style={styles.subtitle}>
                        Swipe. Match. Watch together.
                    </Text>
                </View>

                {/* Name input */}
                <View style={styles.section}>
                    <TextInput
                        style={styles.input}
                        placeholder="Your name"
                        placeholderTextColor={Colors.text.muted}
                        value={displayName}
                        onChangeText={setDisplayName}
                        maxLength={30}
                    />
                </View>

                {/* Create Room */}
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton, Shadows.button]}
                    onPress={handleCreate}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Creating...' : 'Create Room'}
                    </Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or join a room</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Join Room */}
                <View style={styles.joinRow}>
                    <TextInput
                        style={[styles.input, styles.codeInput]}
                        placeholder="Room code"
                        placeholderTextColor={Colors.text.muted}
                        value={joinCode}
                        onChangeText={(t) => setJoinCode(t.toUpperCase())}
                        autoCapitalize="characters"
                        maxLength={8}
                    />
                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.secondaryButton,
                            (joinCode.length < 4 || loading) && styles.buttonDisabled,
                        ]}
                        onPress={handleJoin}
                        disabled={joinCode.length < 4 || loading}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? '...' : 'Join'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Attribution */}
                <Text style={styles.attribution}>{TMDB_ATTRIBUTION}</Text>
            </KeyboardAvoidingView>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
    },
    hero: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logo: {
        fontSize: 72,
        marginBottom: Spacing.md,
    },
    title: {
        ...Typography.heading1,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: Spacing.xs,
    },
    section: {
        marginBottom: Spacing.md,
    },
    input: {
        ...Typography.body,
        color: Colors.text.primary,
        backgroundColor: Colors.bg.secondary,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border.subtle,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    button: {
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.accent.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.accent.primary,
        paddingHorizontal: Spacing.xl,
    },
    buttonDisabled: {
        opacity: 0.4,
    },
    buttonText: {
        ...Typography.button,
        color: Colors.text.primary,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.lg,
        gap: Spacing.md,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border.subtle,
    },
    dividerText: {
        ...Typography.caption,
        color: Colors.text.muted,
    },
    joinRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    codeInput: {
        flex: 1,
        letterSpacing: 4,
        textAlign: 'center',
        ...Typography.heading3,
    },
    attribution: {
        ...Typography.caption,
        color: Colors.text.muted,
        textAlign: 'center',
        marginTop: Spacing.xxl,
    },
});

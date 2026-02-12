import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaWrapper, ProviderGrid } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../src/theme';
import * as api from '../src/api';
import { useSocket } from '../src/hooks';

interface MemberDisplay {
    userId: string;
    displayName: string;
    ready: boolean;
    providers: number[];
}

/**
 * Room Lobby Screen
 * Shows participants + readiness, provider selection, and "Start Swiping" button.
 * Wired to real API + Socket.io for live updates.
 */
export default function LobbyScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        roomId: string;
        roomCode: string;
        userId: string;
        displayName: string;
    }>();

    const roomId = params.roomId ?? '';
    const roomCode = params.roomCode ?? '';
    const userId = params.userId ?? '';
    const myName = params.displayName ?? '';

    const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
    const [ready, setReady] = useState(false);
    const [members, setMembers] = useState<MemberDisplay[]>([]);

    // Socket.io for real-time updates
    const { connected, onMemberReady, onMemberJoined } = useSocket(roomId, userId);

    // Fetch members from API
    const fetchMembers = useCallback(async () => {
        if (!roomId) return;
        try {
            const data = await api.getMembers(roomId);
            const mapped: MemberDisplay[] = data.map((m: any) => ({
                userId: m.userId,
                displayName: m.user?.displayName ?? 'Guest',
                ready: m.ready,
                providers: typeof m.activeProviders === 'string'
                    ? JSON.parse(m.activeProviders || '[]')
                    : (m.activeProviders ?? []),
            }));
            setMembers(mapped);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    }, [roomId]);

    // Initial load + poll every 3s as fallback
    useEffect(() => {
        fetchMembers();
        const interval = setInterval(fetchMembers, 3000);
        return () => clearInterval(interval);
    }, [fetchMembers]);

    // Socket.io: when a member's ready/providers change, refresh member list
    useEffect(() => {
        onMemberReady(() => {
            fetchMembers();
        });
        onMemberJoined(() => {
            fetchMembers();
        });
    }, [onMemberReady, onMemberJoined, fetchMembers]);

    const toggleProvider = useCallback((id: number) => {
        setSelectedProviders((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id],
        );
    }, []);

    const handleReady = async () => {
        try {
            // Save providers first, then set ready
            await api.setProviders(roomId, selectedProviders);
            await api.setReady(roomId, true);
            setReady(true);
            fetchMembers();
        } catch (err) {
            console.error('Failed to set ready:', err);
        }
    };

    const handleStart = () => {
        router.push({
            pathname: '/swipe',
            params: { roomId, userId, displayName: myName },
        });
    };

    // Find my entry to show correct state
    const myMember = members.find((m) => m.userId === userId);
    const amReady = ready || (myMember?.ready ?? false);
    const allReady = members.length >= 2 && members.every((m) => m.ready);

    return (
        <SafeAreaWrapper>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.content}
            >
                {/* Room Code Header */}
                <View style={styles.header}>
                    <Text style={styles.label}>Room Code</Text>
                    <Text style={styles.code}>{roomCode}</Text>
                    <Text style={styles.hint}>Share this code with your watch buddy</Text>
                    {connected && (
                        <Text style={styles.connectedBadge}>● Live</Text>
                    )}
                </View>

                {/* Participants */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Who's Here ({members.length})</Text>
                    {members.length === 0 ? (
                        <Text style={styles.emptyHint}>Loading members...</Text>
                    ) : (
                        members.map((m) => (
                            <View key={m.userId} style={styles.memberRow}>
                                <View style={styles.memberInfo}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            m.ready ? styles.dotReady : styles.dotWaiting,
                                        ]}
                                    />
                                    <Text style={styles.memberName}>
                                        {m.userId === userId ? `${m.displayName} (You)` : m.displayName}
                                    </Text>
                                </View>
                                <Text style={styles.memberStatus}>
                                    {m.ready ? '✅ Ready' : '⏳ Picking...'}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Provider Selection */}
                {!amReady && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Streaming Services</Text>
                        <Text style={styles.sectionHint}>
                            We'll show titles available on services you both have
                        </Text>
                        <ProviderGrid
                            selectedIds={selectedProviders}
                            onToggle={toggleProvider}
                        />
                    </View>
                )}

                {amReady && !allReady && (
                    <View style={styles.waitingBox}>
                        <Text style={styles.waitingEmoji}>⏳</Text>
                        <Text style={styles.waitingText}>
                            Waiting for everyone to be ready...
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                {!amReady ? (
                    <TouchableOpacity
                        style={[
                            styles.ctaButton,
                            selectedProviders.length === 0 && styles.ctaDisabled,
                            Shadows.button,
                        ]}
                        onPress={handleReady}
                        disabled={selectedProviders.length === 0}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.ctaText}>
                            I'm Ready ({selectedProviders.length} services)
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.ctaButton,
                            !allReady && styles.ctaWaiting,
                            Shadows.button,
                        ]}
                        onPress={handleStart}
                        disabled={!allReady}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.ctaText}>
                            {allReady ? 'Start Swiping 🎬' : 'Waiting for others...'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    scroll: { flex: 1 },
    content: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    label: {
        ...Typography.caption,
        color: Colors.text.muted,
        textTransform: 'uppercase',
    },
    code: {
        ...Typography.heading1,
        color: Colors.accent.primary,
        letterSpacing: 6,
        marginTop: Spacing.xs,
    },
    hint: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        marginTop: Spacing.xs,
    },
    connectedBadge: {
        ...Typography.caption,
        color: Colors.accent.success,
        marginTop: Spacing.sm,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.heading3,
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    sectionHint: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        marginBottom: Spacing.md,
    },
    emptyHint: {
        ...Typography.body,
        color: Colors.text.muted,
    },
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.subtle,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    dotReady: {
        backgroundColor: Colors.accent.success,
    },
    dotWaiting: {
        backgroundColor: Colors.accent.warning,
    },
    memberName: {
        ...Typography.body,
        color: Colors.text.primary,
    },
    memberStatus: {
        ...Typography.caption,
        color: Colors.text.secondary,
    },
    waitingBox: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    waitingEmoji: {
        fontSize: 48,
        marginBottom: Spacing.md,
    },
    waitingText: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
    },
    bottomBar: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border.subtle,
    },
    ctaButton: {
        backgroundColor: Colors.accent.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    ctaDisabled: {
        opacity: 0.4,
    },
    ctaWaiting: {
        backgroundColor: Colors.bg.tertiary,
    },
    ctaText: {
        ...Typography.button,
        color: Colors.text.primary,
    },
});

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaWrapper, ProviderGrid } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius } from '../src/theme';
import { TMDB_ATTRIBUTION } from '@streamsync/shared';

/**
 * Settings Screen — providers, region, content filters.
 */
export default function SettingsScreen() {
    const router = useRouter();
    const [selectedProviders, setSelectedProviders] = useState<number[]>([8, 337]);
    const [includeTV, setIncludeTV] = useState(true);
    const [includeMovies, setIncludeMovies] = useState(true);

    const toggleProvider = useCallback((id: number) => {
        setSelectedProviders((prev) =>
            prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
        );
    }, []);

    return (
        <SafeAreaWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Region */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Region</Text>
                    <View style={styles.regionPill}>
                        <Text style={styles.regionFlag}>🇺🇸</Text>
                        <Text style={styles.regionText}>United States</Text>
                    </View>
                    <Text style={styles.hint}>
                        Availability may vary by region
                    </Text>
                </View>

                {/* Content Filters */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Content Types</Text>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Movies</Text>
                        <Switch
                            value={includeMovies}
                            onValueChange={setIncludeMovies}
                            trackColor={{
                                false: Colors.bg.tertiary,
                                true: Colors.accent.primary,
                            }}
                            thumbColor={Colors.text.primary}
                        />
                    </View>
                    <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>TV Shows</Text>
                        <Switch
                            value={includeTV}
                            onValueChange={setIncludeTV}
                            trackColor={{
                                false: Colors.bg.tertiary,
                                true: Colors.accent.primary,
                            }}
                            thumbColor={Colors.text.primary}
                        />
                    </View>
                </View>

                {/* Streaming Services */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Streaming Services</Text>
                    <ProviderGrid
                        selectedIds={selectedProviders}
                        onToggle={toggleProvider}
                    />
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.version}>StreamSync v0.1.0</Text>
                    <Text style={styles.attribution}>{TMDB_ATTRIBUTION}</Text>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    backText: {
        ...Typography.body,
        color: Colors.text.secondary,
    },
    title: {
        ...Typography.heading3,
        color: Colors.text.primary,
    },
    headerSpacer: {
        width: 60,
    },
    content: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.heading3,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    regionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bg.secondary,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        gap: Spacing.sm,
        alignSelf: 'flex-start',
    },
    regionFlag: {
        fontSize: 24,
    },
    regionText: {
        ...Typography.body,
        color: Colors.text.primary,
    },
    hint: {
        ...Typography.caption,
        color: Colors.text.muted,
        marginTop: Spacing.xs,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border.subtle,
    },
    toggleLabel: {
        ...Typography.body,
        color: Colors.text.primary,
    },
    version: {
        ...Typography.body,
        color: Colors.text.secondary,
        marginBottom: Spacing.sm,
    },
    attribution: {
        ...Typography.caption,
        color: Colors.text.muted,
        lineHeight: 18,
    },
});

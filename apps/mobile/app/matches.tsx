import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Modal,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaWrapper } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../src/theme';
import {
    TMDB_IMAGE_BASE,
    TMDB_POSTER_SIZES,
    MOVIE_GENRES,
    STREAMING_PROVIDERS,
    type Match,
} from '@streamsync/shared';
import { useMatches } from '../src/hooks';

function genreName(id: number): string {
    return MOVIE_GENRES.find((g) => g.id === id)?.name ?? '';
}

function providerName(id: number): string {
    return STREAMING_PROVIDERS.find((p) => p.id === id)?.name ?? '';
}

/**
 * Matches List Screen — shows matched titles with detail modal on tap.
 */
export default function MatchesScreen() {
    const router = useRouter();
    const { matches, loading, refreshMatches } = useMatches();
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    // Poll for new matches every 10 seconds? Or rely on socket?
    // Socket pushes events, but list might need refreshing.
    // For now, rely on initial load + pull-to-refresh + socket (if we added it here).

    return (
        <SafeAreaWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Your Matches</Text>
                <View style={styles.headerSpacer} />
            </View>

            {matches.length === 0 ? (
                <ScrollView
                    contentContainerStyle={styles.emptyState}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshMatches}
                            tintColor={Colors.accent.primary}
                        />
                    }
                >
                    <Text style={styles.emptyEmoji}>💜</Text>
                    <Text style={styles.emptyText}>No matches yet</Text>
                    <Text style={styles.emptyHint}>
                        Keep swiping — your perfect movie night is coming!
                    </Text>
                    <TouchableOpacity onPress={refreshMatches} style={styles.refreshBtn}>
                        <Text style={styles.refreshText}>Refresh</Text>
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshMatches}
                            tintColor={Colors.accent.primary}
                        />
                    }
                    renderItem={({ item }) => {
                        const poster = item.posterPath
                            ? `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES.small}${item.posterPath}`
                            : null;

                        return (
                            <TouchableOpacity
                                style={[styles.matchCard, Shadows.card]}
                                activeOpacity={0.7}
                                onPress={() => setSelectedMatch(item)}
                            >
                                {poster ? (
                                    <Image
                                        source={{ uri: poster }}
                                        style={styles.poster}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.poster, styles.posterPlaceholder]}>
                                        <Text>🎬</Text>
                                    </View>
                                )}
                                <View style={styles.matchInfo}>
                                    <Text style={styles.matchTitle} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View style={styles.matchMeta}>
                                        <Text style={styles.metaText}>
                                            {item.releaseDate?.slice(0, 4) ?? 'Unknown'}
                                        </Text>
                                        <Text style={styles.metaText}>
                                            ⭐ {item.voteAverage?.toFixed(1) ?? '0.0'}
                                        </Text>
                                    </View>
                                    {/* Genre tags logic could be improved if we stored genreIds */}
                                    <Text style={styles.matchType}>
                                        {item.mediaType === 'movie' ? '🎬 Movie' : '📺 TV Show'}
                                    </Text>
                                </View>
                                <Text style={styles.openIcon}>→</Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            {/* ─── Detail Modal ─── */}
            <Modal
                visible={selectedMatch !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedMatch(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedMatch?.posterPath && (
                                <Image
                                    source={{
                                        uri: `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES.large}${selectedMatch.posterPath}`,
                                    }}
                                    style={styles.modalPoster}
                                    resizeMode="cover"
                                />
                            )}
                            <Text style={styles.modalTitle}>{selectedMatch?.title}</Text>

                            <View style={styles.modalMeta}>
                                <Text style={styles.modalMetaText}>
                                    {selectedMatch?.releaseDate?.slice(0, 4)}
                                </Text>
                                <Text style={styles.modalMetaText}>
                                    ⭐ {selectedMatch?.voteAverage?.toFixed(1)}
                                </Text>
                                <Text style={styles.modalMetaText}>
                                    {selectedMatch?.mediaType === 'movie' ? '🎬 Movie' : '📺 TV'}
                                </Text>
                            </View>

                            {/* No genres stored yet, so skipping genre row for matches unless we fetch details */}

                            {/* Synopsis */}
                            <Text style={styles.modalSectionTitle}>Synopsis</Text>
                            <Text style={styles.modalOverviewText}>
                                {selectedMatch?.overview || 'No overview available.'}
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalClose}
                            onPress={() => setSelectedMatch(null)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    backText: { ...Typography.body, color: Colors.text.secondary },
    title: { ...Typography.heading3, color: Colors.text.primary },
    headerSpacer: { width: 60 },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
        gap: Spacing.md,
    },
    matchCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bg.card,
        borderRadius: BorderRadius.md,
        padding: Spacing.sm,
        gap: Spacing.md,
    },
    poster: { width: 60, height: 90, borderRadius: BorderRadius.sm },
    posterPlaceholder: {
        backgroundColor: Colors.bg.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    matchInfo: { flex: 1, gap: Spacing.xs },
    matchTitle: { ...Typography.body, color: Colors.text.primary, fontWeight: '600' },
    matchMeta: { flexDirection: 'row', gap: Spacing.sm },
    metaText: { ...Typography.caption, color: Colors.text.secondary },
    matchType: { ...Typography.caption, color: Colors.accent.primary, marginTop: 4 },
    openIcon: { ...Typography.heading3, color: Colors.text.muted },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    refreshBtn: {
        marginTop: Spacing.md,
        padding: Spacing.sm,
    },
    refreshText: {
        color: Colors.accent.primary,
    },
    emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
    emptyText: { ...Typography.heading2, color: Colors.text.primary, textAlign: 'center' },
    emptyHint: {
        ...Typography.body,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginTop: Spacing.xs,
    },

    // Detail Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: 60,
    },
    modalContent: {
        flex: 1,
        backgroundColor: Colors.bg.secondary,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        padding: Spacing.lg,
    },
    modalPoster: {
        width: '100%',
        height: 300,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
    },
    modalTitle: { ...Typography.heading1, color: Colors.text.primary },
    modalMeta: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
    modalMetaText: { ...Typography.body, color: Colors.text.secondary },
    modalSectionTitle: {
        ...Typography.heading3,
        color: Colors.text.primary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    modalOverviewText: { ...Typography.body, color: Colors.text.secondary, lineHeight: 24 },
    modalClose: {
        backgroundColor: Colors.accent.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    modalCloseText: { ...Typography.button, color: Colors.text.primary },
});

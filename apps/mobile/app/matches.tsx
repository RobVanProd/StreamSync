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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaWrapper } from '../src/components';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../src/theme';
import {
    TMDB_IMAGE_BASE,
    TMDB_POSTER_SIZES,
    MOVIE_GENRES,
    STREAMING_PROVIDERS,
} from '@streamsync/shared';

interface MatchItem {
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    title: string;
    overview: string;
    posterPath: string;
    voteAverage: number;
    releaseDate: string;
    genreIds: number[];
    providerIds: number[];
    matchedAt: string;
}

// Mock matches for scaffold
const MOCK_MATCHES: MatchItem[] = [
    {
        tmdbId: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
        posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        voteAverage: 8.4,
        releaseDate: '1999-10-15',
        genreIds: [18, 53],
        providerIds: [8],
        matchedAt: '2026-02-11T20:00:00Z',
    },
    {
        tmdbId: 680,
        mediaType: 'movie',
        title: 'Pulp Fiction',
        overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        voteAverage: 8.5,
        releaseDate: '1994-09-10',
        genreIds: [53, 80],
        providerIds: [8, 337],
        matchedAt: '2026-02-11T19:45:00Z',
    },
    {
        tmdbId: 155,
        mediaType: 'movie',
        title: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.',
        posterPath: '/qJ2tW6WMUDux911BTUgMe1nGrai.jpg',
        voteAverage: 8.5,
        releaseDate: '2008-07-16',
        genreIds: [18, 28, 80],
        providerIds: [1899],
        matchedAt: '2026-02-11T19:30:00Z',
    },
];

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
    const [selectedMatch, setSelectedMatch] = useState<MatchItem | null>(null);

    return (
        <SafeAreaWrapper>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Your Matches</Text>
                <View style={styles.headerSpacer} />
            </View>

            {MOCK_MATCHES.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyEmoji}>💜</Text>
                    <Text style={styles.emptyText}>No matches yet</Text>
                    <Text style={styles.emptyHint}>
                        Keep swiping — your perfect movie night is coming!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={MOCK_MATCHES}
                    keyExtractor={(item) => `${item.tmdbId}-${item.mediaType}`}
                    contentContainerStyle={styles.list}
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
                                        <Text style={styles.metaText}>{item.releaseDate.slice(0, 4)}</Text>
                                        <Text style={styles.metaText}>⭐ {item.voteAverage}</Text>
                                    </View>
                                    {/* Genre tags inline */}
                                    <View style={styles.genreRowSmall}>
                                        {item.genreIds.slice(0, 2).map((id) => (
                                            <View key={id} style={styles.genreBadgeSmall}>
                                                <Text style={styles.genreTextSmall}>{genreName(id)}</Text>
                                            </View>
                                        ))}
                                    </View>
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

                            {/* Genres */}
                            <View style={styles.modalGenres}>
                                {selectedMatch?.genreIds.map((id) => (
                                    <View key={id} style={styles.modalGenreBadge}>
                                        <Text style={styles.modalGenreText}>{genreName(id)}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Available On */}
                            {selectedMatch?.providerIds && selectedMatch.providerIds.length > 0 && (
                                <>
                                    <Text style={styles.modalSectionTitle}>Available On</Text>
                                    <View style={styles.providerRow}>
                                        {selectedMatch.providerIds.map((id) => (
                                            <View key={id} style={styles.providerBadge}>
                                                <Text style={styles.providerText}>{providerName(id)}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}

                            {/* Synopsis */}
                            <Text style={styles.modalSectionTitle}>Synopsis</Text>
                            <Text style={styles.modalOverviewText}>
                                {selectedMatch?.overview}
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
    genreRowSmall: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
    genreBadgeSmall: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    genreTextSmall: { ...Typography.caption, color: Colors.accent.primary, fontSize: 10 },
    openIcon: { ...Typography.heading3, color: Colors.text.muted },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
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
    modalGenres: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: Spacing.md,
    },
    modalGenreBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        borderColor: Colors.accent.primary,
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    modalGenreText: { ...Typography.caption, color: Colors.accent.primary },
    modalSectionTitle: {
        ...Typography.heading3,
        color: Colors.text.primary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    modalOverviewText: { ...Typography.body, color: Colors.text.secondary, lineHeight: 24 },
    providerRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    providerBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        borderColor: Colors.border.medium,
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    providerText: { ...Typography.caption, color: Colors.text.primary },
    modalClose: {
        backgroundColor: Colors.accent.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    modalCloseText: { ...Typography.button, color: Colors.text.primary },
});

import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { TMDB_IMAGE_BASE, TMDB_POSTER_SIZES, MOVIE_GENRES, TV_GENRES } from '@streamsync/shared';
import type { TitleCard as TitleCardType } from '@streamsync/shared';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../theme';

interface Props {
    card: TitleCardType;
}

/** Resolve genre IDs to display names. */
function getGenreNames(genreIds: number[], mediaType: string): string[] {
    const genres = mediaType === 'tv' ? TV_GENRES : MOVIE_GENRES;
    return genreIds
        .map((id) => genres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[];
}

/**
 * TitleCard — the swipe card showing poster, title, genres, and overview.
 * Fixed aspect ratio (2:3 poster ratio).
 */
export function TitleCard({ card }: Props) {
    const { width } = useWindowDimensions();
    const cardWidth = Math.min(width - Spacing.lg * 2, 380);
    const cardHeight = cardWidth * 1.5;

    const posterUrl = card.posterPath
        ? `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES.large}${card.posterPath}`
        : null;

    const genreNames = getGenreNames(card.genreIds, card.mediaType);

    return (
        <View style={[styles.card, { width: cardWidth, height: cardHeight }, Shadows.card]}>
            {posterUrl ? (
                <Image
                    source={{ uri: posterUrl }}
                    style={styles.poster}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.posterPlaceholder}>
                    <Text style={styles.placeholderText}>🎬</Text>
                </View>
            )}

            {/* Media type badge */}
            <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                    {card.mediaType === 'movie' ? '🎬 Movie' : '📺 TV'}
                </Text>
            </View>

            {/* Bottom gradient overlay with title info */}
            <View style={styles.overlay}>
                <Text style={styles.title} numberOfLines={2}>
                    {card.title}
                </Text>

                <View style={styles.meta}>
                    {card.releaseDate && (
                        <Text style={styles.year}>
                            {card.releaseDate.slice(0, 4)}
                        </Text>
                    )}
                    <Text style={styles.rating}>⭐ {card.voteAverage.toFixed(1)}</Text>
                </View>

                {/* Genre badges */}
                {genreNames.length > 0 && (
                    <View style={styles.genreRow}>
                        {genreNames.slice(0, 3).map((name) => (
                            <View key={name} style={styles.genreBadge}>
                                <Text style={styles.genreText}>{name}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <Text style={styles.overview} numberOfLines={3}>
                    {card.overview}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: Colors.bg.card,
    },
    poster: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: BorderRadius.lg,
    },
    posterPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.bg.tertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 64,
    },
    typeBadge: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        backgroundColor: 'rgba(15, 15, 26, 0.7)',
        borderRadius: BorderRadius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
    },
    typeBadgeText: {
        ...Typography.caption,
        color: Colors.text.primary,
        fontSize: 11,
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: Spacing.xxl,
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.lg,
        backgroundColor: 'rgba(15, 15, 26, 0.8)',
    },
    title: {
        ...Typography.heading2,
        color: Colors.text.primary,
    },
    meta: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.xs,
    },
    year: {
        ...Typography.caption,
        color: Colors.text.secondary,
    },
    rating: {
        ...Typography.caption,
        color: Colors.accent.warning,
    },
    genreRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: Spacing.sm,
    },
    genreBadge: {
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderWidth: 1,
        borderColor: 'rgba(139, 92, 246, 0.4)',
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    genreText: {
        ...Typography.caption,
        color: Colors.accent.primary,
        fontSize: 11,
    },
    overview: {
        ...Typography.bodySmall,
        color: Colors.text.secondary,
        marginTop: Spacing.sm,
    },
});

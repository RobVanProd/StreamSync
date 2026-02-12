import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
    Platform,
    Modal,
    ScrollView,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { SafeAreaWrapper, TitleCard, CardSkeleton } from '../src/components';
import { Colors, Spacing, Typography, Shadows, BorderRadius } from '../src/theme';
import {
    TMDB_IMAGE_BASE,
    TMDB_POSTER_SIZES,
    MOVIE_GENRES,
} from '@streamsync/shared';
import type { TitleCard as TitleCardType } from '@streamsync/shared';

// Platform-safe haptics
const triggerHaptic = async () => {
    if (Platform.OS !== 'web') {
        const Haptics = require('expo-haptics');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
};

const SWIPE_THRESHOLD = 120;

// ─── Expanded Mock Data ──────────────────────────
const MOCK_CARDS: TitleCardType[] = [
    {
        tmdbId: 550,
        mediaType: 'movie',
        title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
        posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdropPath: '/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg',
        releaseDate: '1999-10-15',
        voteAverage: 8.4,
        genreIds: [18, 53],
        providerIds: [8],
    },
    {
        tmdbId: 680,
        mediaType: 'movie',
        title: 'Pulp Fiction',
        overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        backdropPath: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        releaseDate: '1994-09-10',
        voteAverage: 8.5,
        genreIds: [53, 80],
        providerIds: [8, 337],
    },
    {
        tmdbId: 238,
        mediaType: 'movie',
        title: 'The Godfather',
        overview: 'Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.',
        posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
        backdropPath: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
        releaseDate: '1972-03-14',
        voteAverage: 8.7,
        genreIds: [18, 80],
        providerIds: [531],
    },
    {
        tmdbId: 278,
        mediaType: 'movie',
        title: 'The Shawshank Redemption',
        overview: 'Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at Shawshank prison.',
        posterPath: '/9cjIGRQL1d6RuFUkbWjAfykpvUm.jpg',
        backdropPath: '/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        releaseDate: '1994-09-23',
        voteAverage: 8.7,
        genreIds: [18, 80],
        providerIds: [8],
    },
    {
        tmdbId: 155,
        mediaType: 'movie',
        title: 'The Dark Knight',
        overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.',
        posterPath: '/qJ2tW6WMUDux911BTUgMe1nGrai.jpg',
        backdropPath: '/nMKdUUepR0i5zn0y1T4CsSB5ez9.jpg',
        releaseDate: '2008-07-16',
        voteAverage: 8.5,
        genreIds: [18, 28, 80],
        providerIds: [1899],
    },
    {
        tmdbId: 13,
        mediaType: 'movie',
        title: 'Forrest Gump',
        overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events—in each case, far exceeding what anyone imagined he could do.',
        posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        backdropPath: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
        releaseDate: '1994-06-23',
        voteAverage: 8.5,
        genreIds: [35, 18, 10749],
        providerIds: [531],
    },
    {
        tmdbId: 120,
        mediaType: 'movie',
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        overview: 'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home to keep it from falling into the hands of evil forces.',
        posterPath: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
        backdropPath: '/pIUvQ9Ed35wlWhY2oU6OmwEgzx8.jpg',
        releaseDate: '2001-12-18',
        voteAverage: 8.4,
        genreIds: [12, 14, 28],
        providerIds: [1899],
    },
    {
        tmdbId: 603,
        mediaType: 'movie',
        title: 'The Matrix',
        overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.',
        posterPath: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
        backdropPath: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
        releaseDate: '1999-03-30',
        voteAverage: 8.2,
        genreIds: [28, 878],
        providerIds: [1899],
    },
    {
        tmdbId: 122,
        mediaType: 'movie',
        title: 'The Lord of the Rings: Return of the King',
        overview: "Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship struggle to save Gondor from Sauron's forces.",
        posterPath: '/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
        backdropPath: '/pm0RiwNpSja8gR0BTWpxo5a9Bbl.jpg',
        releaseDate: '2003-12-01',
        voteAverage: 8.5,
        genreIds: [12, 14, 28],
        providerIds: [1899],
    },
    {
        tmdbId: 424,
        mediaType: 'movie',
        title: "Schindler's List",
        overview: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
        posterPath: '/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
        backdropPath: '/loRmRzQXZC0lnGWVJo8MIv9bIJy.jpg',
        releaseDate: '1993-12-15',
        voteAverage: 8.6,
        genreIds: [18, 36, 10752],
        providerIds: [8],
    },
    {
        tmdbId: 157336,
        mediaType: 'movie',
        title: 'Interstellar',
        overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropPath: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
        releaseDate: '2014-11-05',
        voteAverage: 8.4,
        genreIds: [12, 18, 878],
        providerIds: [531],
    },
    {
        tmdbId: 496243,
        mediaType: 'movie',
        title: 'Parasite',
        overview: "All unemployed, Ki-taek's family takes a peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
        posterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        backdropPath: '/TU9NIjwzjoKPwQHoHshkFcQUCG8.jpg',
        releaseDate: '2019-05-30',
        voteAverage: 8.5,
        genreIds: [35, 53, 18],
        providerIds: [15],
    },
    {
        tmdbId: 569094,
        mediaType: 'movie',
        title: 'Spider-Man: Across the Spider-Verse',
        overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse.",
        posterPath: '/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
        backdropPath: '/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        releaseDate: '2023-05-31',
        voteAverage: 8.4,
        genreIds: [16, 28, 12],
        providerIds: [8],
    },
    {
        tmdbId: 274,
        mediaType: 'movie',
        title: 'Silence of the Lambs',
        overview: 'Clarice Starling is a top student at the FBI\'s training academy. Jack Crawford wants Clarice to interview Dr. Hannibal Lecter, a brilliant psychiatrist who is also a violent psychopath.',
        posterPath: '/uS9m8OBk1RVFDUGEeF4sR7IDBqj.jpg',
        backdropPath: '/mfwq2nMBzArzQ7Y9RKE8SKeeTcg.jpg',
        releaseDate: '1991-02-01',
        voteAverage: 8.3,
        genreIds: [80, 18, 53],
        providerIds: [99],
    },
    {
        tmdbId: 429,
        mediaType: 'movie',
        title: 'The Good, the Bad and the Ugly',
        overview: 'While the Civil War rages between the Union and the Confederacy, three men – a quiet loner, a ruthless hit man, and a Mexican bandit – comb the American Southwest in search of a fortune in gold.',
        posterPath: '/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg',
        backdropPath: '/kOjvGAhHk8C3hiSV7CjO5wHFipg.jpg',
        releaseDate: '1966-12-23',
        voteAverage: 8.5,
        genreIds: [37],
        providerIds: [9],
    },
];

/** Resolve genre ID to name */
function genreName(id: number): string {
    return MOVIE_GENRES.find((g) => g.id === id)?.name ?? '';
}

/**
 * Swipe Deck Screen — the core swiping experience.
 */
export default function SwipeDeckScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const [cards, setCards] = useState(MOCK_CARDS);
    const [loading] = useState(false);
    const [detailCard, setDetailCard] = useState<TitleCardType | null>(null);

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotation = useSharedValue(0);

    const currentCard = cards[0] ?? null;

    const removeCard = useCallback(
        (decision: 'like' | 'nope' | 'superlike') => {
            if (decision === 'like' || decision === 'superlike') {
                triggerHaptic();
            }
            setCards((prev) => prev.slice(1));
        },
        [],
    );

    const resetPosition = useCallback(() => {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotation.value = withSpring(0, { damping: 15 });
    }, []);

    const swipeAway = useCallback(
        (direction: 'left' | 'right') => {
            const decision = direction === 'right' ? 'like' : 'nope';
            const targetX = direction === 'right' ? width * 1.5 : -width * 1.5;

            translateX.value = withTiming(targetX, { duration: 300 });
            rotation.value = withTiming(direction === 'right' ? 30 : -30, { duration: 300 });

            setTimeout(() => {
                runOnJS(removeCard)(decision);
                translateX.value = 0;
                translateY.value = 0;
                rotation.value = 0;
            }, 300);
        },
        [width, removeCard],
    );

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY * 0.3;
            rotation.value = interpolate(
                event.translationX,
                [-width / 2, 0, width / 2],
                [-15, 0, 15],
                Extrapolation.CLAMP,
            );
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(swipeAway)('right');
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(swipeAway)('left');
            } else {
                runOnJS(resetPosition)();
            }
        });

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotateZ: `${rotation.value}deg` },
        ],
    }));

    const likeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD],
            [0, 1],
            Extrapolation.CLAMP,
        ),
    }));

    const nopeOpacity = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [-SWIPE_THRESHOLD, 0],
            [1, 0],
            Extrapolation.CLAMP,
        ),
    }));

    if (loading) {
        return (
            <SafeAreaWrapper>
                <CardSkeleton />
            </SafeAreaWrapper>
        );
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>← Lobby</Text>
                    </TouchableOpacity>
                    <Text style={styles.counter}>
                        {cards.length} remaining
                    </Text>
                    <TouchableOpacity onPress={() => router.push('/matches')}>
                        <Text style={styles.matchesLink}>Matches 💜</Text>
                    </TouchableOpacity>
                </View>

                {/* Card Area */}
                <View style={styles.deckArea}>
                    {currentCard ? (
                        <GestureDetector gesture={panGesture}>
                            <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
                                {/* Swipe labels */}
                                <Animated.View style={[styles.swipeLabel, styles.likeLabel, likeOpacity]}>
                                    <Text style={styles.swipeLabelText}>LIKE 💚</Text>
                                </Animated.View>
                                <Animated.View style={[styles.swipeLabel, styles.nopeLabel, nopeOpacity]}>
                                    <Text style={styles.swipeLabelText}>NOPE 👎</Text>
                                </Animated.View>

                                <TitleCard card={currentCard} />
                            </Animated.View>
                        </GestureDetector>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>🍿</Text>
                            <Text style={styles.emptyText}>No more titles!</Text>
                            <Text style={styles.emptyHint}>
                                Check back later or adjust your filters
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                {currentCard && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.nopeBtn]}
                            onPress={() => swipeAway('left')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionText}>✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.infoBtn]}
                            onPress={() => setDetailCard(currentCard)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionText}>ℹ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.likeBtn]}
                            onPress={() => swipeAway('right')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.actionText}>♥</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* ─── Detail Modal ─── */}
            <Modal
                visible={detailCard !== null}
                transparent
                animationType="slide"
                onRequestClose={() => setDetailCard(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {detailCard?.posterPath && (
                                <Image
                                    source={{
                                        uri: `${TMDB_IMAGE_BASE}/${TMDB_POSTER_SIZES.large}${detailCard.posterPath}`,
                                    }}
                                    style={styles.modalPoster}
                                    resizeMode="cover"
                                />
                            )}
                            <Text style={styles.modalTitle}>{detailCard?.title}</Text>

                            <View style={styles.modalMeta}>
                                <Text style={styles.modalMetaText}>
                                    {detailCard?.releaseDate?.slice(0, 4)}
                                </Text>
                                <Text style={styles.modalMetaText}>
                                    ⭐ {detailCard?.voteAverage?.toFixed(1)}
                                </Text>
                                <Text style={styles.modalMetaText}>
                                    {detailCard?.mediaType === 'movie' ? '🎬 Movie' : '📺 TV'}
                                </Text>
                            </View>

                            {/* Genres */}
                            <View style={styles.modalGenres}>
                                {detailCard?.genreIds.map((id) => (
                                    <View key={id} style={styles.modalGenreBadge}>
                                        <Text style={styles.modalGenreText}>{genreName(id)}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Synopsis */}
                            <Text style={styles.modalSectionTitle}>Synopsis</Text>
                            <Text style={styles.modalOverviewText}>
                                {detailCard?.overview}
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalClose}
                            onPress={() => setDetailCard(null)}
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
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    backText: { ...Typography.body, color: Colors.text.secondary },
    counter: { ...Typography.caption, color: Colors.text.muted },
    matchesLink: { ...Typography.body, color: Colors.accent.primary },
    deckArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cardWrapper: { position: 'relative' },
    swipeLabel: {
        position: 'absolute',
        top: 40,
        zIndex: 10,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: 8,
        borderWidth: 3,
    },
    likeLabel: { left: 20, borderColor: Colors.swipe.like },
    nopeLabel: { right: 20, borderColor: Colors.swipe.nope },
    swipeLabelText: { ...Typography.heading3, color: Colors.text.primary, fontWeight: '700' },
    emptyState: { alignItems: 'center', paddingHorizontal: Spacing.xl },
    emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
    emptyText: { ...Typography.heading2, color: Colors.text.primary, textAlign: 'center' },
    emptyHint: { ...Typography.body, color: Colors.text.secondary, textAlign: 'center', marginTop: Spacing.xs },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.lg,
        paddingVertical: Spacing.lg,
    },
    actionBtn: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.card,
    },
    nopeBtn: { backgroundColor: Colors.bg.tertiary, borderWidth: 2, borderColor: Colors.swipe.nope },
    likeBtn: { backgroundColor: Colors.bg.tertiary, borderWidth: 2, borderColor: Colors.swipe.like },
    infoBtn: { backgroundColor: Colors.bg.tertiary, borderWidth: 2, borderColor: Colors.accent.primary },
    actionText: { fontSize: 28, color: Colors.text.primary },

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
    modalTitle: {
        ...Typography.heading1,
        color: Colors.text.primary,
    },
    modalMeta: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    modalMetaText: {
        ...Typography.body,
        color: Colors.text.secondary,
    },
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
    modalGenreText: {
        ...Typography.caption,
        color: Colors.accent.primary,
    },
    modalSectionTitle: {
        ...Typography.heading3,
        color: Colors.text.primary,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    modalOverviewText: {
        ...Typography.body,
        color: Colors.text.secondary,
        lineHeight: 24,
    },
    modalClose: {
        backgroundColor: Colors.accent.primary,
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    modalCloseText: {
        ...Typography.button,
        color: Colors.text.primary,
    },
});

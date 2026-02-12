import { useState, useCallback } from 'react';
import type { TitleCard, StackResponse } from '@streamsync/shared';
import * as api from '../api';

/**
 * Hook to manage the swipe card stack.
 * Handles fetching, pagination, and swiped-title removal.
 */
export function useStack(roomId: string | null) {
    const [cards, setCards] = useState<TitleCard[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchStack = useCallback(
        async (mediaType: 'movie' | 'tv' = 'movie') => {
            if (!roomId) return;
            setLoading(true);
            try {
                const data: StackResponse = await api.getStack(roomId, mediaType);
                setCards(data.cards);
                setHasMore(data.hasMore);
            } catch (err) {
                console.error('Failed to fetch stack:', err);
            } finally {
                setLoading(false);
            }
        },
        [roomId],
    );

    const removeTopCard = useCallback(() => {
        setCards((prev) => prev.slice(1));
    }, []);

    return { cards, loading, hasMore, fetchStack, removeTopCard };
}

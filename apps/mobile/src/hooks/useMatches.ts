import { useState, useCallback, useEffect } from 'react';
import type { Match } from '@streamsync/shared';
import * as api from '../api';
import { useRoom } from './useRoom';

export function useMatches() {
    const { roomId } = useRoom();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshMatches = useCallback(async () => {
        if (!roomId) return;
        setLoading(true);
        try {
            const data = await api.getMatches(roomId);
            setMatches(data);
        } catch (err) {
            console.error('Failed to fetch matches:', err);
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    // Initial fetch when room is joined
    useEffect(() => {
        if (roomId) {
            refreshMatches();
        }
    }, [roomId, refreshMatches]);

    return {
        matches,
        loading,
        refreshMatches,
    };
}

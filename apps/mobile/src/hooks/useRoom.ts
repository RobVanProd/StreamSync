import { useState, useCallback } from 'react';
import type { RoomMember } from '@streamsync/shared';
import * as api from '../api';

/**
 * Hook to manage room state: create, join, members, providers.
 */
export function useRoom() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [members, setMembers] = useState<RoomMember[]>([]);
    const [loading, setLoading] = useState(false);

    const createRoom = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.createRoom();
            setRoomId(data.roomId);
            setRoomCode(data.code);
            return data;
        } catch (err) {
            console.error('Failed to create room:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const joinRoom = useCallback(async (code: string) => {
        setLoading(true);
        try {
            const data = await api.joinRoom(code);
            setRoomId(data.roomId);
            setRoomCode(data.code);
            return data;
        } catch (err) {
            console.error('Failed to join room:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshMembers = useCallback(async () => {
        if (!roomId) return;
        try {
            const data = await api.getMembers(roomId);
            setMembers(data);
        } catch (err) {
            console.error('Failed to fetch members:', err);
        }
    }, [roomId]);

    const setProviders = useCallback(
        async (providers: number[]) => {
            if (!roomId) return;
            await api.setProviders(roomId, providers);
        },
        [roomId],
    );

    return {
        roomId,
        roomCode,
        members,
        loading,
        createRoom,
        joinRoom,
        refreshMembers,
        setProviders,
    };
}

import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@streamsync/shared';
import type {
    MatchFoundPayload,
    MemberReadyChangedPayload,
    RoomJoinedPayload,
} from '@streamsync/shared';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3000';

/**
 * Hook to manage Socket.io connection for real-time room events.
 */
export function useSocket(roomId: string | null, userId: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    // Event callbacks (updated via refs to avoid stale closures)
    const onMatchRef = useRef<((payload: MatchFoundPayload) => void) | null>(null);
    const onMemberReadyRef = useRef<((payload: MemberReadyChangedPayload) => void) | null>(null);
    const onMemberJoinedRef = useRef<((payload: RoomJoinedPayload) => void) | null>(null);

    useEffect(() => {
        if (!roomId || !userId) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            autoConnect: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            socket.emit(SocketEvents.JOIN_ROOM, { roomId, userId });
        });

        socket.on('disconnect', () => setConnected(false));

        socket.on(SocketEvents.MATCH_FOUND, (payload: MatchFoundPayload) => {
            onMatchRef.current?.(payload);
        });

        socket.on(SocketEvents.MEMBER_READY_CHANGED, (payload: MemberReadyChangedPayload) => {
            onMemberReadyRef.current?.(payload);
        });

        socket.on(SocketEvents.ROOM_JOINED, (payload: RoomJoinedPayload) => {
            onMemberJoinedRef.current?.(payload);
        });

        return () => {
            socket.emit(SocketEvents.LEAVE_ROOM, { roomId, userId });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [roomId, userId]);

    const onMatch = useCallback((cb: (payload: MatchFoundPayload) => void) => {
        onMatchRef.current = cb;
    }, []);

    const onMemberReady = useCallback((cb: (payload: MemberReadyChangedPayload) => void) => {
        onMemberReadyRef.current = cb;
    }, []);

    const onMemberJoined = useCallback((cb: (payload: RoomJoinedPayload) => void) => {
        onMemberJoinedRef.current = cb;
    }, []);

    return { connected, onMatch, onMemberReady, onMemberJoined };
}

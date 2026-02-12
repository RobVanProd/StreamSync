import type { TitleCard, RoomMember } from './types';

// ─── Socket.io Event Names ───────────────────────────────────

export const SocketEvents = {
    /** Client → Server: join a room channel */
    JOIN_ROOM: 'join_room',
    /** Client → Server: leave a room channel */
    LEAVE_ROOM: 'leave_room',

    /** Server → Client: a member joined the room */
    ROOM_JOINED: 'room_joined',
    /** Server → Client: a member's ready / provider state changed */
    MEMBER_READY_CHANGED: 'member_ready_changed',
    /** Server → Client: a match was found */
    MATCH_FOUND: 'match_found',
    /** Server → Client: a member left the room */
    MEMBER_LEFT: 'member_left',
} as const;

// ─── Event Payloads ──────────────────────────────────────────

export interface JoinRoomPayload {
    roomId: string;
    userId: string;
}

export interface RoomJoinedPayload {
    member: RoomMember & { displayName: string };
}

export interface MemberReadyChangedPayload {
    userId: string;
    ready: boolean;
    activeProviders: number[];
}

export interface MatchFoundPayload {
    roomId: string;
    tmdbId: number;
    mediaType: 'movie' | 'tv';
    matchedAt: string;
    title: TitleCard;
}

export interface MemberLeftPayload {
    userId: string;
}

// ─── Aggregate Map (useful for typed Socket.io wiring) ───────

export interface ServerToClientEvents {
    [SocketEvents.ROOM_JOINED]: (payload: RoomJoinedPayload) => void;
    [SocketEvents.MEMBER_READY_CHANGED]: (payload: MemberReadyChangedPayload) => void;
    [SocketEvents.MATCH_FOUND]: (payload: MatchFoundPayload) => void;
    [SocketEvents.MEMBER_LEFT]: (payload: MemberLeftPayload) => void;
}

export interface ClientToServerEvents {
    [SocketEvents.JOIN_ROOM]: (payload: JoinRoomPayload) => void;
    [SocketEvents.LEAVE_ROOM]: (payload: JoinRoomPayload) => void;
}

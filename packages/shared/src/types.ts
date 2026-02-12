// ─── Domain Types ────────────────────────────────────────────

export interface User {
    id: string;
    displayName: string;
    email?: string;
    createdAt: string;
}

export interface Room {
    id: string;
    code: string;
    region: string;
    matchRule: MatchRule;
    createdBy: string;
    createdAt: string;
}

export interface RoomMember {
    roomId: string;
    userId: string;
    activeProviders: number[];
    ready: boolean;
}

export type SwipeDecision = 'like' | 'nope' | 'superlike';
export type MediaType = 'movie' | 'tv';
export type MatchRule = 'any_two' | 'unanimous';

export interface Swipe {
    roomId: string;
    userId: string;
    tmdbId: number;
    mediaType: MediaType;
    decision: SwipeDecision;
    createdAt: string;
}

export interface Match {
    id: string;
    roomId: string;
    tmdbId: number;
    mediaType: MediaType;
    matchedAt: string;
    title: string;
    overview: string;
    posterPath: string | null;
    releaseDate: string | null;
    voteAverage: number;
}

// ─── Title / Card Types ──────────────────────────────────────

export interface TitleCard {
    tmdbId: number;
    mediaType: MediaType;
    title: string;
    overview: string;
    posterPath: string | null;
    backdropPath: string | null;
    releaseDate: string | null;
    voteAverage: number;
    genreIds: number[];
    providerIds: number[];
}

// ─── API Request / Response Shapes ───────────────────────────

export interface CreateRoomResponse {
    roomId: string;
    code: string;
}

export interface JoinRoomRequest {
    code: string;
}

export interface SetProvidersRequest {
    providers: number[];
}

export interface StackRequest {
    mediaType: MediaType;
    limit?: number;
}

export interface StackResponse {
    cards: TitleCard[];
    page: number;
    hasMore: boolean;
}

export interface SwipeRequest {
    tmdbId: number;
    mediaType: MediaType;
    decision: SwipeDecision;
}

export interface SwipeResponse {
    matched: boolean;
    match?: Match;
}

export interface MatchesResponse {
    matches: Match[];
}

// ─── Auth ────────────────────────────────────────────────────

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface GuestAuthRequest {
    displayName: string;
}

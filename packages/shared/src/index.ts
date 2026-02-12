// Types
export type {
    User,
    Room,
    RoomMember,
    Swipe,
    Match,
    TitleCard,
    SwipeDecision,
    MediaType,
    MatchRule,
    CreateRoomResponse,
    JoinRoomRequest,
    SetProvidersRequest,
    StackRequest,
    StackResponse,
    SwipeRequest,
    SwipeResponse,
    MatchesResponse,
    AuthTokens,
    GuestAuthRequest,
} from './types';

// Schemas
export {
    MediaTypeSchema,
    SwipeDecisionSchema,
    MatchRuleSchema,
    JoinRoomSchema,
    SetProvidersSchema,
    SwipeRequestSchema,
    StackQuerySchema,
    GuestAuthSchema,
} from './schemas';
export type {
    JoinRoomInput,
    SetProvidersInput,
    SwipeRequestInput,
    StackQueryInput,
    GuestAuthInput,
} from './schemas';

// Events
export {
    SocketEvents,
} from './events';
export type {
    JoinRoomPayload,
    RoomJoinedPayload,
    MemberReadyChangedPayload,
    MatchFoundPayload,
    MemberLeftPayload,
    ServerToClientEvents,
    ClientToServerEvents,
} from './events';

// Constants
export {
    DEFAULT_REGION,
    DEFAULT_MATCH_RULE,
    DEFAULT_STACK_LIMIT,
    ROOM_CODE_LENGTH,
    TMDB_BASE_URL,
    TMDB_IMAGE_BASE,
    TMDB_POSTER_SIZES,
    TMDB_BACKDROP_SIZES,
    STREAMING_PROVIDERS,
    MOVIE_GENRES,
    TV_GENRES,
    CACHE_TTL,
    TMDB_ATTRIBUTION,
} from './constants';

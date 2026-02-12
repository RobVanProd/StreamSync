// ─── Default Configuration ───────────────────────────────────

export const DEFAULT_REGION = 'US';
export const DEFAULT_MATCH_RULE = 'any_two' as const;
export const DEFAULT_STACK_LIMIT = 20;
export const ROOM_CODE_LENGTH = 5;

// ─── TMDb Configuration ─────────────────────────────────────

export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SIZES = {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
} as const;
export const TMDB_BACKDROP_SIZES = {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
} as const;

// ─── Popular US Streaming Providers (TMDb provider IDs) ──────

export const STREAMING_PROVIDERS = [
    { id: 8, name: 'Netflix', logo: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg' },
    { id: 9, name: 'Amazon Prime Video', logo: '/emthp39XA2YScoYL1p0sdbAH2WA.jpg' },
    { id: 337, name: 'Disney+', logo: '/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg' },
    { id: 1899, name: 'Max', logo: '/6Q3KKEFUN3g0RwGJmJmyP2qce4S.jpg' },
    { id: 15, name: 'Hulu', logo: '/zxrVdFjIjLqkfnwyghnfywTn3Lh.jpg' },
    { id: 386, name: 'Peacock', logo: '/8VCV78prwd9QzZnEBqbGMN7JfrT.jpg' },
    { id: 531, name: 'Paramount+', logo: '/xbhHHa1YgtpwhC8lb1NQ3ACVcLd.jpg' },
    { id: 350, name: 'Apple TV+', logo: '/6uhKBfmtzFqOcLousHwZuzcrScK.jpg' },
    { id: 283, name: 'Crunchyroll', logo: '/8Gt1iClBlzTeQs8WQm8UrCoIxnQ.jpg' },
    { id: 37, name: 'Showtime', logo: '/Allse9kbjiP6ExaQrnSpIhkurEi.jpg' },
    { id: 99, name: 'Shudder', logo: '/dNAz0MMIPiqCD2axGIktXhas8hj.jpg' },
] as const;

// ─── Genre IDs (TMDb) ────────────────────────────────────────

export const MOVIE_GENRES = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
] as const;

export const TV_GENRES = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
] as const;

// ─── Cache TTLs (seconds) ────────────────────────────────────

export const CACHE_TTL = {
    DISCOVER_PAGE: 12 * 60 * 60,     // 12 hours
    PROVIDER_LIST: 24 * 60 * 60,     // 24 hours
    TITLE_DETAILS: 7 * 24 * 60 * 60, // 7 days
} as const;

// ─── Attribution ─────────────────────────────────────────────

export const TMDB_ATTRIBUTION =
    'This product uses the TMDB API but is not endorsed or certified by TMDB.';

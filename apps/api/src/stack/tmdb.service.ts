import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { TMDB_BASE_URL } from '@streamsync/shared';
import type { MediaType, TitleCard } from '@streamsync/shared';

interface TmdbDiscoverResult {
    id: number;
    title?: string;       // movies
    name?: string;        // tv
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string; // movies
    first_air_date?: string; // tv
    vote_average: number;
    genre_ids: number[];
}

interface TmdbDiscoverResponse {
    page: number;
    total_pages: number;
    total_results: number;
    results: TmdbDiscoverResult[];
}

@Injectable()
export class TmdbService {
    private readonly logger = new Logger(TmdbService.name);
    private readonly http: AxiosInstance;

    constructor(private config: ConfigService) {
        const apiKey = this.config.get<string>('TMDB_API_KEY', '');
        this.http = axios.create({
            baseURL: TMDB_BASE_URL,
            params: { api_key: apiKey },
            timeout: 10_000,
        });
    }

    /**
     * Discover movies or TV with streaming-provider + region filtering.
     * Uses TMDb /discover/{mediaType} with flatrate monetization.
     */
    async discover(options: {
        mediaType: MediaType;
        providerIds: number[];
        region: string;
        page?: number;
    }): Promise<{ cards: TitleCard[]; page: number; totalPages: number }> {
        const { mediaType, providerIds, region, page = 1 } = options;

        try {
            const { data } = await this.http.get<TmdbDiscoverResponse>(
                `/discover/${mediaType}`,
                {
                    params: {
                        watch_region: region,
                        with_watch_monetization_types: 'flatrate',
                        with_watch_providers: providerIds.join('|'),
                        sort_by: 'popularity.desc',
                        page,
                    },
                },
            );

            const cards: TitleCard[] = data.results.map((r) => ({
                tmdbId: r.id,
                mediaType,
                title: r.title ?? r.name ?? 'Unknown',
                overview: r.overview,
                posterPath: r.poster_path,
                backdropPath: r.backdrop_path,
                releaseDate: r.release_date ?? r.first_air_date ?? null,
                voteAverage: r.vote_average,
                genreIds: r.genre_ids,
                providerIds,
            }));

            return { cards, page: data.page, totalPages: data.total_pages };
        } catch (err: any) {
            this.logger.error(`TMDb discover failed: ${err.message}`);
            return { cards: [], page: 1, totalPages: 0 };
        }
    }

    /** Fetch watch provider info for a specific title. */
    async getWatchProviders(tmdbId: number, mediaType: MediaType, region = 'US') {
        try {
            const { data } = await this.http.get(
                `/${mediaType}/${tmdbId}/watch/providers`,
            );
            return data.results?.[region] ?? null;
        } catch (err: any) {
            this.logger.error(`TMDb watch providers failed: ${err.message}`);
            return null;
        }
    }
}

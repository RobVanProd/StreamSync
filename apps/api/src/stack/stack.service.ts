import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RoomsService } from '../rooms/rooms.service';
import { TmdbService } from './tmdb.service';
import { CACHE_TTL } from '@streamsync/shared';
import type { MediaType, TitleCard } from '@streamsync/shared';

@Injectable()
export class StackService {
    private readonly logger = new Logger(StackService.name);

    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
        private rooms: RoomsService,
        private tmdb: TmdbService,
    ) { }

    /**
     * Get a stack of title cards for a room.
     * - Computes provider intersection across ready members.
     * - Fetches from cache or TMDb discover.
     * - Filters out titles the user has already swiped on.
     */
    async getStack(
        roomId: string,
        userId: string,
        mediaType: MediaType,
        limit: number,
    ) {
        // 1. Get provider intersection; if empty, use union (so we show *something*)
        let providers = await this.rooms.getProviderIntersection(roomId);
        if (providers.length === 0) {
            providers = await this.rooms.getProviderUnion(roomId);
        }

        // If still empty (no one selected anything), default to "popular on Netflix/Disney+"
        if (providers.length === 0) {
            providers = [8, 337];
        }

        // 2. Get room region
        const room = await this.prisma.room.findUnique({
            where: { id: roomId },
            select: { region: true },
        });
        const region = room?.region ?? 'US';

        // 3. Build cache key
        const providersHash = providers.sort().join(',');
        const cacheKey = `stack:${region}:${providersHash}:${mediaType}:1`;

        // 4. Check cache
        let cards: TitleCard[] = [];
        const cached = await this.redis.get(cacheKey);
        if (cached) {
            cards = JSON.parse(cached);
            this.logger.debug(`Cache HIT for ${cacheKey}`);
        } else {
            // 5. Fetch from TMDb
            const result = await this.tmdb.discover({
                mediaType,
                providerIds: providers,
                region,
                page: 1,
            });
            cards = result.cards;

            // Cache result
            if (cards.length > 0) {
                await this.redis.set(
                    cacheKey,
                    JSON.stringify(cards),
                    CACHE_TTL.DISCOVER_PAGE,
                );
            }
        }

        // 6. Filter out already-swiped titles
        const swipedIds = await this.prisma.swipe.findMany({
            where: { roomId, userId, mediaType },
            select: { tmdbId: true },
        });
        const swipedSet = new Set(swipedIds.map((s) => s.tmdbId));
        const filtered = cards.filter((c) => !swipedSet.has(c.tmdbId));

        return {
            cards: filtered.slice(0, limit),
            page: 1,
            hasMore: filtered.length > limit,
        };
    }
}

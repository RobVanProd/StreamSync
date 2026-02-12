import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomsGateway } from '../rooms/rooms.gateway';
import { TmdbService } from '../stack/tmdb.service';
import type { SwipeDecision, MediaType, TitleCard } from '@streamsync/shared';

@Injectable()
export class SwipesService {
    private readonly logger = new Logger(SwipesService.name);

    constructor(
        private prisma: PrismaService,
        private roomsGateway: RoomsGateway,
        private tmdb: TmdbService,
    ) { }

    /**
     * Record a swipe and check for a match (race-safe via unique constraints).
     *
     * Match condition (§8.1): if ANY other member in the room has
     * already liked the same title, create a match.
     */
    async submitSwipe(
        roomId: string,
        userId: string,
        tmdbId: number,
        mediaType: MediaType,
        decision: SwipeDecision,
    ) {
        // 1. Persist swipe (idempotent via unique constraint)
        await this.prisma.swipe.upsert({
            where: {
                roomId_userId_tmdbId_mediaType: { roomId, userId, tmdbId, mediaType },
            },
            create: { roomId, userId, tmdbId, mediaType, decision },
            update: { decision },
        });

        // 2. If not a "like" or "superlike", no match check needed
        if (decision === 'nope') {
            return { matched: false };
        }

        // 3. Check if any OTHER member has liked this title
        const otherLike = await this.prisma.swipe.findFirst({
            where: {
                roomId,
                tmdbId,
                mediaType,
                userId: { not: userId },
                decision: { in: ['like', 'superlike'] },
            },
        });

        if (!otherLike) {
            return { matched: false };
        }

        // 4. Match found! Fetch metadata to store (so we don't need N+1 calls later)
        let title = 'Matched Title';
        let posterPath: string | null = null;
        let overview = '';
        let releaseDate: string | null = null;
        let voteAverage = 0;

        try {
            const details = await this.tmdb.getDetails(tmdbId, mediaType);
            if (details) {
                title = details.title;
                posterPath = details.posterPath;
                overview = details.overview;
                releaseDate = details.releaseDate;
                voteAverage = details.voteAverage;
            }
        } catch (error) {
            this.logger.warn(`Failed to fetch details for match ${tmdbId}: ${error}`);
        }

        try {
            const match = await this.prisma.match.create({
                data: {
                    roomId,
                    tmdbId,
                    mediaType,
                    title,
                    posterPath,
                    overview,
                    releaseDate,
                    voteAverage,
                },
            });

            // 5. Build title card for the socket event
            const titleCard: TitleCard = {
                tmdbId,
                mediaType,
                title,
                overview,
                posterPath,
                backdropPath: null,
                releaseDate,
                voteAverage,
                genreIds: [], // We could fetch these too if needed
                providerIds: [],
            };

            // 6. Emit real-time match event
            this.roomsGateway.emitMatchFound(roomId, {
                roomId,
                tmdbId,
                mediaType,
                matchedAt: match.matchedAt.toISOString(),
                title: titleCard,
            });

            return { matched: true, match };
        } catch (err: any) {
            // Unique constraint violation → already matched, still tell the user
            if (err.code === 'P2002') {
                this.logger.debug(`Title ${tmdbId} already matched in room ${roomId}`);
                return { matched: true };
            }
            throw err;
        }

    }
}

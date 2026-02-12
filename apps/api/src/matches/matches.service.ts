import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchesService {
    constructor(private prisma: PrismaService) { }

    /** Get all matches for a room, newest first. */
    async getMatches(roomId: string) {
        return this.prisma.match.findMany({
            where: { roomId },
            orderBy: { matchedAt: 'desc' },
            select: {
                id: true,
                tmdbId: true,
                mediaType: true,
                title: true,
                posterPath: true,
                overview: true,
                releaseDate: true,
                voteAverage: true,
                matchedAt: true,
                // We're not storing genreIds/providerIds in Match yet, 
                // but we could if needed or fetch them on the fly.
                // For now, this is enough for the list view.
            }
        });
    }
}

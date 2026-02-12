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
        });
    }
}

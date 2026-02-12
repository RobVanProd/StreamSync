import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rooms/:roomId/matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
    constructor(private readonly matchesService: MatchesService) { }

    /**
     * GET /api/v1/rooms/:roomId/matches
     * Returns shared match list for the room.
     */
    @Get()
    async list(@Param('roomId') roomId: string) {
        const matches = await this.matchesService.getMatches(roomId);
        return { matches };
    }
}

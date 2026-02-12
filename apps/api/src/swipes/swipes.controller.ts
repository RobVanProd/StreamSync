import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { SwipesService } from './swipes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SwipeRequestSchema } from '@streamsync/shared';

@Controller('rooms/:roomId/swipes')
@UseGuards(JwtAuthGuard)
export class SwipesController {
    constructor(private readonly swipesService: SwipesService) { }

    /**
     * POST /api/v1/rooms/:roomId/swipes
     * Submit a swipe decision. Returns { matched, match? }.
     */
    @Post()
    async submit(
        @Req() req: any,
        @Param('roomId') roomId: string,
        @Body() body: unknown,
    ) {
        const { tmdbId, mediaType, decision } = SwipeRequestSchema.parse(body);
        return this.swipesService.submitSwipe(
            roomId,
            req.user.id,
            tmdbId,
            mediaType,
            decision,
        );
    }
}

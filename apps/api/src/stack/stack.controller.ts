import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { StackService } from './stack.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StackQuerySchema } from '@streamsync/shared';

@Controller('rooms/:roomId/stack')
@UseGuards(JwtAuthGuard)
export class StackController {
    constructor(private readonly stackService: StackService) { }

    /**
     * GET /api/v1/rooms/:roomId/stack?mediaType=movie&limit=20
     * Returns a stack of title cards for swiping.
     */
    @Get()
    async getStack(
        @Req() req: any,
        @Param('roomId') roomId: string,
        @Query() query: unknown,
    ) {
        const { mediaType, limit } = StackQuerySchema.parse(query);
        return this.stackService.getStack(roomId, req.user.id, mediaType, limit);
    }
}

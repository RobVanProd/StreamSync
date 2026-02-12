import {
    Controller,
    Post,
    Put,
    Get,
    Param,
    Body,
    Req,
    UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsGateway } from './rooms.gateway';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JoinRoomSchema, SetProvidersSchema } from '@streamsync/shared';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
    constructor(
        private readonly roomsService: RoomsService,
        private readonly roomsGateway: RoomsGateway,
    ) { }

    /** POST /api/v1/rooms — Create a new room. */
    @Post()
    async create(@Req() req: any) {
        return this.roomsService.createRoom(req.user.id);
    }

    /** POST /api/v1/rooms/join — Join an existing room by code. */
    @Post('join')
    async join(@Req() req: any, @Body() body: unknown) {
        const { code } = JoinRoomSchema.parse(body);
        const result = await this.roomsService.joinRoom(req.user.id, code);

        // Notify the room that a new member joined
        this.roomsGateway.emitMemberReadyChanged(result.roomId, {
            userId: req.user.id,
            ready: false,
            activeProviders: [],
        });

        return result;
    }

    /** PUT /api/v1/rooms/:roomId/me/providers — Set streaming providers. */
    @Put(':roomId/me/providers')
    async setProviders(
        @Req() req: any,
        @Param('roomId') roomId: string,
        @Body() body: unknown,
    ) {
        const { providers } = SetProvidersSchema.parse(body);
        await this.roomsService.setProviders(roomId, req.user.id, providers);

        // Notify the room so other members see the update
        this.roomsGateway.emitMemberReadyChanged(roomId, {
            userId: req.user.id,
            ready: false,
            activeProviders: providers,
        });

        return { success: true };
    }

    /** PUT /api/v1/rooms/:roomId/me/ready — Toggle ready state. */
    @Put(':roomId/me/ready')
    async setReady(
        @Req() req: any,
        @Param('roomId') roomId: string,
        @Body() body: { ready: boolean },
    ) {
        await this.roomsService.setReady(roomId, req.user.id, body.ready);

        // Notify the room
        this.roomsGateway.emitMemberReadyChanged(roomId, {
            userId: req.user.id,
            ready: body.ready,
            activeProviders: [],
        });

        return { success: true };
    }

    /** GET /api/v1/rooms/:roomId/members — List members and their readiness. */
    @Get(':roomId/members')
    async getMembers(@Param('roomId') roomId: string) {
        return this.roomsService.getMembers(roomId);
    }
}

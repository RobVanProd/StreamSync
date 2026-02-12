import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
    SocketEvents,
    type JoinRoomPayload,
    type MatchFoundPayload,
    type MemberReadyChangedPayload,
} from '@streamsync/shared';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/',
})
export class RoomsGateway {
    @WebSocketServer()
    server!: Server;

    /** Client joins a Socket.io room channel. */
    @SubscribeMessage(SocketEvents.JOIN_ROOM)
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: JoinRoomPayload,
    ) {
        client.join(payload.roomId);
        this.server.to(payload.roomId).emit(SocketEvents.ROOM_JOINED, {
            member: { userId: payload.userId },
        });
    }

    /** Client leaves a Socket.io room channel. */
    @SubscribeMessage(SocketEvents.LEAVE_ROOM)
    handleLeaveRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: JoinRoomPayload,
    ) {
        client.leave(payload.roomId);
        this.server.to(payload.roomId).emit(SocketEvents.MEMBER_LEFT, {
            userId: payload.userId,
        });
    }

    /** Emit a member-ready-changed event to the room. */
    emitMemberReadyChanged(roomId: string, payload: MemberReadyChangedPayload) {
        this.server.to(roomId).emit(SocketEvents.MEMBER_READY_CHANGED, payload);
    }

    /** Emit a match-found event to the room (called by SwipesService). */
    emitMatchFound(roomId: string, payload: MatchFoundPayload) {
        this.server.to(roomId).emit(SocketEvents.MATCH_FOUND, payload);
    }
}

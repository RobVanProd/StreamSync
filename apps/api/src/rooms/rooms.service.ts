import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ROOM_CODE_LENGTH } from '@streamsync/shared';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) { }

    /** Generate a random alphanumeric room code. */
    private generateCode(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/1/I for readability
        let code = '';
        for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    /** Parse providers stored as JSON string in SQLite. */
    private parseProviders(raw: string): number[] {
        try {
            return JSON.parse(raw) as number[];
        } catch {
            return [];
        }
    }

    /** Create a new room and add the creator as the first member. */
    async createRoom(userId: string, region = 'US') {
        const code = this.generateCode();

        const room = await this.prisma.room.create({
            data: {
                code,
                region,
                createdBy: userId,
                members: {
                    create: { userId, ready: false, activeProviders: '[]' },
                },
            },
            include: { members: true },
        });

        return { roomId: room.id, code: room.code };
    }

    /** Join an existing room by code. */
    async joinRoom(userId: string, code: string) {
        const room = await this.prisma.room.findUnique({ where: { code } });
        if (!room) throw new NotFoundException('Room not found');

        // Upsert to handle re-joins gracefully
        await this.prisma.roomMember.upsert({
            where: { roomId_userId: { roomId: room.id, userId } },
            create: { roomId: room.id, userId, ready: false, activeProviders: '[]' },
            update: {},
        });

        return { roomId: room.id, code: room.code };
    }

    /** Set a member's active streaming providers. */
    async setProviders(roomId: string, userId: string, providers: number[]) {
        await this.prisma.roomMember.update({
            where: { roomId_userId: { roomId, userId } },
            data: { activeProviders: JSON.stringify(providers) },
        });
    }

    /** Toggle a member's ready state. */
    async setReady(roomId: string, userId: string, ready: boolean) {
        return this.prisma.roomMember.update({
            where: { roomId_userId: { roomId, userId } },
            data: { ready },
        });
    }

    /** Get all members of a room (with display names). */
    async getMembers(roomId: string) {
        return this.prisma.roomMember.findMany({
            where: { roomId },
            include: { user: { select: { displayName: true } } },
        });
    }

    /** Get the intersection of active providers across all ready members. */
    async getProviderIntersection(roomId: string): Promise<number[]> {
        const members = await this.prisma.roomMember.findMany({
            where: { roomId, ready: true },
        });

        if (members.length === 0) return [];

        const providerSets = members.map(
            (m) => new Set(this.parseProviders(m.activeProviders)),
        );

        const intersection = [...providerSets[0]].filter((id) =>
            providerSets.every((set) => set.has(id)),
        );

        return intersection;
    }
    /** Get the union of active providers across all ready members. */
    async getProviderUnion(roomId: string): Promise<number[]> {
        const members = await this.prisma.roomMember.findMany({
            where: { roomId, ready: true },
        });

        if (members.length === 0) return [];

        const providerSets = members.map(
            (m) => new Set(this.parseProviders(m.activeProviders)),
        );

        // Union of all sets
        const union = new Set<number>();
        for (const set of providerSets) {
            for (const id of set) union.add(id);
        }

        return Array.from(union);
    }
}

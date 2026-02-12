import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthTokens } from '@streamsync/shared';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    /**
     * Create a guest user and return JWT tokens.
     * No email/password required — fastest path to first swipe.
     */
    async createGuest(displayName: string): Promise<AuthTokens> {
        const user = await this.prisma.user.create({
            data: { displayName },
        });

        const payload = { sub: user.id, displayName: user.displayName };
        const accessToken = this.jwt.sign(payload);
        const refreshToken = this.jwt.sign(payload, { expiresIn: '30d' });

        return { accessToken, refreshToken };
    }

    /** Validate a user by ID (used by JwtStrategy). */
    async validateUser(userId: string) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
}

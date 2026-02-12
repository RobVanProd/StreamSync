import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GuestAuthSchema } from '@streamsync/shared';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * POST /api/v1/auth/guest
     * Create a guest user and return JWT tokens.
     */
    @Post('guest')
    async guest(@Body() body: unknown) {
        const { displayName } = GuestAuthSchema.parse(body);
        return this.authService.createGuest(displayName);
    }
}

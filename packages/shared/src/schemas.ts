import { z } from 'zod';

// ─── Enums as Zod schemas ────────────────────────────────────

export const MediaTypeSchema = z.enum(['movie', 'tv']);
export const SwipeDecisionSchema = z.enum(['like', 'nope', 'superlike']);
export const MatchRuleSchema = z.enum(['any_two', 'unanimous']);

// ─── API Request Schemas ─────────────────────────────────────

export const JoinRoomSchema = z.object({
    code: z
        .string()
        .min(4, 'Room code must be at least 4 characters')
        .max(8, 'Room code must be at most 8 characters')
        .toUpperCase(),
});

export const SetProvidersSchema = z.object({
    providers: z
        .array(z.number().int().positive())
        .min(1, 'Select at least one provider')
        .max(20, 'Too many providers selected'),
});

export const SwipeRequestSchema = z.object({
    tmdbId: z.number().int().positive(),
    mediaType: MediaTypeSchema,
    decision: SwipeDecisionSchema,
});

export const StackQuerySchema = z.object({
    mediaType: MediaTypeSchema.default('movie'),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const GuestAuthSchema = z.object({
    displayName: z
        .string()
        .min(1, 'Display name is required')
        .max(30, 'Display name must be at most 30 characters')
        .trim(),
});

// ─── Inferred types (re-usable) ─────────────────────────────

export type JoinRoomInput = z.infer<typeof JoinRoomSchema>;
export type SetProvidersInput = z.infer<typeof SetProvidersSchema>;
export type SwipeRequestInput = z.infer<typeof SwipeRequestSchema>;
export type StackQueryInput = z.infer<typeof StackQuerySchema>;
export type GuestAuthInput = z.infer<typeof GuestAuthSchema>;

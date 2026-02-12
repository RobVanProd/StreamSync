/**
 * StreamSync Design Tokens
 * Premium dark theme with vibrant accent colors.
 */

export const Colors = {
    // ─── Background Layers ─────────────────────────
    bg: {
        primary: '#0F0F1A',
        secondary: '#1A1A2E',
        tertiary: '#252540',
        card: '#1E1E35',
        overlay: 'rgba(15, 15, 26, 0.85)',
    },

    // ─── Accent / Brand ───────────────────────────
    accent: {
        primary: '#7C5CFF',    // vibrant purple
        secondary: '#FF6B8A',  // coral pink
        success: '#4ADE80',    // match green
        warning: '#FCD34D',
        error: '#F87171',
    },

    // ─── Text ──────────────────────────────────────
    text: {
        primary: '#F1F1F6',
        secondary: '#A0A0BC',
        muted: '#6B6B85',
        inverse: '#0F0F1A',
    },

    // ─── Borders ───────────────────────────────────
    border: {
        subtle: 'rgba(255, 255, 255, 0.08)',
        medium: 'rgba(255, 255, 255, 0.15)',
    },

    // ─── Swipe Indicators ─────────────────────────
    swipe: {
        like: '#4ADE80',
        nope: '#F87171',
        superlike: '#60A5FA',
    },

    // ─── Gradients ─────────────────────────────────
    gradient: {
        primary: ['#7C5CFF', '#9F7AFF'] as const,
        match: ['#FF6B8A', '#FF8FA3'] as const,
        card: ['rgba(30, 30, 53, 0.9)', 'rgba(15, 15, 26, 0.95)'] as const,
    },
} as const;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

export const Typography = {
    heading1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    heading2: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    heading3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
    },
    bodySmall: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        fontWeight: '500' as const,
        lineHeight: 16,
        letterSpacing: 0.5,
    },
    button: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
        letterSpacing: 0.3,
    },
} as const;

export const Shadows = {
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    button: {
        shadowColor: '#7C5CFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
    },
} as const;

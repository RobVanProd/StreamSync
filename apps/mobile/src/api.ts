import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15_000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── JWT Interceptor ─────────────────────────────

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // TODO: handle 401 → refresh token flow
        return Promise.reject(error);
    },
);

// ─── Auth ────────────────────────────────────────

export async function loginAsGuest(displayName: string) {
    const { data } = await api.post('/auth/guest', { displayName });
    await AsyncStorage.setItem('access_token', data.accessToken);
    await AsyncStorage.setItem('refresh_token', data.refreshToken);
    return data;
}

// ─── Rooms ───────────────────────────────────────

export async function createRoom() {
    const { data } = await api.post('/rooms');
    return data;
}

export async function joinRoom(code: string) {
    const { data } = await api.post('/rooms/join', { code });
    return data;
}

export async function setProviders(roomId: string, providers: number[]) {
    const { data } = await api.put(`/rooms/${roomId}/me/providers`, { providers });
    return data;
}

export async function getMembers(roomId: string) {
    const { data } = await api.get(`/rooms/${roomId}/members`);
    return data;
}

export async function setReady(roomId: string, ready: boolean) {
    const { data } = await api.put(`/rooms/${roomId}/me/ready`, { ready });
    return data;
}

// ─── Stack ───────────────────────────────────────

export async function getStack(
    roomId: string,
    mediaType: 'movie' | 'tv' = 'movie',
    limit = 20,
) {
    const { data } = await api.get(`/rooms/${roomId}/stack`, {
        params: { mediaType, limit },
    });
    return data;
}

// ─── Swipes ──────────────────────────────────────

export async function submitSwipe(
    roomId: string,
    tmdbId: number,
    mediaType: 'movie' | 'tv',
    decision: 'like' | 'nope' | 'superlike',
) {
    const { data } = await api.post(`/rooms/${roomId}/swipes`, {
        tmdbId,
        mediaType,
        decision,
    });
    return data;
}

// ─── Matches ─────────────────────────────────────

export async function getMatches(roomId: string) {
    const { data } = await api.get(`/rooms/${roomId}/matches`);
    return data;
}

export default api;

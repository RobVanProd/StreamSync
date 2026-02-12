import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis | null = null;

    constructor(private config: ConfigService) {
        const url = this.config.get<string>('REDIS_URL');
        if (url) {
            try {
                this.client = new Redis(url, {
                    lazyConnect: true,
                    maxRetriesPerRequest: 0,
                    retryStrategy: () => null, // don't retry — gracefully degrade
                    enableOfflineQueue: false,
                });
                this.client.on('error', () => { }); // suppress unhandled error events
                this.client.connect().catch((err) => {
                    this.logger.warn(`Redis unavailable, running without cache: ${err.message}`);
                    this.client?.disconnect();
                    this.client = null;
                });
            } catch {
                this.logger.warn('Redis unavailable — cache disabled');
            }
        } else {
            this.logger.warn('REDIS_URL not set — cache disabled');
        }
    }

    async onModuleDestroy() {
        await this.client?.quit();
    }

    /** Get a cached value (returns null on miss or if Redis is down). */
    async get(key: string): Promise<string | null> {
        if (!this.client) return null;
        try {
            return await this.client.get(key);
        } catch {
            this.logger.warn(`Cache GET failed for key: ${key}`);
            return null;
        }
    }

    /** Set a cached value with TTL in seconds. */
    async set(key: string, value: string, ttlSeconds: number): Promise<void> {
        if (!this.client) return;
        try {
            await this.client.set(key, value, 'EX', ttlSeconds);
        } catch {
            this.logger.warn(`Cache SET failed for key: ${key}`);
        }
    }

    /** Delete a cached key. */
    async del(key: string): Promise<void> {
        if (!this.client) return;
        try {
            await this.client.del(key);
        } catch {
            this.logger.warn(`Cache DEL failed for key: ${key}`);
        }
    }
}

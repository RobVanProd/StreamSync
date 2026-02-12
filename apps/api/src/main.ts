import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global prefix for all REST routes
    app.setGlobalPrefix('api/v1');

    // CORS — allow all origins in dev
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });

    // Socket.io adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 StreamSync API running on http://localhost:${port}`);
}

bootstrap();

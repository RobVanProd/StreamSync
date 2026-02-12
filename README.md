# 🍿 StreamSync

**StreamSync** is a real-time mobile application that solves the "what should we watch?" dilemma. It allows groups of friends to swipe on movies and TV shows (Tinder-style) and instantly finds matches based on their shared streaming providers.

## ✨ Features

- **card-swipe interface**: Smooth, gesture-based UI for liking/disliking titles.
- **real-time matching**: Instant notifications when a match is found using Socket.io.
- **provider filtering**: Only see content available on services you (and your group) actually have.
- **live lobby**: See who's in the room and when they're ready.
- **cross-platform**: Built with Expo for iOS, Android, and Web.
- **rich metadata**: Detailed movie info, genres, and cast via TMDb integration.

## 🛠 Tech Stack

### Monorepo Structure
- **`apps/mobile`**: React Native (Expo SDK 52) with Expo Router
- **`apps/api`**: NestJS + Prisma (SQLite/Postgres) + Socket.io
- **`packages/shared`**: Shared TypeScript types, Zod schemas, and constants

### Key Libraries
- **Frontend**: `react-native-reanimated`, `react-native-gesture-handler`, `axios`
- **Backend**: `prisma`, `passport-jwt`, `ioredis` (optional), `@nestjs/websockets`
- **Data**: The Movie Database (TMDb) API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Git

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/RobVanProd/StreamSync.git
    cd StreamSync
    ```

2.  **Install dependencies** (from root)
    ```bash
    npm install
    ```

3.  **Environment Setup**
    - Copy `.env.example` to `.env` in `apps/api`:
      ```bash
      cp apps/api/.env.example apps/api/.env
      ```
    - Add your **TMDb API Key** to `apps/api/.env`.

4.  **Database Setup**
    ```bash
    # Generate Prisma client
    cd apps/api && npx prisma generate
    
    # Run migrations (SQLite default)
    npx prisma migrate dev --name init
    ```

### Running the App

1.  **Start the Backend API**
    ```bash
    # Terminal 1
    npm run dev:api
    ```
    *Server runs on http://localhost:3000*

2.  **Start the Mobile App**
    ```bash
    # Terminal 2
    npm run dev:mobile
    ```
    *Press `a` for Android, `i` for iOS (Mac only), or `w` for Web.*

## 📐 Architecture

- **Auth**: Anonymous guest login via JWT (frictionless onboarding).
- **State**: Server-authoritative room state synchronized via WebSockets.
- **Cache**: Redis-backed caching for TMDb queries (graceful fallback to direct API if Redis unavailable).
- **Match Logic**: Race-safe matching using database unique constraints to handle concurrent swipes.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.An app to find common movies to watch.

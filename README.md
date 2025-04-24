# BeatVote 🎵

BeatVote is a real-time collaborative music voting platform where users can join rooms, add songs from YouTube, and vote on what plays next. Perfect for parties, gatherings, or any situation where you want democratic music selection!

## Features ✨

- **Real-time Music Rooms**: Create or join music rooms where people can collaborate on the playlist
- **YouTube Integration**: Add any song from YouTube to the room's queue
- **Democratic Voting**: Vote on songs to determine the play order
- **Live Playback**: Watch and listen to songs together in sync
- **Playback Controls**: Songs automatically play at 2x speed for efficient music discovery
- **Queue Management**: Automatic transition to the next most voted song when the current one ends

## Tech Stack 🛠️

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Real-time Communication**: WebSocket
- **UI Components**: shadcn/ui with Tailwind CSS
- **Video Player**: yt-player for YouTube integration
- **Build System**: Turborepo for monorepo management
- **Package Manager**: pnpm for efficient dependency management

## Project Structure 📁

```
BeatVote/
├── apps/
│   ├── web/                 # Frontend application (Next.js)
│   │   ├── app/            # Next.js app router pages
│   │   ├── components/     # React components
│   │   └── services/       # Frontend services
│   └── server/             # Backend application (Express)
│       ├── services/       # Backend services
│       └── utils/          # Utility functions
├── packages/
│   ├── ui/                 # Shared UI components (shadcn/ui)
│   ├── database/          # Database schema and migrations
│   └── config/            # Shared configurations
└── turbo.json             # Turborepo configuration
```

## Prerequisites 📋

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 15+
- Git

## Complete Setup Guide 🚀

### 1. Clone and Install
```bash
# Clone the repository
git clone https://github.com/Skb3611/BeatVote.git
cd BeatVote

# Install dependencies
pnpm install
```

### 2. Database Setup
```bash
# Start a PostgreSQL container
docker run --name beatvote-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=beatvote -p 5432:5432 -d postgres:15
```

### 3. Environment Setup

Copy the example environment files and update them with your values:

```bash
# Frontend environment
cp apps/web/.env.example apps/web/.env

# Backend environment
cp apps/server/.env.example apps/server/.env

# Database environment
cp packages/database/.env.example packages/database/.env
```

The default environment configurations are:

**apps/web/.env.example**
```env
# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:8000"
NEXT_PUBLIC_WS_URL="ws://localhost:8000"
NEXT_PUBLIC_YOUTUBE_API_KEY="your_youtube_api_key"
```

**apps/server/.env.example**
```env
# Server Configuration
PORT=8000
HOST="localhost"

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beatvote"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"

# YouTube API
YOUTUBE_API_KEY="your_youtube_api_key"
```

**packages/database/.env.example**
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/beatvote"
```

Make sure to:
1. Replace `your_youtube_api_key` with your actual YouTube API key
2. Update `JWT_SECRET` with a secure random string
3. Modify database credentials if you're using different values

### 4. Initialize Database
```bash
# Generate Prisma Client
pnpm exec prisma generate

# Push database schema
pnpm exec prisma migrate dev
```

### 5. Start Development Servers
```bash
# Start all services
pnpm dev
```

Your services will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)
- Database: `localhost:5432`


## Adding UI Components 🎨

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add a new component:

```bash
# From the root directory
pnpm dlx shadcn-ui@latest add button -c apps/web
```

Components will be added to `packages/ui/components` and can be imported like this:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Usage 📖

1. **Create or Join a Room**
   - Create a new room or join an existing one with a room code
   - Each room has its own unique playlist and voting system

2. **Add Songs**
   - Paste a YouTube URL to add songs to the queue
   - Songs are automatically added to the room's playlist

3. **Vote on Songs**
   - Use the upvote/downvote buttons to influence the playlist order
   - Songs with the most votes play next

4. **Enjoy Together**
   - Watch and listen to songs in sync with other room members
   - Songs play automatically at 2x speed
   - When a song ends, the next highest-voted song starts playing

## Troubleshooting 🔧

- **Database Connection Issues**
  - Ensure PostgreSQL is running: `docker ps`
  - Check connection string in .env files
  - Try resetting the database: `pnpm db:reset`

- **Build Errors**
  - Clear Turborepo cache: `pnpm clean`
  - Remove node_modules: `pnpm clean:modules`
  - Reinstall dependencies: `pnpm install`

- **Type Errors**
  - Regenerate Prisma client: `pnpm db:generate`
  - Run type checking: `pnpm typecheck`

- **Missing UI Components**
  - Ensure shadcn/ui components are properly added
  - Check component imports from @workspace/ui

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Thanks to the YouTube API for making video playback possible
- Built with [Turborepo](https://turbo.build/repo)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with love using Next.js and TypeScript

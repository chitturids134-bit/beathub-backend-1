# BeatHub Backend

BeatHub is a robust, Node.js-based music streaming and sharing platform backend. It utilizes MongoDB and Mongoose to manage complex data relationships between artists, albums, tracks, and users, providing a scalable foundation for a modern audio experience.

## Features

- **User Management:** Full authentication and authorization system for music listeners.
- **Music Organization:** Comprehensive data modeling for Artists, Albums, and Songs.
- **Personalized Playlists:** Allows users to curate and manage their own music collections.
- **Relational Data Integrity:** Uses Mongoose referencing to ensure consistency across the database (e.g., updating a song's metadata reflects across all playlists).
- **Data Seeding:** Includes automated scripts to quickly populate the environment with sample music data for development and testing.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Environment Management:** Dotenv

## Getting Started

### Production Verification

- Live URL: https://your-render-api-url.onrender.com
- Admin credentials: `admin@beathub.dev` / `Admin1234!`
- User credentials: `user@beathub.dev` / `User1234!`
- Key endpoints: `POST /api/auth/login`, `GET /api/auth/me`, `GET /api/songs`, `POST /api/songs` (admin only)

### Render Deployment

When deploying to Render, set these environment variables in the Render service settings:

- `MONGO_URI`: a reachable MongoDB connection string, such as MongoDB Atlas or another hosted database
- `JWT_SECRET`: a strong random secret used to sign authentication tokens
- `JWT_EXPIRES_IN`: optional, defaults to `1d`
- `NODE_ENV`: recommended value is `production`

Do not point `MONGO_URI` at `localhost` or a Docker-only hostname such as `db` when running on Render. The service must be able to reach the database over the network.

The current startup code exits immediately if `MONGO_URI` or `JWT_SECRET` is missing, so a Render deploy will fail until both values are configured.

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (Local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd beathub_backend

```

2. Install dependencies:

```bash
npm install

```

3. Configure Environment Variables:
   Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Fill in `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and the Mongo root credentials before starting locally.

For host-based local runs (`npm start`), point `MONGO_URI` at your local MongoDB or Atlas cluster.

4. Seed the Database (Optional):
   Populate your database with sample artists, albums, and songs:

```bash
node seed.js

```

5. Start the Server:

```bash
npm start

```

### Run with Docker Compose (API + MongoDB)

Use Docker Compose to run the full local stack with one command.

Optional: customize ports/secrets by editing `.env` before running Compose.

1. Build and start services:

```bash
docker compose up --build
```

2. Run in background:

```bash
docker compose up -d
```

3. View logs:

```bash
docker compose logs -f
```

4. Stop services:

```bash
docker compose down
```

5. Stop and remove volumes (deletes DB data):

```bash
docker compose down --volumes
```

The Compose file defines:

- `api` service built from the local `Dockerfile`
- `db` service using `mongo:6`
- named volume `db-data` mapped to `/data/db` for persistence
- internal service networking, so API connects with hostname `db`

### Security Notes

- JWTs are issued by `POST /api/auth/login`.
- `GET /api/auth/me` requires a valid Bearer token.
- `POST /api/songs` requires an admin token and returns `403` for regular users.
- Rate limiting is enabled globally and returns `429` after abuse.
- Song listing uses `page` and `limit` query parameters and returns pagination metadata.
- `password` fields are excluded from query results by default.

## Data Schema

The backend is built around five core entities:

- **Artist:** The creators of the music.
- **Album:** Collections of songs linked to specific artists.
- **Song:** Individual audio tracks with duration and genre data.
- **User:** Profile management for the platform's listeners.
- **Playlist:** User-created collections referencing specific songs.

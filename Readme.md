# Video Platform

A YouTube-like video platform backend built with Node.js, Express, and MongoDB.
Users can register, upload videos, and interact with them.

> Status: backend is done. Frontend and multi-quality video upload are coming soon.

## Features

- User register and login with JWT authentication
- Upload videos and thumbnails (Multer + Cloudinary)
- Likes and comments
- Subscriptions
- Playlists
- Tweets (short community posts)
- Channel dashboard
- Rate limiting to stop too many requests
- Redis for caching

## Tech Stack

- Node.js, Express
- MongoDB (Mongoose)
- Redis
- Cloudinary (file storage)
- Multer (file upload)
- JWT (authentication)

## Folder Structure

```
src/
  controllers/   -> logic for each feature
  models/        -> database schemas
  routes/        -> API routes
  middlewares/   -> auth, multer, rate limiter
  utils/         -> ApiError, ApiResponse, asyncHandler
  db/            -> MongoDB and Redis connection
```

## How to Run

1. Clone the project

```
git clone https://github.com/at5200349-cyber/Video_platform.git
cd Video_platform
```

2. Install packages

```
npm install
```

3. Create a `.env` file in the main folder (see `.env.example`) and fill in your own values

4. Start the server

```
npm run dev
```

The server runs at `http://localhost:8000`.

## API Routes

Base URL: `http://localhost:8000/api/v1`

| Route | What it does |
|---|---|
| `/users` | register, login, profile |
| `/videos` | upload and get videos |
| `/like` | like or unlike |
| `/comments` | add and get comments |
| `/subcriptions` | subscribe to channels |
| `/playlists` | manage playlists |
| `/tweets` | manage tweets |
| `/dash` | channel dashboard |

## Coming Soon

- [ ] React frontend
- [ ] Multiple video qualities (360p, 720p, 1080p) with FFmpeg and a Redis queue
- [ ] Auto thumbnails
- [ ] Search and pagination
- [ ] Deployment

## Author

Made by [at5200349-cyber](https://github.com/at5200349-cyber)

# GT-Cal Backend Setup Guide

This guide explains how to set up and use the backend API for GT-Cal.

## Architecture Overview

GT-Cal now has a **full-stack architecture**:
- **Frontend**: React app with optimistic UI updates (works offline with mock data)
- **Backend**: Express.js + MongoDB for data persistence
- **API**: RESTful endpoints for events and discussions

## Features

### ✅ What's Implemented

1. **Event Management**
   - Create, read, update, delete events
   - Track likes, attendees, and comments
   - Store `createdBy` field to identify event creators

2. **Discussion Board**
   - Create discussions for any event
   - Add replies to discussions
   - Nested comment structure with user info

3. **User Interactions**
   - Like/unlike events
   - Attend/unattend events
   - Comment on events
   - Post discussions and replies

## Backend Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Install backend dependencies**:
```bash
cd backend
npm install
```

2. **Configure MongoDB**:

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/gt-cal
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/gt-cal

PORT=5000
```

3. **Start the backend server**:
```bash
cd backend
npm start
```

You should see:
```
✅ Server listening at http://localhost:5000
✅ MongoDB connected
```

### Testing the Backend

Test the API is running:
```bash
curl http://localhost:5000/
# Should return: "Backend is running 🚀"
```

## API Endpoints

### Events API (`/api/events`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/events` | Get all events | - |
| POST | `/api/events` | Create new event | Event object (see below) |
| PUT | `/api/events/:id` | Update event | Updated fields |
| DELETE | `/api/events/:id` | Delete event | - |
| POST | `/api/events/:id/like` | Toggle like | `{ userId: string }` |
| POST | `/api/events/:id/attend` | Toggle attendance | `{ userId: string }` |
| POST | `/api/events/:id/comment` | Increment comment count | - |

**Event Object Structure**:
```json
{
  "title": "HackGT 2024",
  "date": "2024-12-15",
  "time": "9:00 AM EST",
  "location": "Klaus Advanced Computing Building",
  "category": "Tech",
  "description": "Georgia Tech's premier hackathon",
  "organizer": "HackGT Team",
  "image": "https://example.com/image.jpg",
  "createdBy": "user123",
  "likes": 0,
  "likedBy": [],
  "comments": 0,
  "attendees": 0,
  "attendingUsers": []
}
```

### Discussions API (`/api/discussions`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/discussions/event/:eventId` | Get discussions for event | - |
| POST | `/api/discussions/event/:eventId` | Create discussion | Discussion object |
| POST | `/api/discussions/:discussionId/replies` | Add reply | Reply object |

**Discussion Object Structure**:
```json
{
  "id": 1234567890,
  "user": {
    "name": "Georgia Tech Student",
    "initials": "GT"
  },
  "content": "Is this event open to all students?",
  "timestamp": "2024-12-01T10:00:00Z",
  "replies": []
}
```

**Reply Object Structure**:
```json
{
  "id": 1234567891,
  "user": {
    "name": "Event Organizer",
    "initials": "EO"
  },
  "content": "Yes, it's open to everyone!",
  "timestamp": "2024-12-01T10:30:00Z"
}
```

## Frontend Integration

The frontend is already wired up to use the backend API with **optimistic updates**:

### How It Works

1. **Optimistic Updates**: UI updates immediately for instant feedback
2. **Background Sync**: Changes are saved to backend in the background
3. **Graceful Degradation**: If backend is unavailable, app continues working with local state

### Example: Creating an Event

```javascript
// User clicks "Publish" on event form
// ✅ Event appears in UI immediately (optimistic update)
// ⏳ Backend save happens in background
// ✅ If successful, event gets real MongoDB ID
// ⚠️ If failed, event stays in local state (still visible to user)
```

### Example: Liking an Event

```javascript
// User clicks "Like" button
// ✅ Like count increments immediately (optimistic update)
// ⏳ Backend sync happens in background
// ✅ Server response updates state with authoritative data
// ⚠️ If failed, optimistic update remains (user doesn't see error)
```

## Development Modes

### Mode 1: Backend Available (Full Stack)
- **Setup**: Backend running on `localhost:5000`
- **Features**: All data persists to MongoDB
- **Behavior**: Events and discussions saved permanently

### Mode 2: Frontend Only (Offline Development)
- **Setup**: Backend not running
- **Features**: Mock data + local React state
- **Behavior**: Data resets on page refresh (perfect for testing UI)

The app automatically detects which mode it's in and adapts!

## Database Schema

### Event Schema
```javascript
{
  title: String (required),
  date: Date (required),
  time: String,
  location: String,
  category: String,
  description: String,
  organizer: String,
  image: String,
  createdBy: String (required), // User ID
  likes: Number (default: 0),
  likedBy: [String], // Array of user IDs
  comments: Number (default: 0),
  attendees: Number (default: 0),
  attendingUsers: [String], // Array of user IDs
  createdAt: Date (auto)
}
```

### Discussion Schema
```javascript
{
  eventId: String (required),
  id: Number (required),
  user: {
    name: String (required),
    initials: String (required)
  },
  content: String (required),
  timestamp: String (required),
  replies: [{
    id: Number,
    user: { name, initials },
    content: String,
    timestamp: String
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Troubleshooting

### Backend won't start
- **Check MongoDB**: Is MongoDB running? `mongod` or check MongoDB Atlas connection
- **Check port**: Is port 5000 already in use? Change `PORT` in `.env`
- **Check .env**: Does `.env` file exist with valid `MONGO_URI`?

### Frontend can't connect to backend
- **CORS issues**: Backend has CORS enabled, but check browser console
- **Wrong URL**: Frontend expects `http://localhost:5000`
- **Backend not running**: Check backend terminal for errors

### Data not persisting
- **MongoDB not connected**: Check backend terminal for "✅ MongoDB connected"
- **API errors**: Check backend logs for error messages
- **Frontend fallback**: Frontend might be using local state only

## Next Steps

### Production Deployment

For production, you'll want to:

1. **Deploy Backend**: Heroku, AWS, DigitalOcean, etc.
2. **Deploy MongoDB**: MongoDB Atlas (free tier available)
3. **Update Frontend**: Change API URL from `localhost:5000` to production URL
4. **Add Authentication**: Implement real user accounts (currently uses mock `user123`)
5. **Add Authorization**: Verify users can only edit/delete their own events
6. **Environment Variables**: Use environment variables for API URLs

### Example Production Config

```javascript
// frontend/src/config.js
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.gtcal.com'
  : 'http://localhost:5000';

export default API_URL;
```

## Support

Questions? Issues? Check the main README.md or open an issue on GitHub!

---

**Happy Coding! 🐝💛**


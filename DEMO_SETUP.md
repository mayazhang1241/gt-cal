# GT-Cal Demo Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Quick Start for Demo

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd gt-cal
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with:
MONGODB_URI=<your-mongodb-connection-string>
PORT=5000

npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Open Browser
Navigate to `http://localhost:5173` and start using GT-Cal!

## Notes
- Make sure MongoDB is running (if using MongoDB Atlas, ensure your connection string is correct)
- Both backend and frontend must be running simultaneously
- Sample events and discussions will appear automatically
- Create events, RSVP, like, and discuss!

## Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure port 5000 is not being used by another application

### Frontend won't start
- Check if port 5173 is available
- Make sure backend is running first
- Verify `axios` requests point to `http://localhost:5000`

### Sample events not showing
- Sample events are hardcoded in the frontend and should appear immediately
- Check browser console for any errors


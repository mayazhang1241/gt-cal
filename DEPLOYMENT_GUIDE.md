# GT-Cal Deployment Guide

## Option 1: Quick Local Demo (Recommended for Live Demo)

Perfect for demoing on another computer. See [DEMO_SETUP.md](./DEMO_SETUP.md)

---

## Option 2: Cloud Deployment (Recommended for Online Access)

Deploy your app to the cloud so anyone can access it via URL.

### Step 1: Prepare Your Code

1. **Ensure your MongoDB is set up**
   - Use MongoDB Atlas (free tier available)
   - Get your connection string
   - Whitelist all IPs (0.0.0.0/0) for demo purposes

2. **Check your backend environment variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

### Step 2: Deploy Backend (Render.com - Free)

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: gt-cal-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: your MongoDB connection string
   - `PORT`: 5000
6. Deploy!

**Save your backend URL**: `https://gt-cal-backend.onrender.com`

### Step 3: Update Frontend API URLs

In `frontend/src/App.jsx`, replace all `http://localhost:5000` with your backend URL:

```javascript
// Find and replace all instances:
// FROM: http://localhost:5000/api/events
// TO: https://gt-cal-backend.onrender.com/api/events
```

### Step 4: Deploy Frontend (Vercel - Free)

1. Create account at [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
5. Deploy!

**Your app is live!** 🎉

---

## Option 3: All-in-One Deployment (Railway.app)

1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB plugin (or use your MongoDB Atlas)
4. Deploy backend:
   - Add service from GitHub repo
   - Set root directory to `backend`
   - Railway will auto-detect and deploy
5. Deploy frontend:
   - Add another service from same repo
   - Set root directory to `frontend`
   - Update API URLs to point to your backend service
6. Done!

---

## Environment Variables Checklist

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gtcal
PORT=5000
```

### Frontend
Update all API endpoints in `App.jsx`:
- Event routes: `/api/events`
- Discussion routes: `/api/discussions`

---

## Pre-Demo Checklist

- [ ] Backend is running and accessible
- [ ] Frontend is running and accessible
- [ ] MongoDB connection is working
- [ ] Sample events load correctly
- [ ] Can create new events
- [ ] Can RSVP to events
- [ ] Can like events
- [ ] Can post discussions
- [ ] Filters work (Category, Location, Organization)
- [ ] Calendar navigation works
- [ ] List view shows events chronologically
- [ ] My Events page shows correct tabs

---

## Quick Tips

1. **For a local demo**: Just push to GitHub, clone on the demo computer, and run both servers
2. **For a remote demo**: Deploy to cloud and share the URL
3. **Test everything**: Create an event, RSVP, like it, add a discussion
4. **Have MongoDB ready**: Make sure your database is accessible
5. **Check browser console**: If something doesn't work, check for errors

---

## Common Issues

### CORS Errors
If you get CORS errors after deployment, add this to your backend `server.js`:

```javascript
app.use(cors({
  origin: 'your-frontend-url',
  credentials: true
}));
```

### API Connection Failed
- Verify backend URL is correct in frontend
- Check if backend is running
- Verify MongoDB connection

### Build Errors
- Run `npm install` in both directories
- Check Node.js version (v16+)
- Clear `node_modules` and reinstall if needed

---

## Support

For MongoDB Atlas setup: https://www.mongodb.com/cloud/atlas
For Render deployment: https://render.com/docs
For Vercel deployment: https://vercel.com/docs


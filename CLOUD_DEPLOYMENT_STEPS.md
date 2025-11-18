# GT-Cal Cloud Deployment Guide (Render + Vercel)

## ✅ What We Just Set Up

Your frontend now uses **environment variables** via `config.js`:
- **Local development**: Uses `http://localhost:5000` (default)
- **Production**: Will use your Render backend URL

All 9 API calls have been updated to use `API_BASE_URL` from config.

---

## Step 1: Commit Your Changes 📝

```bash
cd /Users/mayazhang/gt-cal
git add .
git commit -m "Prepare for cloud deployment - add environment variables"
git push origin main
```

---

## Step 2: Deploy Backend to Render 🚀

### 2.1: Sign Up & Create Service
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Click "New +" → "Web Service"
5. Connect your GitHub account and select `gt-cal` repository

### 2.2: Configure Web Service
Fill in these settings:

**Basic Settings:**
- **Name**: `gt-cal-backend` (or any name you prefer)
- **Region**: Select closest to you (e.g., Ohio or Oregon)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select "Free" (perfect for demos!)

### 2.3: Add Environment Variables
Scroll down to "Environment Variables" section:

Click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB connection string from Atlas |
| `PORT` | `5000` |

⚠️ **Important**: Make sure your MongoDB connection string is correct!
Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gtcal?retryWrites=true&w=majority`

### 2.4: Deploy!
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once done, you'll see: ✅ "Your service is live!"

### 2.5: Save Your Backend URL
Copy your backend URL (looks like):
```
https://gt-cal-backend.onrender.com
```

**Test it**: Open `https://gt-cal-backend.onrender.com` in browser
You should see: "Backend is running 🚀"

---

## Step 3: Update Frontend Config 🔧

Now that you have your backend URL, update the frontend:

1. Open `frontend/src/config.js`
2. Replace line 4 with your Render URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://gt-cal-backend.onrender.com';
```

**Replace `gt-cal-backend.onrender.com` with YOUR actual Render URL!**

3. Save the file

---

## Step 4: Test Locally with Production Backend 🧪

Before deploying frontend, test if it connects to your cloud backend:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` and:
- ✅ Check if sample events load
- ✅ Try creating an event
- ✅ Try liking and RSVPing
- ✅ Check browser console for errors (F12)

If everything works, you're ready for frontend deployment!

---

## Step 5: Deploy Frontend to Vercel ⚡

### 5.1: Sign Up & Import Project
1. Go to https://vercel.com
2. Click "Start Deploying"
3. Sign up with GitHub
4. Click "Add New..." → "Project"
5. Import your `gt-cal` repository

### 5.2: Configure Project
**Framework Preset**: Vite
**Root Directory**: `frontend`

**Build Settings** (Vercel usually detects these automatically):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5.3: Environment Variables (Optional)
If you want to explicitly set the API URL:

Click "Environment Variables" and add:
- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://gt-cal-backend.onrender.com` (your Render URL)

**Note**: If you updated `config.js` with the hardcoded URL in Step 3, you don't need this.

### 5.4: Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see: 🎉 "Congratulations!"

### 5.5: Get Your Live URL
Vercel will give you a URL like:
```
https://gt-cal-xxxxx.vercel.app
```

**Your app is now LIVE!** 🎉

---

## Step 6: Update Backend CORS (Security) 🔒

Now update your backend to only allow requests from your Vercel frontend:

1. Go back to Render dashboard
2. Open your `gt-cal-backend` service
3. Click "Environment" tab
4. Add a new environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://gt-cal-xxxxx.vercel.app` (your Vercel URL) |

5. Update `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

6. Commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy!

---

## 🎯 Final Testing Checklist

Open your Vercel URL and test:

- [ ] Sample events load on calendar
- [ ] Can create new events
- [ ] Can RSVP to events
- [ ] Can like events (heart turns red)
- [ ] Can view discussions
- [ ] Can add discussions and replies
- [ ] Filters work (category, location, organization)
- [ ] My Events page works
- [ ] List view shows events chronologically

---

## 🔧 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs (Click "Logs" tab in Render dashboard)
- Verify MONGO_URI is correct
- Make sure MongoDB Atlas allows connections from anywhere (IP 0.0.0.0/0)

**"Cannot connect to MongoDB"**
- Go to MongoDB Atlas
- Network Access → Add IP Address → Allow Access from Anywhere
- Check connection string is correct (including password)

### Frontend Issues

**"Network Error" or events don't load**
- Check browser console (F12) for errors
- Verify `config.js` has correct Render URL
- Test backend URL directly in browser
- Check Render backend is running (not sleeping)

**CORS errors**
- Update backend CORS settings
- Add your Vercel URL to allowed origins
- Redeploy backend

### Free Tier Limitations

⚠️ **Render Free Tier**: Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Solution: Use paid tier ($7/month) or deploy to another platform

---

## 📱 Share Your App

Your live URLs:
- **Frontend**: `https://gt-cal-xxxxx.vercel.app`
- **Backend**: `https://gt-cal-backend.onrender.com`

Share the frontend URL with anyone!

---

## 🚀 Next Steps

- [ ] Add custom domain (optional)
- [ ] Set up environment-specific configs
- [ ] Add error monitoring (Sentry)
- [ ] Set up CI/CD pipelines
- [ ] Add analytics

---

## Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com

Good luck with your deployment! 🐝💛


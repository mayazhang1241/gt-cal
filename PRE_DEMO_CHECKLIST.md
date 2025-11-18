# Pre-Demo Checklist for GT-Cal

## Before You Demo

### 1. Code Preparation ✅

- [ ] All changes are committed to Git
- [ ] Push to GitHub/GitLab
- [ ] `.env` file is NOT committed (check .gitignore)
- [ ] Fonts are in `/frontend/public/fonts/`

### 2. Backend Setup ✅

- [ ] MongoDB Atlas is set up (or local MongoDB is running)
- [ ] MongoDB connection string is ready
- [ ] Backend `.env` file created with:
  ```
  MONGODB_URI=your_connection_string
  PORT=5000
  ```
- [ ] Run `cd backend && npm install`
- [ ] Test backend: `npm start` (should see "Server running on port 5000")
- [ ] Test API endpoint: Open `http://localhost:5000/api/events` (should return JSON)

### 3. Frontend Setup ✅

- [ ] Custom fonts are loaded (Rubik-Regular.ttf, Rubik-Medium.ttf)
- [ ] Run `cd frontend && npm install`
- [ ] Test frontend: `npm run dev` (should open on localhost:5173)
- [ ] Check console for errors (F12 in browser)

### 4. Feature Testing ✅

**Calendar View:**
- [ ] 6 sample events appear on calendar
- [ ] Can navigate between months
- [ ] Today's date is highlighted with gold glow
- [ ] Clicking an event opens event details
- [ ] "See More" button works when multiple events in one day
- [ ] Filters work (Category, Location, Organization)

**List View:**
- [ ] All 6 sample events appear
- [ ] Events are in chronological order
- [ ] Time ranges show correctly (e.g., "6:30 PM - 7:30 PM")
- [ ] Events without end time don't show duration
- [ ] Filters work

**My Events:**
- [ ] "My Created Events" tab is empty initially
- [ ] "My Attending Events" tab is empty initially
- [ ] Container scrolls if many events

**Event Creation:**
- [ ] Click on any date to create event
- [ ] Time picker uses 12-hour format with AM/PM
- [ ] Start time and end time on same line
- [ ] Can create events with or without end time
- [ ] Can create events with or without organizer
- [ ] Newly created events appear in Calendar, List, and My Events

**Event Details Modal:**
- [ ] Heart icon appears next to close button
- [ ] Heart is hollow when not liked, red when liked
- [ ] Heart updates instantly when clicked
- [ ] Like count updates in real-time
- [ ] For sample events: Only RSVP button shows
- [ ] For your events: Edit, RSVP, and Delete buttons show
- [ ] RSVP shows confirmation toast message
- [ ] RSVP adds event to "My Attending Events"

**Discussion Board:**
- [ ] Sample discussions appear for each event
- [ ] Can add new discussions
- [ ] Can reply to discussions
- [ ] Comment count updates when discussions/replies added

**Styling:**
- [ ] Custom Rubik font is applied throughout
- [ ] Headers are bold (weight 500)
- [ ] Body text is regular (weight 400)
- [ ] GT colors (navy and gold) are prominent
- [ ] No box outline around heart when clicked

### 5. Demo Machine Setup

If demoing on another computer:

- [ ] Computer has Node.js installed (v16+)
- [ ] Computer has Git installed
- [ ] MongoDB connection string works from that location
- [ ] Port 5000 and 5173 are available

### 6. Demo Script

**Opening:**
1. Show landing page
2. Click "Explore Calendar"

**Main Features:**
1. **Calendar**: Navigate through months, show current events
2. **Filtering**: Demonstrate category/location filters
3. **Event Creation**: Create a new event (e.g., "Study Group")
4. **Event Details**: Open an event, show Discussion, RSVP
5. **Liking**: Click heart to like an event
6. **RSVP**: RSVP to an event, show it appears in My Events
7. **List View**: Show all events chronologically
8. **My Events**: Show created and attending tabs

### 7. Quick Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Check if port 5000 is free: `lsof -i :5000` (Mac/Linux)

**Frontend won't connect:**
- Ensure backend is running first
- Check browser console (F12) for errors
- Verify API URLs point to `http://localhost:5000`

**Sample events don't show:**
- Check browser console for JavaScript errors
- Refresh the page (Cmd+Shift+R or Ctrl+Shift+R)

**Discussions don't show:**
- They should appear automatically with sample events
- Check browser console for errors

---

## Demo Day Commands

### Terminal 1 (Backend):
```bash
cd gt-cal/backend
npm start
```

### Terminal 2 (Frontend):
```bash
cd gt-cal/frontend
npm run dev
```

### Browser:
Open `http://localhost:5173`

---

## Emergency Reset

If something goes wrong:

1. Stop both servers (Ctrl+C)
2. Clear browser cache (Cmd+Shift+Delete)
3. Restart backend first, then frontend
4. Hard refresh browser (Cmd+Shift+R)

---

## Post-Demo

- [ ] Thank the audience
- [ ] Share the GitHub repository link
- [ ] Share deployment URL (if deployed to cloud)
- [ ] Collect feedback

Good luck with your demo! 🐝💛


import express from "express";
import Event from "../models/Event.js";
import Discussion from "../models/Discussion.js";

const router = express.Router();

// POST: create a new event
router.post("/", async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: create a new discussion message for a specific event
router.post("/:id/discussions", async (req, res) => {
  try {
    const { id } = req.params;
    const { user, message } = req.body;
    
    // Verify the event exists first
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Validate required fields
    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }
    
    // Create a new discussion
    const discussion = new Discussion({
      eventId: id,
      user,
      message,
    });
    
    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: fetch all discussions for a specific event
router.get("/:id/discussions", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify the event exists first
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Fetch all discussions for this event
    const discussions = await Discussion.find({ eventId: id })
      .sort({ createdAt: 1 }); // Sort by creation time (oldest first)
    
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;   // ✅ this line is critical

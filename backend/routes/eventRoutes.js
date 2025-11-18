import express from "express";
import Event from "../models/Event.js";

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

// PUT: update an existing event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: delete an event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: toggle like on an event
router.post("/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const userIndex = event.likedBy.indexOf(userId);
    if (userIndex === -1) {
      // User hasn't liked yet, add like
      event.likedBy.push(userId);
      event.likes = event.likedBy.length;
    } else {
      // User already liked, remove like
      event.likedBy.splice(userIndex, 1);
      event.likes = event.likedBy.length;
    }
    
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: toggle attendance on an event
router.post("/:id/attend", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    const userIndex = event.attendingUsers.indexOf(userId);
    if (userIndex === -1) {
      // User not attending yet, add
      event.attendingUsers.push(userId);
      event.attendees = event.attendingUsers.length;
    } else {
      // User already attending, remove
      event.attendingUsers.splice(userIndex, 1);
      event.attendees = event.attendingUsers.length;
    }
    
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: increment comment count on an event
router.post("/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    event.comments += 1;
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;   // ✅ this line is critical

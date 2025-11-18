import express from "express";
import Discussion from "../models/Discussion.js";

const router = express.Router();

// GET: Get all discussions for a specific event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const discussions = await Discussion.find({ eventId }).sort({ createdAt: 1 });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Create a new discussion for an event
router.post("/event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { user, content, timestamp, id } = req.body;
    
    if (!user || !content || !timestamp || !id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const discussion = new Discussion({
      eventId,
      id,
      user,
      content,
      timestamp,
      replies: []
    });
    
    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST: Add a reply to a discussion
router.post("/:discussionId/replies", async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { user, content, timestamp, id } = req.body;
    
    if (!user || !content || !timestamp || !id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const discussion = await Discussion.findOne({ id: parseInt(discussionId) });
    
    if (!discussion) {
      return res.status(404).json({ error: "Discussion not found" });
    }
    
    discussion.replies.push({
      id,
      user,
      content,
      timestamp
    });
    
    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

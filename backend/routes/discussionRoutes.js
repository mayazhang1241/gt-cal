import express from "express";
import Discussion from "../models/Discussion.js";

const router = express.Router();

// POST: create a new discussion under an event
router.post("/", async (req, res) => {
  try {
    const discussion = new Discussion(req.body);
    await discussion.save();
    res.status(201).json(discussion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: fetch all discussions (optional)
router.get("/", async (req, res) => {
  try {
    const discussions = await Discussion.find().populate("eventId");
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: fetch discussions for a specific event
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const discussions = await Discussion.find({ eventId });
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

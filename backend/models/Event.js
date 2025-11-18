import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  endTime: { type: String },
  location: { type: String },
  category: { type: String },
  description: { type: String },
  organizer: { type: String },
  image: { type: String },
  createdBy: { type: String, required: true }, // User ID who created the event
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }], // Array of user IDs who liked
  comments: { type: Number, default: 0 },
  attendees: { type: Number, default: 0 },
  attendingUsers: [{ type: String }], // Array of user IDs attending
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;  // ✅ this is critical

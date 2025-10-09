import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String },
  category: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);
export default Event;  // ✅ this is critical

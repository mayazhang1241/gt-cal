import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  user: {
    name: { type: String, required: true },
    initials: { type: String, required: true }
  },
  content: { type: String, required: true },
  timestamp: { type: String, required: true }
}, { _id: false });

const discussionSchema = new mongoose.Schema(
  {
    eventId: {
      type: String, // Store as string to match frontend event IDs
      required: true,
    },
    id: { type: Number, required: true }, // Numeric ID for frontend
    user: {
      name: { type: String, required: true },
      initials: { type: String, required: true }
    },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    replies: [replySchema]
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;

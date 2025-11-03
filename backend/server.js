import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import eventRoutes from "./routes/eventRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";

dotenv.config();
console.log("MONGO_URI loaded:", process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("✅ Root route was hit");
  res.send("Backend is running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/events", eventRoutes);
app.use("/api/discussions", discussionRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening at http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Server failed to start:", err);
});



import mongoose from "mongoose";
import { MONGODB_URI } from "../env";

// Prevent multiple connections
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI);
}

export const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ Mongoose connected to", MONGODB_URI);
});

db.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

db.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

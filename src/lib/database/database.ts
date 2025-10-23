import mongoose from "mongoose";
import { MONGODB_URI } from "../env";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      dbName: "data",
    });
    isConnected = true;
  }

  return mongoose.connection;
}

export const db = mongoose.connection;

db.on("connected", () => {
  console.log("✅ Mongoose connected to", MONGODB_URI);
  isConnected = true;
});

db.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
  isConnected = false;
});

db.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
  isConnected = false;
});

import mongoose from "mongoose";
import { ENV } from "./env";

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error("[MongoDB] Connection error:", error instanceof Error ? error.message : error);
    console.warn("[MongoDB] Please verify that your MongoDB service is running or check your MONGODB_URI in backend/.env");
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Lost connection to MongoDB.");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Reconnected to MongoDB.");
});

import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes";

const router = Router();

// Health check endpoint
router.get("/health", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    success: true,
    message: "MediCore HMS API is running",
    database: dbStatusMap[dbState] || "unknown",
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
router.use("/auth", authRoutes);

export default router;

import { Router } from "express";
import { isDbConnected, getDb } from "../config/db";
import authRoutes from "./auth.routes";
import doctorRoutes from "./doctor.routes";

const router = Router();

// Health check endpoint
router.get("/health", async (_req, res) => {
  let dbStatus = "disconnected";

  if (isDbConnected()) {
    try {
      await getDb().command({ ping: 1 });
      dbStatus = "connected";
    } catch {
      dbStatus = "error";
    }
  }

  res.status(200).json({
    success: true,
    message: "MediCore HMS API is running (Native MongoDB)",
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes
router.use("/auth", authRoutes);

// Doctor management routes
router.use("/doctors", doctorRoutes);

export default router;

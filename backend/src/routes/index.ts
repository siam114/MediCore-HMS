import { Router } from "express";
import { isDbConnected, getDb } from "../config/db";
import authRoutes from "./auth.routes";
import doctorRoutes from "./doctor.routes";
import appointmentRoutes from "./appointment.routes";
import prescriptionRoutes from "./prescription.routes";
import labReportRoutes from "./labReport.routes";
import billingRoutes from "./billing.routes";

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

// Appointment & Serial booking routes
router.use("/appointments", appointmentRoutes);

// Doctor Consultation & Digital Prescription routes
router.use("/prescriptions", prescriptionRoutes);

// Diagnostic & Laboratory Test Report routes
router.use("/lab-reports", labReportRoutes);

// Hospital Billing & Invoicing routes
router.use("/billing", billingRoutes);

export default router;

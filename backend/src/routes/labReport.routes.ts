import { Router } from "express";
import { LabReportController } from "../controllers/labReport.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createLabReportSchema,
  updateLabReportStatusSchema,
} from "../validations/labReport.validation";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

// Create new diagnostic report (Staff, Doctor, Admin)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.STAFF, USER_ROLES.DOCTOR, USER_ROLES.ADMIN),
  validate(createLabReportSchema),
  LabReportController.createReport
);

// Get diagnostic reports for logged-in patient (or by phone query)
router.get("/my", optionalAuthenticate, LabReportController.getMyReports);

// Get diagnostic reports for a specific doctor
router.get(
  "/doctor/:doctorId",
  authenticate,
  authorize(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.STAFF),
  LabReportController.getDoctorReports
);

// Get single report by ID (patient, doctor, staff)
router.get("/:id", optionalAuthenticate, LabReportController.getById);

// Hospital diagnostic registry - Admin & Staff
router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF, USER_ROLES.DOCTOR),
  LabReportController.getAllReports
);

// Update report status (e.g. COMPLETED -> DELIVERED)
router.patch(
  "/:id/status",
  authenticate,
  authorize(USER_ROLES.STAFF, USER_ROLES.ADMIN),
  validate(updateLabReportStatusSchema),
  LabReportController.updateStatus
);

// Delete report (Admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  LabReportController.deleteReport
);

export default router;

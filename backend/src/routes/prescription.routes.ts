import { Router } from "express";
import { PrescriptionController } from "../controllers/prescription.controller";
import { validate } from "../middlewares/validate.middleware";
import { createPrescriptionSchema } from "../validations/prescription.validation";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

// Create new official prescription (Doctors or Admin)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.DOCTOR, USER_ROLES.ADMIN),
  validate(createPrescriptionSchema),
  PrescriptionController.createPrescription
);

// Get prescriptions for logged in patient (or phone query for guest patients)
router.get("/my", optionalAuthenticate, PrescriptionController.getMyPatientPrescriptions);

// Doctor routes - Doctor views all prescriptions written by them
router.get(
  "/doctor/:doctorId",
  authenticate,
  authorize(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.STAFF),
  PrescriptionController.getDoctorPrescriptions
);

// Get single prescription details by ID (for view or print)
router.get("/:id", optionalAuthenticate, PrescriptionController.getById);

// Hospital registry - Admin & Staff view all prescriptions
router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF),
  PrescriptionController.getAllPrescriptions
);

export default router;

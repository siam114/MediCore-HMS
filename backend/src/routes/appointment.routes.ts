import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
} from "../validations/appointment.validation";
import { authenticate, authorize, optionalAuthenticate } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

// Patient routes - Booking serial requires authenticated patient account
router.post(
  "/",
  authenticate,
  validate(createAppointmentSchema),
  AppointmentController.createAppointment
);

// Get my booked appointments (by auth token or by phone number query)
router.get("/my", optionalAuthenticate, AppointmentController.getMyPatientAppointments);

// Doctor routes - Doctor views appointments assigned to them
router.get(
  "/doctor/:doctorId",
  authenticate,
  authorize(USER_ROLES.DOCTOR, USER_ROLES.ADMIN, USER_ROLES.STAFF),
  AppointmentController.getDoctorAppointments
);

// Admin & Staff routes - View all hospital appointments with filters
router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.STAFF),
  AppointmentController.getAllAppointments
);

// Update status (e.g. COMPLETED, CANCELLED) or payment
router.patch(
  "/:id/status",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.DOCTOR, USER_ROLES.STAFF),
  validate(updateAppointmentStatusSchema),
  AppointmentController.updateStatus
);

export default router;

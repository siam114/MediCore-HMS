import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller";
import { validate } from "../middlewares/validate.middleware";
import { createDoctorSchema, updateDoctorSchema } from "../validations/doctor.validation";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

// Public routes (patients and public can view doctors and departments)
router.get("/", DoctorController.getAllDoctors);
router.get("/departments", DoctorController.getDepartments);
router.get("/:id", DoctorController.getDoctorById);

// Protected routes (Only ADMIN can add or delete doctor profiles)
router.post(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  validate(createDoctorSchema),
  DoctorController.createDoctor
);

router.put(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.DOCTOR),
  validate(updateDoctorSchema),
  DoctorController.updateDoctor
);

router.delete(
  "/:id",
  authenticate,
  authorize(USER_ROLES.ADMIN),
  DoctorController.deleteDoctor
);

export default router;

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { USER_ROLES } from "../constants/roles";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/google", AuthController.googleAuth);
router.get("/me", authenticate, AuthController.getMe);
router.get("/users", authenticate, authorize(USER_ROLES.ADMIN), AuthController.getAllUsers);
router.post("/logout", AuthController.logout);

export default router;

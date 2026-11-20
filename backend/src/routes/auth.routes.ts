import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validations/auth.validation";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/google", AuthController.googleAuth);
router.get("/me", authenticate, AuthController.getMe);
router.post("/logout", AuthController.logout);

export default router;

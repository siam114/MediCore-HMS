import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types";

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const user = await AuthService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }

  public static async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, avatar, googleId } = req.body;
      if (!email || !name) {
        res.status(400).json({
          success: false,
          message: "Name and email are required for Google authentication",
        });
        return;
      }

      const result = await AuthService.googleAuth({ name, email, avatar, googleId });
      res.status(200).json({
        success: true,
        message: "Google authentication successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

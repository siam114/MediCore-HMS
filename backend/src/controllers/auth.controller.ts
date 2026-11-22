import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../types";
import { getUsersCollection, toSafeUser } from "../models/user.model";

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

  public static async getAllUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = getUsersCollection();
      const allDocs = await users.find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json({
        success: true,
        data: {
          users: allDocs.map((doc) => toSafeUser(doc)),
          total: allDocs.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { role } = req.body;
      const validRoles = ["ADMIN", "DOCTOR", "STAFF", "PATIENT"];
      if (!validRoles.includes(role)) {
        res.status(400).json({
          success: false,
          message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
        });
        return;
      }

      if (!ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid User ID format" });
        return;
      }

      const users = getUsersCollection();
      const updatedUser = await users.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { role, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: `User role successfully updated to ${role}`,
        data: { user: toSafeUser(updatedUser) },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Invalid User ID format" });
        return;
      }

      const users = getUsersCollection();
      const result = await users.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

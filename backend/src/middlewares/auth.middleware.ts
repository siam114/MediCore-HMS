import { Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { AuthenticatedRequest } from "../types";
import { verifyToken } from "../utils/jwt.utils";
import { getUsersCollection } from "../models/user.model";
import { UserRole } from "../constants/roles";

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let token: string | undefined;

    // Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded || !ObjectId.isValid(decoded.userId)) {
      res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please log in again.",
      });
      return;
    }

    const users = getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists.",
      });
      return;
    }

    if (user.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Account is inactive or suspended. Please contact administrator.",
      });
      return;
    }

    req.user = {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      status: user.status,
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-Based Access Control (RBAC) middleware
 * e.g. authorize(USER_ROLES.ADMIN, USER_ROLES.DOCTOR)
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please authenticate first.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Access restricted to: [${allowedRoles.join(", ")}]. Your role is ${req.user.role}.`,
      });
      return;
    }

    next();
  };
}

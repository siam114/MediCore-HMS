import { ObjectId } from "mongodb";
import {
  getUsersCollection,
  hashPassword,
  comparePassword,
  toSafeUser,
  UserDocument,
} from "../models/user.model";
import { RegisterInput, LoginInput } from "../validations/auth.validation";
import { signToken } from "../utils/jwt.utils";
import { USER_ROLES } from "../constants/roles";

export class AuthService {
  public static async register(input: RegisterInput) {
    const users = getUsersCollection();
    const normalizedEmail = input.email.toLowerCase().trim();

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      const error: any = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(input.password);
    const now = new Date();

    const newDoc: UserDocument = {
      name: input.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: input.role || USER_ROLES.PATIENT,
      phone: input.phone?.trim(),
      avatar: "",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    const result = await users.insertOne(newDoc);
    newDoc._id = result.insertedId;

    const safeUser = toSafeUser(newDoc);

    const token = signToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });

    return {
      user: safeUser,
      token,
    };
  }

  public static async login(input: LoginInput) {
    const users = getUsersCollection();
    const normalizedEmail = input.email.toLowerCase().trim();

    const user = await users.findOne({ email: normalizedEmail });
    if (!user || !user.password) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await comparePassword(input.password, user.password);
    if (!isMatch) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (user.status !== "ACTIVE") {
      const error: any = new Error("Your account is inactive or suspended");
      error.statusCode = 403;
      throw error;
    }

    const safeUser = toSafeUser(user);

    const token = signToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });

    return {
      user: safeUser,
      token,
    };
  }

  public static async getProfile(userId: string) {
    if (!ObjectId.isValid(userId)) {
      const error: any = new Error("Invalid user ID");
      error.statusCode = 400;
      throw error;
    }

    const users = getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return toSafeUser(user);
  }
}

import { User, IUser } from "../models/user.model";
import { RegisterInput, LoginInput } from "../validations/auth.validation";
import { signToken } from "../utils/jwt.utils";
import { USER_ROLES } from "../constants/roles";

export class AuthService {
  public static async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      const error: any = new Error("An account with this email already exists");
      error.statusCode = 409;
      throw error;
    }

    const newUser = new User({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      role: input.role || USER_ROLES.PATIENT,
      phone: input.phone,
    });

    await newUser.save();

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        status: newUser.status,
      },
      token,
    };
  }

  public static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select("+password");
    if (!user) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (user.status !== "ACTIVE") {
      const error: any = new Error("Your account is inactive or suspended");
      error.statusCode = 403;
      throw error;
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
      },
      token,
    };
  }

  public static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}

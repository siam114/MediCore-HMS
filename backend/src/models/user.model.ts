import { ObjectId, Collection } from "mongodb";
import bcrypt from "bcryptjs";
import { UserRole, USER_ROLES } from "../constants/roles";
import { getCollection } from "../config/db";

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function getUsersCollection(): Collection<UserDocument> {
  return getCollection<UserDocument>("users");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(candidatePassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, hash);
}

export function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id ? user._id.toString() : "",
    name: user.name,
    email: user.email,
    role: user.role || USER_ROLES.PATIENT,
    phone: user.phone,
    avatar: user.avatar,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

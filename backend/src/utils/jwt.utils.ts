import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";
import { JWTPayload } from "../types";

export function signToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: ENV.JWT_EXPIRES_IN as any,
  };
  return jwt.sign(payload, ENV.JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

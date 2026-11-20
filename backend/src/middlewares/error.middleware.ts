import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  console.error(`[Error] ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(ENV.NODE_ENV === "development" && { stack: err.stack }),
  });
}

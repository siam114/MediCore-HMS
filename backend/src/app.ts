import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { ENV } from "./config/env";
import apiRoutes from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

export function createApp(): Application {
  const app = express();

  // Logging middleware
  if (ENV.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Cross-Origin Resource Sharing (CORS)
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowedOrigins = [
          ENV.CLIENT_URL,
          "https://medi-core-taupe.vercel.app",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
        ];
        if (
          allowedOrigins.includes(origin) ||
          origin.endsWith(".vercel.app") ||
          origin.includes("localhost")
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body and cookie parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Mount API routes
  app.use("/api", apiRoutes);

  // 404 Not Found handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "The requested API route does not exist",
    });
  });

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

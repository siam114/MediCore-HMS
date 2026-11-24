import { createApp } from "./app";
import { connectDB, closeDB } from "./config/db";
import { ENV } from "./config/env";

async function bootstrap() {
  const app = createApp();
  const port = Number(process.env.PORT) || ENV.PORT || 5000;
  const host = "0.0.0.0";

  // 1. Start HTTP Server immediately on 0.0.0.0 so Render's port scanner detects it instantly
  const server = app.listen(port, host, () => {
    console.log("==================================================");
    console.log(`🏥 MediCore HMS Backend Server is running!`);
    console.log(`📡 Bound on host: ${host}, port: ${port}`);
    console.log(`🩺 Health check: http://${host}:${port}/api/health`);
    console.log(`🔐 Auth API: http://${host}:${port}/api/auth`);
    console.log(`🗄️ Database: Native MongoDB Driver (Atlas)`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    console.log("==================================================");
  });

  // 2. Connect to MongoDB Atlas (non-blocking for initial port binding)
  try {
    await connectDB();
  } catch (error) {
    console.error("[MongoDB] Initial connection error:", error instanceof Error ? error.message : error);
    console.warn("[MongoDB] Please verify that MONGODB_URI is correctly set in Render Environment Variables.");
  }

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log("\n[Server] Shutting down gracefully...");
    await closeDB();
    server.close(() => {
      console.log("[Server] Closed remaining connections.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((error) => {
  console.error("[Fatal Error] Failed to start server:", error);
  process.exit(1);
});

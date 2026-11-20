import { createApp } from "./app";
import { connectDB, closeDB } from "./config/db";
import { ENV } from "./config/env";

async function bootstrap() {
  const app = createApp();

  // Start HTTP Server
  const server = app.listen(ENV.PORT, () => {
    console.log("==================================================");
    console.log(`🏥 MediCore HMS Backend Server is running!`);
    console.log(`📡 URL: http://localhost:${ENV.PORT}`);
    console.log(`🩺 Health check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`🔐 Auth API: http://localhost:${ENV.PORT}/api/auth`);
    console.log(`🗄️ Database: Native MongoDB Driver`);
    console.log(`🌍 Environment: ${ENV.NODE_ENV}`);
    console.log("==================================================");
  });

  // Connect to MongoDB natively
  connectDB().catch((error) => {
    console.error("[MongoDB] Initial connection notice:", error instanceof Error ? error.message : error);
  });

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

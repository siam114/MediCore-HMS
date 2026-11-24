import bcrypt from "bcryptjs";
import { connectDB, closeDB, getCollection } from "../config/db";
import type { UserDocument } from "../models/user.model";

async function main() {
  console.log("==========================================");
  console.log("👑 MediCore HMS: Super Admin Setup Seeder");
  console.log("==========================================");

  try {
    await connectDB();
    const usersCollection = getCollection<UserDocument>("users");

    // 1. Remove old default dummy admin
    const delResult = await usersCollection.deleteMany({ email: "admin@medicore.com" });
    console.log(`[Admin] Removed ${delResult.deletedCount} old dummy admin account(s).`);

    // 2. Hash Super Admin password
    const plainPassword = "smsiam114674111@";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3. Upsert Super Admin account for SM Siam
    const superAdminEmail = "smsiam987@gmail.com";
    const updateResult = await usersCollection.updateOne(
      { email: superAdminEmail },
      {
        $set: {
          name: "SM Siam",
          email: superAdminEmail,
          password: hashedPassword,
          role: "ADMIN",
          phone: "01567898506",
          isVerified: true,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`[Super Admin] Account '${superAdminEmail}' configured as master ADMIN!`);
    console.log("Upserted:", updateResult.upsertedCount, "Modified:", updateResult.modifiedCount);
    console.log("==========================================");
    console.log("✅ Super Admin credentials live & secured in MongoDB Atlas!");
    console.log("==========================================");
  } catch (error) {
    console.error("Super Admin setup failed:", error);
  } finally {
    await closeDB();
  }
}

main();

import { MongoClient, Db, Collection, Document } from "mongodb";
import { ENV } from "./env";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectDB(): Promise<Db> {
  if (db && client) {
    return db;
  }

  try {
    client = new MongoClient(ENV.MONGODB_URI, {
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db();

    console.log(`[MongoDB] Connected successfully via native driver to DB: ${db.databaseName}`);

    // Initialize required indexes
    await initIndexes(db);

    return db;
  } catch (error) {
    console.error("[MongoDB] Connection error:", error instanceof Error ? error.message : error);
    console.warn("[MongoDB] Please verify that your MongoDB service is running or check your MONGODB_URI in backend/.env");
    throw error;
  }
}

export function getDb(): Db {
  if (!db) {
    throw new Error("[MongoDB] Database is not connected. Call connectDB() first.");
  }
  return db;
}

export function getCollection<T extends Document = Document>(name: string): Collection<T> {
  return getDb().collection<T>(name);
}

export function isDbConnected(): boolean {
  return db !== null;
}

export async function closeDB(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("[MongoDB] Connection closed.");
  }
}

async function initIndexes(database: Db): Promise<void> {
  try {
    const usersCollection = database.collection("users");
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
  } catch (err) {
    console.warn("[MongoDB] Index creation notice:", err instanceof Error ? err.message : err);
  }
}

// Creates the MongoDB database, collections, indexes and JSON schema validation.
// Runs automatically before `bun run dev` / `bun run build` (see package.json).
// Never fails the build: if Mongo isn't reachable it just warns and exits 0.
import { readFileSync, existsSync } from "node:fs";

// Minimal .env loader so this works without extra deps.
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.log("[db:init] MONGODB_URI not set — skipping (app runs without persistence).");
  process.exit(0);
}

const dbName = process.env.MONGODB_DB || "portfolio";
const collName = process.env.MONGODB_COLLECTION || "donations";

try {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 4000 });
  await client.connect();
  const db = client.db(dbName);

  const existing = (await db.listCollections().toArray()).map((c) => c.name);

  if (!existing.includes(collName)) {
    await db.createCollection(collName, {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["orderId", "amount", "currency", "status", "createdAt"],
          properties: {
            orderId: { bsonType: "string" },
            paymentId: { bsonType: ["string", "null"] },
            amount: { bsonType: ["int", "long", "double"] },
            currency: { bsonType: "string" },
            status: { enum: ["created", "paid", "failed"] },
            name: { bsonType: ["string", "null"] },
            email: { bsonType: ["string", "null"] },
            message: { bsonType: ["string", "null"] },
            createdAt: { bsonType: ["date", "string"] },
            verifiedAt: { bsonType: ["date", "string", "null"] },
          },
        },
      },
      validationLevel: "moderate",
    });
    console.log(`[db:init] created collection ${dbName}.${collName}`);
  }

  await db.collection(collName).createIndexes([
    { key: { orderId: 1 }, name: "orderId_unique", unique: true },
    { key: { createdAt: -1 }, name: "createdAt_desc" },
    { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
    { key: { email: 1 }, name: "email_idx", sparse: true },
  ]);

  // Lightweight metadata collection so the DB exists even with zero donations.
  if (!existing.includes("meta")) await db.createCollection("meta");
  await db.collection("meta").updateOne(
    { _id: "schema" },
    { $set: { version: 1, updatedAt: new Date() } },
    { upsert: true },
  );

  console.log(`[db:init] ready → ${dbName} (collections: ${collName}, meta)`);
  await client.close();
} catch (err) {
  console.warn(`[db:init] skipped — could not reach MongoDB: ${err.message}`);
}
process.exit(0);

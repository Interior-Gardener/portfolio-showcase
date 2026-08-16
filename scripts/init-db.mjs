// Bootstraps the whole MongoDB database from MONGODB_URI in your .env file.
//
//   bun run db:init      -> strict: fails loudly if the cluster is unreachable
//   predev / prebuild    -> lenient: warns and continues (app runs without DB)
//
// Creates: database, all collections, JSON-schema validation and indexes.
import { readFileSync, existsSync } from "node:fs";

// --- minimal .env loader (.env.local wins, same precedence as Vite) --------
for (const file of [".env", ".env.local"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !m[1].startsWith("#")) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const STRICT = process.argv.includes("--strict") || process.env.DB_INIT_STRICT === "1";
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "portfolio";
const donationsColl = process.env.MONGODB_COLLECTION || "donations";

function bail(msg) {
  if (STRICT) {
    console.error(`[db:init] ${msg}`);
    process.exit(1);
  }
  console.warn(`[db:init] ${msg} — skipping (app runs without persistence).`);
  process.exit(0);
}

if (!uri) bail("MONGODB_URI is not set in .env");

console.log(`[db:init] target → ${uri.replace(/\/\/[^@]*@/, "//***@")} db=${dbName}`);

// --- schema definition: everything the app needs ---------------------------
const collections = [
  {
    name: donationsColl,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["orderId", "amount", "currency", "status", "createdAt"],
        properties: {
          orderId: { bsonType: "string" },
          paymentId: { bsonType: ["string", "null"] },
          signature: { bsonType: ["string", "null"] },
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
    indexes: [
      { key: { orderId: 1 }, name: "orderId_unique", unique: true },
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
      { key: { paymentId: 1 }, name: "paymentId_idx", sparse: true },
      { key: { email: 1 }, name: "email_idx", sparse: true },
    ],
  },
  {
    name: "meta",
    indexes: [{ key: { updatedAt: -1 }, name: "updatedAt_desc" }],
  },
];

const SCHEMA_VERSION = 2;

try {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  const db = client.db(dbName);

  const existing = (await db.listCollections().toArray()).map((c) => c.name);

  for (const spec of collections) {
    if (!existing.includes(spec.name)) {
      await db.createCollection(spec.name, {
        ...(spec.validator ? { validator: spec.validator, validationLevel: "moderate" } : {}),
      });
      console.log(`[db:init] created collection  ${dbName}.${spec.name}`);
    } else if (spec.validator) {
      // keep validation rules up to date on re-runs
      try {
        await db.command({
          collMod: spec.name,
          validator: spec.validator,
          validationLevel: "moderate",
        });
        console.log(`[db:init] updated validator   ${dbName}.${spec.name}`);
      } catch (err) {
        if (err.code === 13 || (err.message && err.message.includes("not allowed to do action [collMod]"))) {
          console.warn(`[db:init] collMod not permitted on ${dbName}.${spec.name} - skipping validator update.`);
        } else {
          throw err;
        }
      }
    }

    if (spec.indexes?.length) {
      await db.collection(spec.name).createIndexes(spec.indexes);
      console.log(
        `[db:init] indexes ready      ${dbName}.${spec.name} (${spec.indexes.map((i) => i.name).join(", ")})`,
      );
    }
  }

  // Stamp the schema version so the DB exists even with zero donations.
  await db
    .collection("meta")
    .updateOne(
      { _id: "schema" },
      { $set: { version: SCHEMA_VERSION, collections: collections.map((c) => c.name), updatedAt: new Date() } },
      { upsert: true },
    );

  const counts = {};
  for (const spec of collections) counts[spec.name] = await db.collection(spec.name).countDocuments();

  console.log(`[db:init] ✅ ${dbName} ready — ${Object.entries(counts).map(([k, v]) => `${k}: ${v} docs`).join(", ")}`);
  await client.close();
  process.exit(0);
} catch (err) {
  bail(`could not reach MongoDB: ${err.message}`);
}

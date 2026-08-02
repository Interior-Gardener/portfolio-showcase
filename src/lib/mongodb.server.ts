// Server-only MongoDB helper.
// Two backends, picked automatically:
//   1. MONGODB_URI  → native `mongodb` driver (local dev / Node hosting).
//   2. Atlas Data API over fetch → used when deployed to the edge/Worker
//      runtime, which cannot open raw TCP sockets.
// Configure via env:
//   MONGODB_URI            e.g. mongodb://localhost:27017/portfolio
//   MONGODB_COLLECTION     default: donations
//   MONGODB_DATA_API_URL   e.g. https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1
//   MONGODB_DATA_API_KEY   Atlas Data API key
//   MONGODB_DATA_SOURCE    Atlas cluster name (default: Cluster0)
//   MONGODB_DB             database name (default: portfolio)
// If these are unset, every helper is a graceful no-op.

const COLLECTION = () => process.env.MONGODB_COLLECTION || "donations";
const DB_NAME = () => process.env.MONGODB_DB || "portfolio";

// Cached native client (local/Node only). The specifier is held in a variable
// so the edge bundler never statically pulls the Node-only driver in.
let nativeDb: Promise<any> | null = null;
function getNativeDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (!nativeDb) {
    const specifier = "mongodb";
    nativeDb = import(/* @vite-ignore */ specifier)
      .then(async (m: any) => {
        const client = new m.MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db(DB_NAME());
        // Ensure the collection + index exist even if db:init never ran.
        await db
          .collection(COLLECTION())
          .createIndex({ orderId: 1 }, { unique: true, name: "orderId_unique" })
          .catch(() => {});
        return db;
      })
      .catch((err: Error) => {
        console.warn("[mongo] native driver unavailable:", err.message);
        nativeDb = null;
        return null;
      });
  }
  return nativeDb;
}

async function dataApi(action: string, body: Record<string, unknown>) {
  const base = process.env.MONGODB_DATA_API_URL;
  const key = process.env.MONGODB_DATA_API_KEY;
  if (!base || !key) {
    console.warn("[mongo] connection unavailable: Data API env vars not set");
    return null;
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/action/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apiKey: key },
    body: JSON.stringify({
      dataSource: process.env.MONGODB_DATA_SOURCE || "Cluster0",
      database: DB_NAME(),
      collection: COLLECTION(),
      ...body,
    }),
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

export async function saveDonation(record: {
  orderId: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  paymentId?: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt: Date;
}) {
  try {
    const db = await getNativeDb();
    if (db) {
      await db.collection(COLLECTION()).insertOne(record);
      return;
    }
    await dataApi("insertOne", {
      document: { ...record, createdAt: record.createdAt.toISOString() },
    });
  } catch (err) {
    console.warn("[mongo] saveDonation failed:", (err as Error).message);
  }
}

export async function updateDonation(orderId: string, patch: Record<string, unknown>) {
  try {
    const db = await getNativeDb();
    if (db) {
      await db.collection(COLLECTION()).updateOne({ orderId }, { $set: patch });
      return;
    }
    await dataApi("updateOne", { filter: { orderId }, update: { $set: patch } });
  } catch (err) {
    console.warn("[mongo] updateDonation failed:", (err as Error).message);
  }
}
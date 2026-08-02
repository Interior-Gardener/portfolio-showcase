// Server-only MongoDB helper.
// Two backends, picked automatically:
//   1. MONGODB_URI  → native `mongodb` driver (local dev / Node hosting).
//   2. Atlas Data API over fetch → used when deployed to the edge/Worker
//      runtime, which cannot open raw TCP sockets.
// The connection is cached per-URI: change MONGODB_URI in .env and the next
// write reconnects to the new cluster (no stale localhost connection).
import { env } from "./env.server";

const DEFAULTS = { collection: "donations", db: "portfolio" };

async function cfg() {
  return {
    uri: await env("MONGODB_URI"),
    db: (await env("MONGODB_DB")) || DEFAULTS.db,
    collection: (await env("MONGODB_COLLECTION")) || DEFAULTS.collection,
  };
}

function redact(uri: string) {
  return uri.replace(/\/\/[^@]*@/, "//***@");
}

// Cached native clients, keyed by `${uri}|${db}` so a changed URI never reuses
// the previous cluster's connection. Specifier held in a variable so the edge
// bundler never statically pulls the Node-only driver in.
const clients = new Map<string, Promise<any>>();

function getNativeDb(uri: string, dbName: string, collection: string) {
  const key = `${uri}|${dbName}`;
  let existing = clients.get(key);
  if (!existing) {
    const specifier = "mongodb";
    existing = import(/* @vite-ignore */ specifier)
      .then(async (m: any) => {
        const client = new m.MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
        await client.connect();
        const db = client.db(dbName);
        await db
          .collection(collection)
          .createIndex({ orderId: 1 }, { unique: true, name: "orderId_unique" })
          .catch(() => {});
        console.log(`[mongo] connected → ${redact(uri)} db=${dbName} coll=${collection}`);
        return db;
      })
      .catch((err: Error) => {
        console.warn("[mongo] native driver unavailable:", err.message);
        clients.delete(key);
        return null;
      });
    clients.set(key, existing);
  }
  return existing;
}

async function dataApi(action: string, body: Record<string, unknown>) {
  const base = await env("MONGODB_DATA_API_URL");
  const key = await env("MONGODB_DATA_API_KEY");
  if (!base || !key) {
    console.warn("[mongo] connection unavailable: no MONGODB_URI and no Data API env vars");
    return null;
  }
  const { db, collection } = await cfg();
  const res = await fetch(`${base.replace(/\/$/, "")}/action/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apiKey: key },
    body: JSON.stringify({
      dataSource: (await env("MONGODB_DATA_SOURCE")) || "Cluster0",
      database: db,
      collection,
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
    const { uri, db: dbName, collection } = await cfg();
    if (uri) {
      const db = await getNativeDb(uri, dbName, collection);
      if (db) {
        await db.collection(collection).insertOne(record);
        return;
      }
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
    const { uri, db: dbName, collection } = await cfg();
    if (uri) {
      const db = await getNativeDb(uri, dbName, collection);
      if (db) {
        await db.collection(collection).updateOne({ orderId }, { $set: patch });
        return;
      }
    }
    await dataApi("updateOne", { filter: { orderId }, update: { $set: patch } });
  } catch (err) {
    console.warn("[mongo] updateDonation failed:", (err as Error).message);
  }
}

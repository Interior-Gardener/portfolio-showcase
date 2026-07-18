// Server-only MongoDB helper.
// Uses a dynamic import + try/catch so builds succeed on runtimes where
// the native driver isn't available (e.g. edge). If MONGODB_URI is unset
// or connection fails, save operations become no-ops and log a warning.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClient: any = null;
let attempted = false;

async function getDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (attempted && !cachedClient) return null;
  attempted = true;
  try {
    const { MongoClient } = await import("mongodb");
    if (!cachedClient) {
      const client = new MongoClient(uri);
      await client.connect();
      cachedClient = client;
    }
    return cachedClient.db(process.env.MONGODB_DB || "portfolio");
  } catch (err) {
    console.warn("[mongo] connection unavailable:", (err as Error).message);
    cachedClient = null;
    return null;
  }
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
    const db = await getDb();
    if (!db) return;
    await db.collection("donations").insertOne(record);
  } catch (err) {
    console.warn("[mongo] saveDonation failed:", (err as Error).message);
  }
}

export async function updateDonation(orderId: string, patch: Record<string, unknown>) {
  try {
    const db = await getDb();
    if (!db) return;
    await db.collection("donations").updateOne({ orderId }, { $set: patch });
  } catch (err) {
    console.warn("[mongo] updateDonation failed:", (err as Error).message);
  }
}
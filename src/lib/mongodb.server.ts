// Server-only MongoDB helper.
// The native `mongodb` driver opens raw TCP sockets and cannot run in the
// edge/Worker runtime this app deploys to, so persistence goes through the
// MongoDB Atlas Data API over plain fetch instead. Configure via env:
//   MONGODB_DATA_API_URL   e.g. https://data.mongodb-api.com/app/<app-id>/endpoint/data/v1
//   MONGODB_DATA_API_KEY   Atlas Data API key
//   MONGODB_DATA_SOURCE    Atlas cluster name (default: Cluster0)
//   MONGODB_DB             database name (default: portfolio)
// If these are unset, every helper is a graceful no-op.

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
      database: process.env.MONGODB_DB || "portfolio",
      collection: "donations",
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
    await dataApi("insertOne", {
      document: { ...record, createdAt: record.createdAt.toISOString() },
    });
  } catch (err) {
    console.warn("[mongo] saveDonation failed:", (err as Error).message);
  }
}

export async function updateDonation(orderId: string, patch: Record<string, unknown>) {
  try {
    await dataApi("updateOne", { filter: { orderId }, update: { $set: patch } });
  } catch (err) {
    console.warn("[mongo] updateDonation failed:", (err as Error).message);
  }
}
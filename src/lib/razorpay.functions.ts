import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const createOrderInput = z.object({
  amount: z.number().int().positive().max(500000), // paise, max ₹5000
  name: z.string().max(80).optional(),
  email: z.string().email().max(120).optional(),
  message: z.string().max(500).optional(),
});

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderInput.parse(data))
  .handler(async ({ data }) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKey = process.env.RAZORPAY_KEY_ID || "";

    if (!keyId || !keySecret) {
      throw new Error(
        "Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env",
      );
    }

    const auth = btoa(`${keyId}:${keySecret}`);
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: "INR",
        receipt: `kv_${Date.now()}`,
        notes: {
          name: data.name || "",
          email: data.email || "",
          message: data.message || "",
        },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("[razorpay] order failed", res.status, t);
      throw new Error("Failed to create Razorpay order");
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };

    const { saveDonation } = await import("./mongodb.server");
    await saveDonation({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: new Date(),
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: publicKey,
    };
  });

const verifyInput = z.object({
  orderId: z.string(),
  paymentId: z.string(),
  signature: z.string(),
});

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifyInput.parse(data))
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");

    const { createHmac } = await import("crypto");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");

    const ok = expected === data.signature;

    const { updateDonation } = await import("./mongodb.server");
    await updateDonation(data.orderId, {
      status: ok ? "paid" : "failed",
      paymentId: data.paymentId,
      verifiedAt: new Date(),
    });

    if (!ok) throw new Error("Invalid payment signature");
    return { ok: true };
  });
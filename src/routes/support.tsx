import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";
import upiQr from "@/assets/upi-qr.jpg";
import { Nav } from "@/components/nav";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support Kartik — Buy me a chai" },
      { name: "description", content: "Support my open work with a one-tap Razorpay contribution or scan the UPI QR." },
    ],
  }),
  component: SupportPage,
});

const presets = [10000, 25000, 50000, 100000]; // paise → ₹100/₹250/₹500/₹1000

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function SupportPage() {
  const [amount, setAmount] = useState(25000);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const ok = await loadRazorpayScript();
      if (!ok) throw new Error("Couldn't load Razorpay checkout");

      const order = await createOrder({
        data: { amount, name: name || undefined, email: email || undefined, message: message || undefined },
      });

      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Kartik Verma",
        description: "Support contribution",
        prefill: { name, email },
        theme: { color: "#E97F3F" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await verifyPayment({
              data: {
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              },
            });
            toast.success("Thank you — payment received ☕");
            setMessage("");
          } catch {
            toast.error("Payment could not be verified.");
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      rzp.open();
    } catch (err) {
      toast.error((err as Error).message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen text-foreground">
      <Nav />
      <Toaster theme="dark" position="top-center" />
      <section className="pt-32 pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          <Link to="/" className="text-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
            ← Back
          </Link>
          <p className="text-mono text-xs uppercase tracking-[0.25em] text-primary mt-8">◆ Support</p>
          <h1 className="text-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            Buy me a
            <br />
            <span className="italic text-primary">chai</span> ☕
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            If something I built helped you — a project, a snippet, an idea — a tiny
            contribution keeps me shipping open work.
          </p>
          <p className="mt-4 text-sm text-foreground/80 max-w-xl border border-primary/30 bg-primary/10 rounded-md px-4 py-3">
            ☕ The UPI QR code is real and will send money directly to me. The Razorpay button is currently in test mode, so card/netbanking payments here are only demos for now.
          </p>

          <div className="mt-12 grid md:grid-cols-5 gap-8">
            <form onSubmit={handlePay} className="md:col-span-3 p-6 rounded-lg border border-border bg-card/40 space-y-6">
              <div>
                <label className="text-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Amount (INR)</label>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setAmount(p)}
                      className={`py-3 rounded-md border text-mono text-sm transition ${
                        amount === p
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      ₹{p / 100}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={1}
                  value={amount / 100}
                  onChange={(e) => setAmount(Math.max(1, Number(e.target.value)) * 100)}
                  className="mt-3 w-full bg-background border border-border rounded-md px-4 py-3 text-foreground text-mono focus:border-primary outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="bg-background border border-border rounded-md px-4 py-3 focus:border-primary outline-none"
                />
                <input
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="bg-background border border-border rounded-md px-4 py-3 focus:border-primary outline-none"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="A note (optional)"
                rows={3}
                className="w-full bg-background border border-border rounded-md px-4 py-3 focus:border-primary outline-none resize-none"
              />

              <button
                type="submit"
                disabled={busy}
                className="w-full py-4 rounded-md bg-primary text-primary-foreground text-mono uppercase tracking-widest text-sm hover:opacity-90 transition disabled:opacity-50"
              >
                {busy ? "Processing…" : `Pay ₹${amount / 100} via Razorpay →`}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Secure checkout by Razorpay · UPI, cards, netbanking
              </p>
            </form>

            <div className="md:col-span-2 p-6 rounded-lg border border-border bg-card/40">
              <p className="text-mono text-[10px] uppercase tracking-[0.25em] text-primary">Or scan · UPI</p>
              <div className="mt-4 aspect-square rounded-md overflow-hidden bg-white p-2">
                <img src={upiQr} alt="UPI QR" className="h-full w-full object-contain" />
              </div>
              <p className="mt-4 text-mono text-xs text-muted-foreground break-all">
                kartikverma2204@okhdfcbank
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
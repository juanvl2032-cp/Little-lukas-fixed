// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Missing STRIPE_SECRET_KEY");
    return { statusCode: 500, body: JSON.stringify({ error: "Missing Stripe key" }) };
  }

  const stripe = new Stripe(key);

  try {
    const { items = [], success_url, cancel_url } = JSON.parse(event.body || "{}");

    const line_items = items.map((i) => ({
      price_data: {
        currency: "usd",
        product_data: { name: i.name || i.title || "Item" },
        unit_amount: Math.round(Number(i.unit_amount ?? (i.priceUSD ?? 0) * 100)),
      },
      quantity: Number(i.quantity || i.qty || 1) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["US"] },
      success_url: success_url || `${event.headers.origin}/success`,
      cancel_url: cancel_url || `${event.headers.origin}/cart`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error("Stripe error:", err);
    return { statusCode: 400, body: JSON.stringify({ error: err.message || "Stripe error" }) };
  }
}

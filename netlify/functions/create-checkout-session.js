// CommonJS (works well on Netlify)
// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

export async function handler(event) {
  try {
    const { items = [] } = JSON.parse(event.body || "{}"); // [{ price, quantity }]
    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "No items provided" }) };
    }

    // optional validation (helps catch wrong price IDs early)
    await Promise.all(items.map(async ({ price, quantity }) => {
      if (!price || !quantity) throw new Error("Each item needs {price, quantity}");
      await stripe.prices.retrieve(price);
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items, // [{ price, quantity }]
      // automatic_tax: { enabled: true },
      // shipping_address_collection: { allowed_countries: ["US","MX"] },
      // shipping_options: [{ shipping_rate: "shr_XXXX" }],
      success_url: `${process.env.SITE_URL}/success`,
      cancel_url: `${process.env.SITE_URL}/cart`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    console.error("checkout error:", e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}

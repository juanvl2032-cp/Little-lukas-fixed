// Netlify function (Node 18+)
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function handler(event) {
  try {
    const { items = [] } = JSON.parse(event.body || "{}");
    // items must be [{price, quantity}]
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items,
      // ✅ Let Stripe handle shipping/tax if you want exact parity with Checkout
      // automatic_tax: { enabled: true },
      // shipping_address_collection: { allowed_countries: ["US"] },
      // shipping_options: [{ shipping_rate: "shr_REPLACE_WITH_YOUR_RATE" }],
      success_url: `${process.env.SITE_URL}/success`,
      cancel_url: `${process.env.SITE_URL}/cart`,
    });
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

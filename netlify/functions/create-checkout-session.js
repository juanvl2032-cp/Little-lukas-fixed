// CommonJS (works well on Netlify)
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

exports.handler = async (event) => {
  try {
    const { items = [] } = JSON.parse(event.body || "{}"); // [{price, quantity}]

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "No items provided" }) };
    }

    // Validate each Price ID up front (catches wrong-mode / nonexistent price IDs)
    await Promise.all(items.map(async (i) => {
      if (!i.price || !i.quantity) throw new Error("Each item needs {price, quantity}");
      try {
        await stripe.prices.retrieve(i.price);
      } catch {
        throw new Error(`Invalid or wrong-mode price: ${i.price}`);
      }
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: items, // uses your Price IDs exactly
      // Optional: enable these when you want Stripe to compute shipping/tax:
      // automatic_tax: { enabled: true },
      // shipping_address_collection: { allowed_countries: ["US"] },
      // shipping_options: [{ shipping_rate: "shr_XXXX" }],
      success_url: `${process.env.SITE_URL}/success`,
      cancel_url: `${process.env.SITE_URL}/cart`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    console.error("checkout error:", e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

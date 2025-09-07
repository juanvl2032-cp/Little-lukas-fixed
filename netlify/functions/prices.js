// netlify/functions/prices.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const priceIds = Array.isArray(body.priceIds) ? body.priceIds : [];

    if (!priceIds.length) {
      return { statusCode: 200, body: JSON.stringify({}) };
    }

    const prices = await Promise.all(
      priceIds.map((id) => stripe.prices.retrieve(id))
    );

    const map = {};
    for (const p of prices) {
      map[p.id] = { unit_amount: p.unit_amount, currency: p.currency };
    }

    return { statusCode: 200, body: JSON.stringify(map) };
  } catch (e) {
    console.error("prices function error:", e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || "Unknown error" }),
    };
  }
};

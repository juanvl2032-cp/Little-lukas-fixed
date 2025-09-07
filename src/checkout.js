// src/checkout.js
export async function proceedToCheckout(items) {
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  if (res.ok && data?.url) window.location.href = data.url;
  else {
    console.error("Checkout error:", data);
    alert("Checkout failed: " + (data?.error || "See console"));
  }
}

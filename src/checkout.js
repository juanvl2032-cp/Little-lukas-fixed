export async function proceedToCheckout(items) {
  // items = [{ price: 'price_...', quantity: 1 }, ...]
  const res = await fetch("/.netlify/functions/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const data = await res.json();
  if (data?.url) {
    window.location.href = data.url;
  } else {
    alert("Sorry—couldn’t start checkout.");
  }
}

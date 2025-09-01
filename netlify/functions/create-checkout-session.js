async function proceedToCheckout(cartItems) {
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cartItems, // [{ name/title, unit_amount (in cents) OR price_data, quantity }]
      success_url: window.location.origin + '/success',
      cancel_url:  window.location.origin + '/cart',
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    alert(`Checkout failed (${res.status}): ${t}`);
    return;
  }

  const { url } = await res.json();
  window.location.href = url;
}
// src/App.jsx
import React from "react";

export default function App() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">
              Little Lukas Party Shop
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
              Handmade & Deals
            </span>
          </div>
        </div>
      </header>

      {/* Banner */}
      <section className="relative border-b border-neutral-200">
        <img
          src="/shoppic.jpg"
          alt="Little Lukas Party Shop banner"
          className="w-full h-44 md:h-60 lg:h-72 object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow">
            Little Lukas Party Shop
          </h1>
        </div>
      </section>

      {/* Catalog placeholder — put your existing product grid here */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-6">
        {/* ... your product cards / filters ... */}
      </section>
    </main>
  );
}

// 🔒 Source of truth is Stripe Price IDs (display values fetched from your Netlify function)
const PRODUCTS = [
  {
    id: "princess-castle",
    title: "Princess Castle",
    description:
      'This beautiful cardstock castle is perfect for prince/princess birthdays—use as a centerpiece, party favor, decoration, or gift box. Customizable colors. Approx. 14" L × 10" W × 13" H.',
    priceId: "price_1S3oIx0sx9RZLNtQYgt1fUNJ",
    images: ["/biggercastle.jpg", "/biggercastle2.webp", "/biggercastle3.webp", "/biggercastle4.webp", "/biggercastle5.webp"],
    image: "/biggercastle.jpg",
    tags: ["Centerpieces", "Birthday"],
  },
  {
    id: "kitty-box",
    title: "Kitty-Birthday-Party-Goodie-Box",
    description:
      'This kitty-themed goodie box is made of high-quality cardstock, perfect for birthday parties or gifts.\nThis listing is for 10 boxes. Measurements: 7" L × 6" W × 3.25" H. Space for candies/gift: 4.5" diameter × 1.75" H.',
    priceId: "price_1S20Nw0sx9RZLNtQ51waQCos",
    images: ["/kittyhat.webp", "/kittyhat2.webp", "/kittyhat3.webp", "/kittyhat4.webp"],
    image: "/kittyhat.webp",
    tags: ["Party Favors", "Kids", "Handmade"],
  },
  {
    id: "princess-invitations",
    title: "Princess Birthday Party Invitations",
    description:
      'These invitations are perfect for your princess birthday party. Made with high-quality cardstock.\nThis listing is for 10 invitations. Measurements: 8.75" x 4.25"',
    priceId: "price_1S20Kh0sx9RZLNtQ7SQBFbcP",
    images: ["/princessinvitation.webp"],
    image: "/princessinvitation.webp",
    tags: ["Invitations", "Kids", "Handmade"],
  },
  {
    id: "sonics-hats",
    title: "Sonic Inspired Party Hats",
    description:
      "Sonic Inspired Party Hats! This listing is for 10 hats. Handmade with high-quality materials. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceId: "price_1S20Hn0sx9RZLNtQ8LfsTFDI",
    images: ["/sonicshat.jpg"],
    image: "/sonicshat.jpg",
    tags: ["Party Hats", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sonic-boxes",
    title: "Sonic Inspired Goodie Boxes",
    description:
      'Sonic-inspired goodie boxes. This listing is for 10 goodie boxes - H 6.75" x L 3.75" x W 3.75". Boxes hold up to 1/2 lb. If you need to put more weight, you can tape the bottom, and they will hold up to 1 lb.\nBoxes are shipped flat. Candies are not included. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.',
    priceId: "price_1S208Z0sx9RZLNtQaUCF5tpi",
    images: ["/sonicsbox.webp"],
    image: "/sonicsbox.webp",
    tags: ["Party Favors", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sonic-hat",
    title: "Sonic Inspired Party Hat",
    description:
      "Sonic Inspired Party Hat! This listing is for 10 hats. Handmade with high-quality materials. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceId: "price_1S205w0sx9RZLNtQDkz5PZaS",
    images: ["/sonichat.webp", "/sonichat2.webp"],
    image: "/sonichat.webp",
    tags: ["Party Hats", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sofia-bag",
    title: "Sophia the First Inspired Goodie Bags",
    description:
      "This order is for 8 candy bags. Size: 4.7in x 2.8in x 8.9in. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceId: "price_1S203e0sx9RZLNtQrUXEWtBd",
    images: ["/sofiab.webp", "/sofiab2.webp"],
    image: "/sofiab.webp",
    tags: ["Party Bags", "Kids", "Handmade", "Birthday"],
  },
];

const CURRENCY_SYMBOLS = { usd: "$" };

function Storefront({ openCartOnMount = false }) {
  const urlWantsCart =
    typeof window !== "undefined" && window.location.pathname === "/cart";
  const shouldOpenCartOnMount = openCartOnMount || urlWantsCart;
  
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  // ✅ auto-open drawer when /cart route passes the prop
  useEffect(() => {
    if (shouldOpenCartOnMount) setOpenCart(true);
  }, [shouldOpenCartOnMount]);

  const [lang, setLang] = useState("en");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [priceMap, setPriceMap] = useState({}); // { [priceId]: { unit_amount, currency } }

  const t = (en, es) => (lang === "en" ? en : es);

  // Load saved cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch Stripe prices for display (single source of truth)
  useEffect(() => {
    const ids = PRODUCTS.map((p) => p.priceId);
    fetch("/.netlify/functions/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceIds: ids }),
    })
      .then((r) => r.json())
      .then((data) => setPriceMap(data || {}))
      .catch(() => {});
  }, []);

  const tags = useMemo(() => {
    const all = new Set(["All"]);
    PRODUCTS.forEach((p) => p.tags.forEach((tag) => all.add(tag)));
    return Array.from(all);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchesTag = activeTag === "All" || p.tags.includes(activeTag);
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesTag && matchesQ;
    });
  }, [activeTag, query]);

  function addToCart(id) {
    setCart((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      if (i >= 0) {
        const n = [...prev];
        n[i] = { ...n[i], qty: n[i].qty + 1 };
        return n;
      }
      return [...prev, { id, qty: 1 }];
    });
    setOpenCart(true);
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQty(id, qty) {
    if (qty <= 0) return removeFromCart(id);
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  }

  function fmt(priceId) {
    const rec = priceMap[priceId];
    if (!rec) return "$—";
    const sym = CURRENCY_SYMBOLS[rec.currency] || "$";
    return `${sym}${(rec.unit_amount / 100).toFixed(2)}`;
  }

  // Build detailed cart from Stripe prices
  const cartDetailed = cart.map((l) => {
    const p = PRODUCTS.find((x) => x.id === l.id);
    const unit = (priceMap[p.priceId]?.unit_amount ?? 0) / 100;
    return { ...l, product: p, unitUSD: unit, lineTotalUSD: unit * l.qty };
  });

  const subtotalUSD = cartDetailed.reduce((s, l) => s + l.lineTotalUSD, 0);
  // Display-only shipping/tax (final truth at Checkout)
  const shippingUSD = subtotalUSD === 0 ? 0 : 6.99;
  const taxUSD = subtotalUSD * 0.0825;
  const totalUSD = subtotalUSD + shippingUSD + taxUSD;

  function startCheckout() {
    // Use Stripe Price IDs only
    const items = cartDetailed.map((item) => ({
      price: item.product.priceId,
      quantity: Number(item.qty || 1),
    }));
    return proceedToCheckout(items);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight">Little Lukas Party Shop</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
              {t("Handmade & Deals", "Hecho a mano y ofertas")}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <input
                placeholder={t("Search products…", "Buscar productos…")}
                className="w-56 md:w-72 rounded-xl border border-neutral-300 px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="absolute right-2 top-2.5 text-neutral-400">⌕</span>
            </div>
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-xl border border-neutral-300 px-2 py-2">
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <span className="rounded-xl border border-neutral-300 px-2 py-2 text-sm">USD</span>
            <button onClick={() => setOpenCart(true)} className="relative rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100">
              🛒
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full px-1.5">
                  {cart.reduce((s, l) => s + l.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Catalog */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full border ${
                activeTag === tag ? "bg-pink-600 text-white border-pink-600" : "border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="group rounded-3xl border border-neutral-200 overflow-hidden bg-white shadow-sm hover:shadow cursor-pointer"
              onClick={() => setSelectedProduct(p)}
            >
              <img src={p.images?.[0] ?? p.image} alt={p.title} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg group-hover:underline underline-offset-4">{p.title}</h3>
                <p className="text-sm text-neutral-600 line-clamp-2 mt-1">{p.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <strong className="text-xl">{fmt(p.priceId)}</strong>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p.id);
                      }}
                      className="rounded-xl bg-neutral-900 text-white px-3 py-2 text-sm font-semibold hover:bg-neutral-800"
                    >
                      {t("Add to cart", "Agregar al carrito")}
                    </button>

                    {/* Immediate buy */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        proceedToCheckout([{ price: p.priceId, quantity: 1 }]);
                      }}
                      className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-semibold hover:bg-neutral-100"
                    >
                      Buy now (Stripe)
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {p.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-neutral-100 border border-neutral-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Product modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setSelectedProduct(null)}>
          <div
            className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedProduct.images.map((img, index) => (
                <img key={index} src={img} alt={`${selectedProduct.title} image ${index + 1}`} className="w-full h-48 object-cover rounded" />
              ))}
            </div>
            <p className="text-neutral-700 mb-4">{selectedProduct.description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => proceedToCheckout([{ price: selectedProduct.priceId, quantity: 1 }])}
                className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
              >
                Buy now (Stripe)
              </button>
              <button onClick={() => setSelectedProduct(null)} className="rounded-xl bg-pink-600 text-white px-4 py-2 font-semibold hover:bg-pink-700">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {openCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenCart(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("Your cart", "Tu carrito")}</h2>
              <button onClick={() => setOpenCart(false)} className="rounded-full border px-3 py-1">✕</button>
            </div>

            <div className="mt-4 flex-1 overflow-auto space-y-4">
              {cartDetailed.length === 0 ? (
                <p className="text-neutral-600">{t("Your cart is empty.", "Tu carrito está vacío.")}</p>
              ) : (
                cartDetailed.map((line) => (
                  <div key={line.id} className="flex gap-3 border-b pb-3">
                    <img
                      src={line.product.images?.[0] ?? line.product.image}
                      alt={line.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{line.product.title}</div>
                      <div className="text-sm text-neutral-600">{fmt(line.product.priceId)}</div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <label>{t("Qty", "Cant.")}</label>
                        <input
                          type="number"
                          min={1}
                          value={line.qty}
                          onChange={(e) => updateQty(line.id, parseInt(e.target.value) || 1)}
                          className="w-16 rounded border px-2 py-1"
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{`$${line.lineTotalUSD.toFixed(2)}`}</div>
                      <button className="text-xs text-red-600 underline mt-1" onClick={() => removeFromCart(line.id)}>
                        {t("Remove", "Quitar")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>{t("Subtotal", "Subtotal")}</span><span>{`$${subtotalUSD.toFixed(2)}`}</span></div>
              <div className="flex items-center justify-between"><span>{t("Estimated tax", "Impuesto estimado")}</span><span>{`$${taxUSD.toFixed(2)}`}</span></div>
              <div className="flex items-center justify-between"><span>{t("Shipping", "Envío")}</span><span>{subtotalUSD === 0 ? t("Free", "Gratis") : `$${shippingUSD.toFixed(2)}`}</span></div>
              <div className="flex items-center justify-between font-bold text-base pt-2"><span>{t("Total", "Total")}</span><span>{`$${totalUSD.toFixed(2)}`}</span></div>

              {cartDetailed.length > 0 && (
                <button onClick={startCheckout} className="w-full mt-2 rounded-2xl bg-pink-600 text-white px-4 py-3 font-semibold hover:bg-pink-700">
                  {t("Proceed to checkout", "Proceder al pago")}
                </button>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

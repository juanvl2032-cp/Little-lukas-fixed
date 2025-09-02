import React, { useEffect, useMemo, useState } from "react";
import { proceedToCheckout } from "./checkout.js"; // helper that POSTs to /.netlify/functions/create-checkout-session

const PRODUCTS = [
  {
    id: "princess-castle",
    title: "Princess Castle",
    description:
      'This beautiful cardstock castle is perfect for prince/princess birthdays—use as a centerpiece, party favor, decoration, or gift box. Customizable colors. Approx. 14" L × 10" W × 13" H.',
    priceUSD: 65,
    images: [
      "/biggercastle.jpg",
      "/biggercastle2.webp",
      "/biggercastle3.webp",
      "/biggercastle4.webp",
      "/biggercastle5.webp",
    ],
    image: "/biggercastle.jpg",
    tags: ["Centerpieces", "Birthday"],
  },
  {
    id: "kitty-box",
    title: "Kitty-Birthday-Party-Goodie-Box",
    description:
      'This kitty-themed goodie box is made of high-quality cardstock, perfect for birthday parties or gifts.\nThis listing is for 10 boxes. Measurements: 7" L × 6" W × 3.25" H. Space for candies/gift: 4.5" diameter × 1.75" H.',
    priceUSD: 12,
    images: ["/kittyhat.webp", "/kittyhat2.webp", "/kittyhat3.webp", "/kittyhat4.webp"],
    image: "/kittyhat.webp",
    tags: ["Party Favors", "Kids", "Handmade"],
  },
  {
    id: "princess-invitations",
    title: "Princess Birthday Party Invitations",
    description:
      'These invitations are perfect for your princess birthday party. Made with high-quality cardstock.\nThis listing is for 10 invitations. Measurements: 8.75" x 4.25"',
    priceUSD: 30,
    images: ["/princessinvitation.webp"],
    image: "/princessinvitation.webp",
    tags: ["Invitations", "Kids", "Handmade"],
  },
  {
    id: "sonics-hats",
    title: "Sonic Inspired Party Hats",
    description:
      "Sonic Inspired Party Hats! This listing is for 10 hats. Handmade with high-quality materials. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceUSD: 30,
    images: ["/sonicshat.jpg"],
    image: "/sonicshat.jpg",
    tags: ["Party Hats", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sonic-boxes",
    title: "Sonic Inspired Goodie Boxes",
    description:
      'Sonic-inspired goodie boxes. This listing is for 10 goodie boxes - H 6.75" x L 3.75" x W 3.75". Boxes hold up to 1/2 lb. If you need to put more weight, you can tape the bottom, and they will hold up to 1 lb.\nBoxes are shipped flat. Candies are not included. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.',
    priceUSD: 30,
    images: ["/sonicsbox.webp"],
    image: "/sonicsbox.webp",
    tags: ["Party Favors", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sonic-hat",
    title: "Sonic Inspired Party Hat",
    description:
      "Sonic Inspired Party Hat! This listing is for 10 hats. Handmade with high-quality materials. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceUSD: 30,
    images: ["/sonichat.webp", "/sonichat2.webp"],
    image: "/sonichat.webp",
    tags: ["Party Hats", "Kids", "Handmade", "Birthday"],
  },
  {
    id: "sofia-bag",
    title: "Sophia the First Inspired Goodie Bags",
    description:
      "This order is for 8 candy bags. Size: 4.7in x 2.8in x 8.9in. These items are not licensed products. We do not claim ownership of characters used. Characters belong to their respective copyright owners. The listing is only for materials, labor, and services. Items are for personal use only and not be resold for any reason.",
    priceUSD: 18,
    images: ["/sofiab.webp", "/sofiab2.webp"],
    image: "/sofiab.webp",
    tags: ["Party Bags", "Kids", "Handmade", "Birthday"],
  },
];

const CURRENCY_SYMBOLS = { USD: "$" };

export default function Storefront() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [lang, setLang] = useState("en");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const t = (en, es) => (lang === "en" ? en : es);

  // Persist cart
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const tags = useMemo(() => {
    const all = new Set(["All"]);
    PRODUCTS.forEach((p) => p.tags.forEach((tag) => all.add(tag)));
    return Array.from(all);
  }, []);

  const filtered = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        const mt = activeTag === "All" || p.tags.includes(activeTag);
        const q = query.trim().toLowerCase();
        const mq =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        return mt && mq;
      }),
    [activeTag, query]
  );

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

  function formatPrice(usd) {
    return `${CURRENCY_SYMBOLS.USD}${(usd ?? 0).toFixed(2)}`;
  }

  // Build detailed lines
  const cartDetailed = cart.map((l) => {
    const p = PRODUCTS.find((p) => p.id === l.id);
    return { ...l, product: p, lineTotalUSD: (p?.priceUSD || 0) * l.qty };
  });

  const subtotalUSD = cartDetailed.reduce((s, l) => s + l.lineTotalUSD, 0);
  const shippingUSD = subtotalUSD === 0 ? 0 : 6.99;
  const taxUSD = subtotalUSD * 0.0825;
  const totalUSD = subtotalUSD + shippingUSD + taxUSD;

  // Wrapper that calls your helper with the cart
  function startCheckout() {
    const items = cartDetailed.map((item) => ({
      name: item.product.title,
      priceUSD: item.product.priceUSD,
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
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-xl border border-neutral-300 px-2 py-2"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            <span className="rounded-xl border border-neutral-300 px-2 py-2 text-sm">USD</span>
            <button
              onClick={() => setOpenCart(true)}
              className="relative rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
            >
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 to-violet-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {t(
                "Handmade party hats, clothes & shoes — for less",
                "Sombreros de fiesta, ropa y zapatos — a mejores precios"
              )}
            </h1>
            <p className="mt-3 text-neutral-700">
              {t(
                "Local to Round Rock–Hutto. We ship anywhere in the USA.",
                "Locales en Round Rock–Hutto. Enviamos a cualquier parte de EE.UU."
              )}
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#catalog" className="rounded-2xl bg-pink-600 text-white px-4 py-2 font-semibold hover:bg-pink-700">
                {t("Shop now", "Comprar ahora")}
              </a>
              <a href="#contact" className="rounded-2xl border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-100">
                {t("Questions?", "¿Dudas?")}
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop"
              alt="Colorful party hats"
              className="w-full h-64 md:h-80 object-cover rounded-3xl shadow"
            />
            <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur rounded-2xl px-4 py-2 shadow">
              <span className="text-sm">⭐ {t("5-star local seller", "Vendedor local 5★")}</span>
            </div>
          </div>
        </div>
      </section>

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
                  <strong className="text-xl">{formatPrice(p.priceUSD)}</strong>
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

                    {/* Immediate buy for a single product */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        proceedToCheckout([
                          { name: p.title, priceUSD: p.priceUSD, quantity: 1 },
                        ]);
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

      {/* Product modal (with Buy now) */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {selectedProduct.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${selectedProduct.title} image ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>

            <p className="text-neutral-700 mb-4">{selectedProduct.description}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  proceedToCheckout([
                    { name: selectedProduct.title, priceUSD: selectedProduct.priceUSD, quantity: 1 },
                  ])
                }
                className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
              >
                Buy now (Stripe)
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-xl bg-pink-600 text-white px-4 py-2 font-semibold hover:bg-pink-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promo strip */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-900">
          <p className="text-sm">
            {t(
              "Flat $6.99 US shipping • Easy returns • Secure checkout (Stripe)",
              "Envío fijo $6.99 en EE.UU. • Devoluciones fáciles • Pago seguro (Stripe)"
            )}
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="rounded-3xl border border-neutral-200 p-6 bg-white">
            <h2 className="text-2xl font-bold">
              {t("Questions? Message us", "¿Dudas? Escríbenos")}
            </h2>
            <p className="text-neutral-600 mt-1">
              {t("We usually reply within a few hours.", "Normalmente respondemos en pocas horas.")}
            </p>
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                alert(t("Thanks! We'll get back to you soon.", "¡Gracias! Pronto te respondemos."));
              }}
            >
              <input
                required
                placeholder={t("Your name", "Tu nombre")}
                className="rounded-xl border border-neutral-300 px-3 py-2"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="rounded-xl border border-neutral-300 px-3 py-2"
              />
              <textarea
                required
                placeholder={t("How can we help?", "¿Cómo te ayudamos?")}
                className="rounded-xl border border-neutral-300 px-3 py-2 min-h-[96px]"
              />
              <button className="rounded-xl bg-pink-600 text-white px-4 py-2 font-semibold hover:bg-pink-700 w-fit">
                {t("Send", "Enviar")}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-6 bg-white">
            <h3 className="font-bold text-lg">{t("Pickup & Shipping", "Entrega y Envíos")}</h3>
            <p className="text-neutral-700 mt-1">
              {t(
                "Local pickup in Round Rock–Hutto. We ship anywhere in the USA.",
                "Entrega local en Round Rock–Hutto. Envíos a todo EE.UU."
              )}
            </p>
            <ul className="mt-3 list-disc ml-5 text-neutral-700 space-y-1">
              <li>{t("Flat $6.99 shipping (US)", "Tarifa de envío $6.99 (EE.UU.)")}</li>
            </ul>
            <div className="mt-4 text-sm text-neutral-600">
              <p>
                {t(
                  "WhatsApp orders welcome: replace # with your number →",
                  "Pedidos por WhatsApp bienvenidos: reemplaza # con tu número →"
                )}{" "}
                <a
                  className="text-pink-700 underline"
                  href="https://wa.me/1##########"
                  target="_blank"
                  rel="noreferrer"
                >
                  wa.me/1##########
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 mt-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} Little Lukas Party Shop
          </p>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:underline">
              {t("Privacy", "Privacidad")}
            </a>
            <a href="#" className="hover:underline">
              {t("Returns", "Devoluciones")}
            </a>
            <a href="#" className="hover:underline">
              {t("Contact", "Contacto")}
            </a>
          </nav>
        </div>
      </footer>

      {/* Cart drawer */}
      {openCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpenCart(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("Your cart", "Tu carrito")}</h2>
              <button onClick={() => setOpenCart(false)} className="rounded-full border px-3 py-1">
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-auto space-y-4">
              {cartDetailed.length === 0 ? (
                <p className="text-neutral-600">
                  {t("Your cart is empty.", "Tu carrito está vacío.")}
                </p>
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
                      <div className="text-sm text-neutral-600">
                        {formatPrice(line.product.priceUSD)}
                      </div>
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
                      <div className="font-semibold">{formatPrice(line.lineTotalUSD)}</div>
                      <button
                        className="text-xs text-red-600 underline mt-1"
                        onClick={() => removeFromCart(line.id)}
                      >
                        {t("Remove", "Quitar")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{t("Subtotal", "Subtotal")}</span>
                <span>{formatPrice(subtotalUSD)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("Estimated tax", "Impuesto estimado")}</span>
                <span>{formatPrice(taxUSD)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{t("Shipping", "Envío")}</span>
                <span>{shippingUSD === 0 ? t("Free", "Gratis") : formatPrice(shippingUSD)}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-base pt-2">
                <span>{t("Total", "Total")}</span>
                <span>{formatPrice(totalUSD)}</span>
              </div>

              {cartDetailed.length > 0 && (
                <button
                  onClick={startCheckout}
                  className="w-full mt-2 rounded-2xl bg-pink-600 text-white px-4 py-3 font-semibold hover:bg-pink-700"
                >
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

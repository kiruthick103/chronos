import { useState } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

const shippingOptions = [
  { id: "standard", name: "Standard (5-7 days)", cost: 0 },
  { id: "express", name: "Express (2-3 days)", cost: 25 },
  { id: "overnight", name: "Overnight Delivery", cost: 50 },
];

function EmptyCart() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-8 animate-bounce-slow">
        <span className="text-5xl">🛒</span>
      </div>
      <h2 className="font-display text-4xl font-bold text-white mb-3">Your Cart is Empty</h2>
      <p className="text-white/50 mb-10 max-w-md text-lg leading-relaxed">
        Discover our curated collection of luxury timepieces and find your perfect match.
      </p>
      <a href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }} className="btn-gold px-8 py-3 text-[#0A0A0F] text-sm font-black tracking-widest uppercase rounded-md">
        Continue Shopping
      </a>
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, addOrder } = useCart();
  const [shipping, setShipping] = useState("standard");
  const [checkout, setCheckout] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [formData, setFormData] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", postal: "", country: "United States",
  });

  const shippingCost = shippingOptions.find((s) => s.id === shipping)?.cost || 0;
  const tax = Math.round(cartTotal * 0.08 * 100) / 100;
  const total = cartTotal + shippingCost + tax;

  if (cart.length === 0 && !checkout) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-5xl font-bold text-white mb-12">Shopping Cart</h1>
          <EmptyCart />
        </div>
      </div>
    );
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    setPlacing(true);
    try {
      const orderInfo = {
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postal: formData.postal,
          country: formData.country,
        },
        items: cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        subtotal: cartTotal,
        shipping: shippingCost,
        total: total,
        payment_method: "demo_card",
      };
      await addOrder(orderInfo);
      alert("✓ Order placed successfully!\n\nOrder Total: $" + total.toFixed(2) + "\n\nYour order has been saved and is visible in the Admin Panel.");
      clearCart();
      setCheckout(false);
      setFormData({ email: "", firstName: "", lastName: "", address: "", city: "", postal: "", country: "United States" });
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Order placed (locally). Check Admin Panel for details.");
      clearCart();
      setCheckout(false);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {!checkout ? (
          <>
            {/* Header */}
            <div className="mb-12 animate-fade-up">
              <h1 className="font-display text-5xl font-bold text-white mb-3">Shopping Cart</h1>
              <p className="text-white/50 text-lg">{cart.length} luxury timepiece{cart.length !== 1 ? "s" : ""}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="glass rounded-3xl overflow-hidden backdrop-blur-xl shadow-lg-premium">
                  {cart.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex gap-6 p-6 sm:p-7 border-b border-white/10 last:border-0 hover:bg-white/[0.02] transition-all duration-300 animate-fade-up`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {/* Image */}
                      <div className="w-28 h-28 flex-shrink-0 rounded-2xl overflow-hidden glass">
                        <WatchImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          fallbackSize="text-5xl"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-white/25 tracking-widest uppercase font-semibold mb-1">{item.brand}</p>
                          <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                          <p className="text-[#C9A84C] text-base font-bold">${item.price.toLocaleString()}</p>
                        </div>

                        {/* Quantity control */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all flex items-center justify-center text-sm font-bold"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 bg-white/5 border border-white/10 text-white text-center text-sm rounded-lg px-2 py-1.5 font-semibold"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all flex items-center justify-center text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price & remove */}
                      <div className="flex flex-col justify-between items-end">
                        <span className="text-white font-black text-xl">${(item.price * item.quantity).toLocaleString()}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-[#EF4444] transition-colors text-xs tracking-wider uppercase font-bold hover:scale-110"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="glass rounded-3xl p-7 sticky top-24 animate-fade-up-delay-2 backdrop-blur-xl shadow-lg-premium">
                  <h3 className="text-white font-bold text-xl mb-8">Order Summary</h3>

                  {/* Items breakdown */}
                  <div className="space-y-3.5 mb-8 pb-8 border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Subtotal</span>
                      <span className="text-white font-bold text-lg">${cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Shipping</span>
                      <span className="text-white font-bold text-lg">${shippingCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-sm">Tax (8%)</span>
                      <span className="text-white font-bold text-lg">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/10">
                    <span className="text-white font-bold text-lg">Total</span>
                    <span className="text-[#C9A84C] text-3xl font-black">${total.toFixed(2)}</span>
                  </div>

                  {/* Shipping selector */}
                  <div className="mb-8">
                    <label className="text-white text-xs tracking-widest uppercase font-bold block mb-4">Delivery Method</label>
                    <div className="space-y-2">
                      {shippingOptions.map((opt) => (
                        <label key={opt.id} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-[#C9A84C]/40 cursor-pointer group transition-all">
                          <input
                            type="radio"
                            name="shipping"
                            value={opt.id}
                            checked={shipping === opt.id}
                            onChange={(e) => setShipping(e.target.value)}
                            className="w-5 h-5"
                          />
                          <div className="flex-1">
                            <span className="text-white/70 group-hover:text-white transition-colors text-sm font-semibold">{opt.name}</span>
                          </div>
                          {opt.cost > 0 && <span className="text-[#C9A84C] text-sm font-bold">+${opt.cost}</span>}
                        </label>
                      ))}
                    </div>
                  </div>

                  <a href="#" onClick={(e) => { e.preventDefault(); setCheckout(true); }} className="btn-gold w-full py-3.5 text-[#0A0A0F] text-sm font-black tracking-[0.2em] uppercase rounded-md shadow-lg block text-center mb-3">
                    Proceed to Checkout
                  </a>

                  <button
                    onClick={() => window.history.back()}
                    className="btn-ghost w-full py-2.5 text-[#C9A84C] text-sm font-bold tracking-wider uppercase rounded-md"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 flex items-center gap-4">
              <button
                onClick={() => setCheckout(false)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-[#C9A84C] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="font-display text-4xl font-bold text-white">Secure Checkout</h2>
            </div>

            <form onSubmit={handleCheckout} className="glass rounded-3xl p-8 animate-fade-up backdrop-blur-xl shadow-lg-premium">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">Postal Code</label>
                  <input
                    type="text"
                    name="postal"
                    value={formData.postal}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-white/60 mb-2.5 tracking-wider uppercase font-bold">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full bg-white/5 border border-white/10 text-white px-5 py-3 rounded-lg focus:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/20 transition-all"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Switzerland</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Japan</option>
                  </select>
                </div>
              </div>

              {/* Order summary in checkout */}
              <div className="glass rounded-xl p-5 mb-8 border-white/10">
                <p className="text-white/60 text-sm mb-1">Order Total: <span className="text-white font-bold text-2xl">${total.toFixed(2)}</span></p>
                <p className="text-white/40 text-xs">{cart.length} item{cart.length !== 1 ? "s" : ""} • {shippingOptions.find(s => s.id === shipping)?.name}</p>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="btn-gold w-full py-4 text-[#0A0A0F] text-sm font-black tracking-[0.2em] uppercase rounded-md shadow-lg mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {placing ? "Placing Order..." : "Place Order Securely"}
              </button>

              <p className="text-white/30 text-xs text-center leading-relaxed">
                ✓ SSL Encrypted • ✓ Secure Payment • ✓ No Actual Charge (Demo Mode)
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

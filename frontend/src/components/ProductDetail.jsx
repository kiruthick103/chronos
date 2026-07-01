import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

function StarRow({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={size} viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#C9A84C" : i - 0.5 <= rating ? "url(#half)" : "none"}
          stroke="#C9A84C" strokeWidth="1.5">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#C9A84C" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ label, pct }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <span className="text-[#C9A84C] text-xs w-8 text-right hover:underline">{label} ★</span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F0D080] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-white/40 text-xs w-8">{pct}%</span>
    </div>
  );
}

const qaData = [
  {
    q: "Is a certificate of authenticity included?",
    a: "Yes, every Chronolux watch ships with the original manufacturer's box, papers, and a certified certificate of authenticity issued by our in-house horological experts."
  },
  {
    q: "What warranty do I get?",
    a: "All watches carry a 2-year international Chronolux warranty covering all mechanical components. In-house servicing is available at our authorised service centres."
  },
  {
    q: "Can I return the watch if I change my mind?",
    a: "We offer a 30-day free return window with full refund, provided the watch is returned in its original unaltered condition with all accompanying documentation."
  },
  {
    q: "Is international shipping available?",
    a: "Yes, we offer fully insured worldwide shipping via FedEx Priority. Delivery times typically range from 2–5 business days depending on destination."
  }
];

export default function ProductDetail({ productId, setPage, onProductClick }) {
  const { addToCart, toggleWishlist, wishlist, products, reviewsState, fetchReviews, addReview } = useCart();
  const product = products.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [reviewForm, setReviewForm] = useState({ reviewer_name: "", rating: 5, title: "", comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedQA, setExpandedQA] = useState(null);

  const reviews = reviewsState[productId] || [];
  const inWishlist = wishlist.find((w) => w.id === productId);

  useEffect(() => {
    if (productId) fetchReviews(productId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <p className="text-white/50">Product not found</p>
      </div>
    );
  }

  const related = products
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setPage("cart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewer_name || !reviewForm.comment) return;
    setSubmitting(true);
    await addReview(productId, reviewForm);
    setSubmitting(false);
    setSubmitted(true);
    setReviewForm({ reviewer_name: "", rating: 5, title: "", comment: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Compute rating distribution from reviews
  const totalReviews = reviews.length || product.reviews || 1;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: Math.round((reviews.filter((r) => r.rating === star).length / Math.max(reviews.length, 1)) * 100)
  }));

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  const specs = product.specs || {
    Brand: product.brand,
    Movement: product.movement || "Swiss Automatic",
    "Water Resistance": product.water ? `${product.water}m / ${Math.round(product.water * 3.28)}ft` : "30m",
    "Case Material": "316L Stainless Steel",
    "Crystal": "Scratch-resistant Sapphire",
    "Case Diameter": "41mm",
    "Band Material": "Genuine Calfskin Leather",
    "Dial Color": "Sunburst Black",
    Clasp: "Deployant Buckle",
    Complication: "Date, Seconds",
  };

  // Delivery estimate
  const today = new Date();
  const delivery = new Date(today);
  delivery.setDate(today.getDate() + 4);
  const fastest = new Date(today);
  fastest.setDate(today.getDate() + 2);
  const deliveryStr = delivery.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const fastestStr = fastest.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const tabs = ["overview", "specifications", "reviews", "q&a"];

  return (
    <div className="min-h-screen bg-[#0A0A0F] pt-20 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-white/30">
          <button onClick={() => setPage("home")} className="hover:text-[#C9A84C] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => setPage("collection")} className="hover:text-[#C9A84C] transition-colors">Collection</button>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 mb-16">

          {/* ── LEFT: Images + Tabs ── */}
          <div>
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden mb-4 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] h-[480px] sm:h-[560px] flex items-center justify-center group">
              {product.originalPrice && (
                <div className="absolute top-5 left-5 z-10 px-3 py-1.5 bg-[#EF4444] text-white rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
                  SALE — Save ${(product.originalPrice - product.price).toLocaleString()}
                </div>
              )}
              <WatchImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fallbackSize="text-[120px]"
              />
              {/* Zoom hint */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white/50 text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/10">
                🔍 Hover to zoom
              </div>
            </div>

            {/* Tab nav */}
            <div className="flex gap-1 mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-xs font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-all border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-[#C9A84C] text-[#C9A84C]"
                      : "border-transparent text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "q&a" ? "Q&A" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="animate-fade-up space-y-8">
                {/* About */}
                <div>
                  <h2 className="text-white font-bold text-lg mb-3">About this watch</h2>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {product.description || `The ${product.name} by ${product.brand} is a masterclass in precision engineering and timeless design. Crafted for the discerning collector, every detail has been meticulously refined — from the hand-finished case to the sapphire crystal that protects the exquisite dial. This timepiece is a statement of heritage, craftsmanship, and understated luxury.`}
                  </p>
                </div>

                {/* Key highlights */}
                <div>
                  <h2 className="text-white font-bold text-lg mb-4">Key Highlights</h2>
                  <ul className="space-y-3">
                    {[
                      `Certified ${product.brand} authentic timepiece with original box & papers`,
                      `${product.movement || "Swiss Automatic"} movement — COSC chronometer precision`,
                      `${product.water ? `${product.water}m water resistance` : "30m splash resistance"} — built for everyday confidence`,
                      "Scratch-resistant sapphire crystal with anti-reflective coating",
                      "Solid 316L stainless steel case — corrosion and tarnish resistant",
                      "2-year international warranty + 30-day return guarantee",
                    ].map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Delivery info box */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">FREE Insured Shipping</p>
                      <p className="text-white/40 text-xs">Standard delivery by <span className="text-white/70 font-semibold">{deliveryStr}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Express Available</p>
                      <p className="text-white/40 text-xs">Fastest delivery by <span className="text-white/70 font-semibold">{fastestStr}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16v16H4z" /><path d="M16 4v4H8V4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">30-Day Free Returns</p>
                      <p className="text-white/40 text-xs">Full refund if returned in original condition</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specifications */}
            {activeTab === "specifications" && (
              <div className="animate-fade-up">
                <h2 className="text-white font-bold text-lg mb-5">Technical Specifications</h2>
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
                  {Object.entries(specs).map(([key, value], i) => (
                    <div key={key} className={`flex justify-between items-center px-6 py-4 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""} border-b border-white/5 last:border-0`}>
                      <span className="text-white/50 font-medium capitalize">{key}</span>
                      <span className="text-white font-semibold text-right max-w-[55%]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === "reviews" && (
              <div className="animate-fade-up space-y-8">
                {/* Rating summary */}
                <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row gap-8">
                    <div className="text-center flex-shrink-0">
                      <div className="text-7xl font-black text-white leading-none mb-1">{avgRating}</div>
                      <StarRow rating={Number(avgRating)} />
                      <p className="text-white/40 text-xs mt-2">{reviews.length || totalReviews} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2.5 justify-center flex flex-col">
                      {ratingCounts.map(({ star, pct }) => (
                        <RatingBar key={star} label={star} pct={pct || (star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 7 : 2)} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review list */}
                <div className="space-y-5">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-white/[0.025] border border-white/8 rounded-2xl p-6 animate-fade-up">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-xs font-black">
                              {(r.reviewer_name || "A")[0].toUpperCase()}
                            </div>
                            <span className="text-white font-bold text-sm">{r.reviewer_name}</span>
                            <span className="text-[10px] text-white/20 bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Verified Purchase</span>
                          </div>
                          <StarRow rating={r.rating} size="w-3.5 h-3.5" />
                        </div>
                        <span className="text-white/25 text-xs">
                          {new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {r.title && <p className="text-white font-bold text-sm mb-2">{r.title}</p>}
                      <p className="text-white/60 text-sm leading-relaxed">{r.comment}</p>
                      <div className="mt-4 flex items-center gap-4 text-xs text-white/25">
                        <button className="hover:text-white/50 transition-colors">👍 Helpful</button>
                        <button className="hover:text-white/50 transition-colors">Report</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Write review */}
                <div className="bg-white/[0.03] border border-[#C9A84C]/20 rounded-2xl p-6">
                  <h3 className="text-white font-bold text-base mb-5">Write a Customer Review</h3>
                  {submitted ? (
                    <div className="flex items-center gap-3 text-green-400 py-4">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>
                      <span className="font-semibold">Review submitted! Thank you for your feedback.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Your name"
                          value={reviewForm.reviewer_name}
                          onChange={(e) => setReviewForm((f) => ({ ...f, reviewer_name: e.target.value }))}
                          required
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#C9A84C] focus:outline-none placeholder-white/25 w-full"
                        />
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                          <span className="text-white/40 text-sm">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                                className="transition-transform hover:scale-125"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill={s <= reviewForm.rating ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Review title (optional)"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#C9A84C] focus:outline-none placeholder-white/25 w-full"
                      />
                      <textarea
                        placeholder="Share your experience with this timepiece..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                        required
                        rows={4}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#C9A84C] focus:outline-none placeholder-white/25 w-full resize-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold px-8 py-3 text-[#0A0A0F] text-xs font-black tracking-widest uppercase rounded-xl disabled:opacity-50"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Q&A */}
            {activeTab === "q&a" && (
              <div className="animate-fade-up space-y-3">
                <h2 className="text-white font-bold text-lg mb-5">Customer Questions & Answers</h2>
                {qaData.map((item, i) => (
                  <div key={i} className="bg-white/[0.025] border border-white/8 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedQA(expandedQA === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-[#C9A84C] font-black text-sm flex-shrink-0 mt-0.5">Q</span>
                        <span className="text-white font-semibold text-sm group-hover:text-[#C9A84C] transition-colors">{item.q}</span>
                      </div>
                      <svg className={`w-4 h-4 text-white/30 flex-shrink-0 ml-4 transition-transform duration-300 ${expandedQA === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedQA === i && (
                      <div className="px-6 pb-5 flex items-start gap-3 animate-fade-up">
                        <span className="text-green-400 font-black text-sm flex-shrink-0 mt-0.5">A</span>
                        <p className="text-white/60 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Purchase Panel ── */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">

            {/* Brand & Title */}
            <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-6">
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase font-bold mb-2">{product.brand}</p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">{product.name}</h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/8">
                <StarRow rating={Number(avgRating)} />
                <span className="text-white font-bold text-sm">{avgRating}</span>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className="text-[#C9A84C] text-sm hover:underline"
                >
                  {reviews.length || product.reviews} ratings
                </button>
              </div>

              {/* Price */}
              <div className="mb-5 pb-5 border-b border-white/8">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-[#C9A84C]">${product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-white/30 line-through">${product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                {product.originalPrice && (
                  <p className="text-green-400 text-sm mt-1 font-semibold">
                    You save: ${(product.originalPrice - product.price).toLocaleString()} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                  </p>
                )}
                <p className="text-white/30 text-xs mt-2">Inclusive of all taxes. Free insured shipping.</p>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-sm font-semibold">In Stock</span>
                <span className="text-white/30 text-xs">— Ready to ship today</span>
              </div>

              {/* Quantity */}
              <div className="mb-5">
                <label className="text-white/50 text-xs tracking-widest uppercase font-semibold block mb-2">Quantity</label>
                <div className="flex items-center gap-0 bg-white/5 border border-white/10 rounded-xl w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-white font-bold text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 mb-5">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 rounded-xl bg-[#C9A84C] text-[#0A0A0F] font-black text-sm tracking-[0.15em] uppercase hover:bg-[#F0D080] transition-all shadow-[0_0_30px_rgba(201,168,76,0.35)] hover:shadow-[0_0_45px_rgba(201,168,76,0.55)]"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 rounded-xl font-black text-sm tracking-[0.15em] uppercase transition-all ${
                    added
                      ? "bg-green-500/20 border-2 border-green-500/40 text-green-400"
                      : "bg-white/5 border-2 border-white/15 text-white hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 hover:text-[#C9A84C]"
                  }`}
                >
                  {added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 rounded-xl border text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                  inWishlist
                    ? "border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/5"
                    : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill={inWishlist ? "#EF4444" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust badges */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5 grid grid-cols-2 gap-3">
              {[
                { icon: "🔒", label: "Secure Payment", sub: "256-bit SSL" },
                { icon: "✅", label: "Authenticated", sub: "Certificate included" },
                { icon: "🚚", label: "Free Shipping", sub: "Fully insured" },
                { icon: "↩️", label: "30-Day Returns", sub: "No questions asked" },
              ].map((b) => (
                <div key={b.label} className="flex items-start gap-2.5">
                  <span className="text-lg">{b.icon}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{b.label}</p>
                    <p className="text-white/30 text-[10px]">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sold by */}
            <div className="bg-white/[0.02] border border-white/8 rounded-2xl p-5">
              <p className="text-white/40 text-xs mb-1">Sold by</p>
              <p className="text-white font-bold text-sm">Chronolux Official Store</p>
              <p className="text-green-400 text-xs mt-0.5">⭐ 4.97 • 10,000+ sales</p>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        {related.length > 0 && (
          <section className="mt-4">
            <h2 className="font-display text-3xl font-bold text-white mb-2">More from <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">{product.brand}</span></h2>
            <p className="text-white/40 text-sm mb-8">Customers who viewed this also explored</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => onProductClick && onProductClick(p.id)}
                  className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden card-hover group animate-fade-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="h-48 bg-gradient-to-br from-[#C9A84C]/10 to-transparent flex items-center justify-center overflow-hidden">
                    <WatchImage
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackSize="text-4xl"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-white/25 tracking-widest uppercase mb-1">{p.brand}</p>
                    <h4 className="text-white font-bold text-sm mb-2 group-hover:text-[#C9A84C] transition-colors">{p.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[#C9A84C] font-black">${p.price.toLocaleString()}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-3 h-3" viewBox="0 0 24 24" fill={s <= Math.floor(p.rating) ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

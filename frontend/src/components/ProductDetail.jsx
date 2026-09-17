import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

function StarRow({ rating, size = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={size} viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#D4AF37" : "none"}
          stroke="#D4AF37" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail({ productId, setPage, onProductClick }) {
  const { addToCart, toggleWishlist, wishlist, products } = useCart();
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");

  const inWishlist = wishlist.some((w) => w.id === product?.id);

  // Reset image on product change
  useEffect(() => {
    setSelectedImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center p-6 bg-[#090A0E] text-white">
        <p className="text-white/50 text-lg mb-4">Timepiece reference not found in the vault.</p>
        <button
          onClick={() => setPage("collection")}
          className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#090A0E] font-bold text-xs uppercase tracking-wider"
        >
          Return to Collection
        </button>
      </div>
    );
  }

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  const currentImage = galleryImages[selectedImageIndex] || product.image;

  // Handle image mouse movement for zoom
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

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

  // Related watches from same brand or style
  const related = products
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.style === product.style))
    .slice(0, 4);

  // Installment estimate (24 months)
  const monthlyEstimate = Math.round(product.price / 24);

  return (
    <div className="min-h-screen bg-[#090A0E] text-white pt-24 pb-24 px-4 sm:px-8">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto py-4 border-b border-white/5 mb-8">
        <nav className="flex items-center gap-2 text-xs text-white/40 flex-wrap">
          <button onClick={() => setPage("home")} className="hover:text-[#D4AF37] transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => setPage("collection")} className="hover:text-[#D4AF37] transition-colors">Collection</button>
          <span>/</span>
          <span className="text-[#D4AF37] font-semibold">{product.brand}</span>
          <span>/</span>
          <span className="text-white/80 font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Main Product Showcase Grid */}
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Multi-Image Gallery with Hover Zoom (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Interactive Viewport */}
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-[#050608] border border-white/10 flex items-center justify-center cursor-crosshair group select-none shadow-2xl"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Product Badges */}
              <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
                {product.certified && (
                  <span className="bg-[#090A0E]/95 border border-[#D4AF37]/60 text-[#D4AF37] px-3.5 py-1 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-xl">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Certified Authentic</span>
                  </span>
                )}
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-xl w-fit ${
                  product.condition === "New"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : product.condition === "Vintage"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/10 text-white border border-white/20"
                }`}>
                  {product.condition}
                </span>
              </div>

              {/* Standard Image View */}
              <div
                className={`w-full h-full transition-transform duration-200 ${
                  isZoomed ? "opacity-0" : "opacity-100"
                }`}
              >
                <WatchImage
                  src={currentImage}
                  alt={`${product.brand} ${product.name}`}
                  className="w-full h-full object-cover"
                  fallbackSize="text-7xl"
                />
              </div>

              {/* Magnified Hover Zoom View */}
              {isZoomed && (
                <div
                  className="absolute inset-0 bg-no-repeat pointer-events-none transition-opacity duration-200"
                  style={{
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: "220%",
                  }}
                />
              )}

              {/* Zoom Instruction Tag */}
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white/60 text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-full border border-white/10 pointer-events-none">
                Hover to Zoom (2.2x)
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#0D0E14] border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Specs & Purchasing Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Title Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#D4AF37] font-bold tracking-[0.25em] uppercase mb-1">
                <span>{product.brand}</span>
                <span className="text-white/40 font-mono tracking-normal">{product.refNumber}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <StarRow rating={product.rating || 5} size="w-3.5 h-3.5" />
                <span className="text-xs text-white/50">
                  {product.rating} &bull; ({product.reviews || 42} verified collector reviews)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 rounded-2xl bg-[#0D0E14] border border-white/10 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-xs text-white/40 uppercase tracking-widest">USD</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-white/40 line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Installment terms */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>Or approx. <strong className="text-[#E5C378]">${monthlyEstimate}/mo</strong> with 0% APR</span>
                <span className="text-[0.65rem] text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded">
                  Wire / Escrow Available
                </span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                    added
                      ? "bg-emerald-500 text-[#090A0E]"
                      : "bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#090A0E] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)]"
                  }`}
                >
                  {added ? (
                    <>
                      <svg className="w-4 h-4 text-[#090A0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Added to Vault Bag</span>
                    </>
                  ) : (
                    <span>Add to Vault Bag</span>
                  )}
                </button>

                {/* Wishlist Icon Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Toggle wishlist"
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all ${
                    inWishlist
                      ? "bg-[#D4AF37] text-[#090A0E] border-[#D4AF37]"
                      : "bg-[#0D0E14] text-white/70 hover:text-white border-white/15 hover:border-[#D4AF37]"
                  }`}
                >
                  <svg className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 rounded-xl border border-white/20 hover:border-[#D4AF37] bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all"
              >
                Express Checkout
              </button>
            </div>

            {/* Quick Assurance Strip */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-[#0D0E14] border border-white/5 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[0.7rem] text-white/70">In Vault &bull; Ships in 24h</span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D0E14] border border-white/5 flex items-center gap-2.5">
                <svg className="w-4 h-4 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[0.7rem] text-white/70">2-Year Full Warranty</span>
              </div>
            </div>

            {/* Provenance Narrative */}
            <div className="pt-4">
              <h4 className="text-xs font-bold tracking-widest uppercase text-[#D4AF37] mb-2">
                Horological Provenance
              </h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION: FULL SPECS TABLE & AUTHENTICATION TRUST ── */}
        <div className="grid lg:grid-cols-12 gap-10 pt-10 border-t border-white/10">
          {/* Specs Table (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display text-2xl font-bold text-white">
                Technical Specifications
              </h3>
              <span className="text-xs text-[#D4AF37] tracking-wider uppercase font-semibold">
                Factory Master Specs
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0D0E14] overflow-hidden">
              <table className="w-full text-xs text-left">
                <tbody>
                  {[
                    ["Brand", product.brand],
                    ["Reference Number", product.refNumber || "N/A"],
                    ["Model Series", product.name],
                    ["Condition", `${product.condition} (Guaranteed Flawless Mechanism)`],
                    ["Case Diameter", product.specs?.caseSize || "41mm"],
                    ["Case Material", product.specs?.caseMaterial || product.caseMaterial],
                    ["Movement", product.specs?.movement || product.movement],
                    ["Power Reserve", product.specs?.powerReserve || "48+ Hours"],
                    ["Water Resistance", product.specs?.waterResistance || `${product.water || 50}m`],
                    ["Crystal", product.specs?.crystal || "Sapphire Crystal with Anti-Reflective Coating"],
                    ["Strap / Bracelet", product.specs?.bracelet || "Original Integrated Bracelet"],
                    ["Box & Papers", product.specs?.boxPapers || product.boxPapers || "Complete Set"],
                    ["Warranty", product.specs?.warranty || "2-Year Chronolux Certified Warranty"]
                  ].map(([k, v], idx) => (
                    <tr
                      key={k}
                      className={`border-b border-white/5 ${idx % 2 === 0 ? "bg-white/[0.01]" : "bg-white/[0.02]"}`}
                    >
                      <th className="py-3 px-4 font-semibold text-white/50 w-2/5 uppercase tracking-wider text-[0.68rem]">
                        {k}
                      </th>
                      <td className="py-3 px-4 text-white/90 font-medium">
                        {v}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Authentication & Warranty Trust Section (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-display text-2xl font-bold text-white">
                Authentication &amp; Warranty
              </h3>
              <p className="text-xs text-white/40 mt-1">Our unconditional pledge to every collector</p>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0F1118] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4 className="font-bold text-sm text-white">30-Point Horological Inspection</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed pl-7">
                  Every movement undergoes pressure testing, timegrapher amplitude calibration, and examination under 10x magnification by Swiss-certified horologists.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1118] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11a7.96 7.96 0 00.99 3.868" />
                  </svg>
                  <h4 className="font-bold text-sm text-white">Global Registry Verification</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed pl-7">
                  All serial numbers are vetted against the Watch Register and global loss databases to ensure untarnished provenance and clear legal title.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1118] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-bold text-sm text-white">2-Year Full Mechanical Warranty</h4>
                </div>
                <p className="text-xs text-white/60 leading-relaxed pl-7">
                  Should any mechanical irregularity occur, our Geneva service workshop handles all repairs using exclusively genuine components at zero charge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION: RELATED WATCHES CAROUSEL ── */}
        {related.length > 0 && (
          <div className="pt-12 border-t border-white/10 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-[#D4AF37] uppercase tracking-[0.25em] font-semibold">
                  Complementary References
                </p>
                <h3 className="font-display text-3xl font-bold text-white mt-1">
                  Similar Timepieces You May Admire
                </h3>
              </div>
              <button
                onClick={() => setPage("collection")}
                className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-semibold hidden sm:inline"
              >
                View Complete Vault &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onProductClick && onProductClick(rel.id)}
                  className="bg-[#0D0E14] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-square bg-[#050608] relative overflow-hidden flex items-center justify-center">
                    <WatchImage
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-[#090A0E]/90 text-white text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full border border-white/10 uppercase">
                      {rel.brand}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-sm text-white group-hover:text-[#E5C378] transition-colors line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-[#D4AF37] font-bold">
                      ${rel.price.toLocaleString()} USD
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

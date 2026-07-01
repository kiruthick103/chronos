import { useState } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

const filters = ["All", "Best Sellers", "New Arrivals", "Under $5K", "Luxury"];

function SkeletonCard() {
  return (
    <div className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 skeleton"/>
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20 rounded"/>
        <div className="skeleton h-4 w-32 rounded"/>
        <div className="skeleton h-3 w-24 rounded"/>
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-5 w-16 rounded"/>
          <div className="skeleton w-9 h-9 rounded-full"/>
        </div>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-3 h-3" viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#C9A84C" : "none"}
          stroke="#C9A84C" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

export default function Products({ onProductClick }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const { addToCart, toggleWishlist, wishlist, products } = useCart();
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(null);

  const filtered = products.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Best Sellers") return p.rating >= 4.9;
    if (activeFilter === "New Arrivals") return p.reviews < 60 || p.originalPrice === null;
    if (activeFilter === "Under $5K") return p.price < 5000;
    if (activeFilter === "Luxury") return p.price >= 5000;
    return true;
  });

  const handleFilter = (f) => {
    if (f === activeFilter) return;
    setLoading(true);
    setActiveFilter(f);
    setTimeout(() => setLoading(false), 450);
  };

  const handleToggleWishlist = (product, e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const fmt = (n) => `$${n.toLocaleString()}`;

  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8 bg-[#0D0D14]" aria-labelledby="products-heading">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="animate-fade-up">
            <p className="text-[#C9A84C] text-[0.68rem] tracking-[0.3em] uppercase font-semibold mb-3">Handpicked For You</p>
            <h2 id="products-heading" className="font-display text-4xl sm:text-5xl font-bold text-white">
              Featured <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Timepieces</span>
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-2 flex-wrap animate-fade-up" role="tablist">
            {filters.map(f => (
              <button
                key={f}
                role="tab"
                aria-selected={activeFilter === f}
                onClick={() => handleFilter(f)}
                className={`px-4 py-2 rounded-full text-[0.68rem] tracking-widest uppercase font-semibold transition-all duration-300 ${
                  activeFilter === f
                    ? "bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-[#0A0A0F] shadow-[0_0_20px_rgba(201,168,76,0.35)]"
                    : "bg-white/4 text-white/40 border border-white/8 hover:bg-white/8 hover:text-white/70 hover:border-white/15"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({length:8}).map((_,i) => <SkeletonCard key={i}/>)
            : filtered.map((product, i) => {
                const inCart = addedToCart === product.id;
                const inWish = wishlist.find(item => item.id === product.id);

              return (
                <article
                  key={product.id}
                  className="group relative bg-[#111118] border border-white/5 rounded-2xl overflow-hidden card-hover animate-fade-up cursor-pointer"
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => onProductClick && onProductClick(product.id)}
                >
                  {/* Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#F87171] text-white rounded-full text-[0.62rem] font-black tracking-widest uppercase">
                      Sale
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    aria-label={inWish ? "Remove from wishlist" : "Add to wishlist"}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/8 hover:border-white/20 transition-all duration-200 group/heart"
                  >
                    <svg className={`w-4 h-4 transition-all duration-200 ${inWish ? "scale-110" : "group-hover/heart:scale-110"}`}
                      fill={inWish ? "#F87171" : "none"} viewBox="0 0 24 24"
                      stroke={inWish ? "#F87171" : "rgba(255,255,255,0.5)"} strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>

                  {/* Watch image */}
                  <div className="relative h-52 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)` }}>
                    <WatchImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      fallbackSize="text-6xl"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[0.6rem] text-white/25 tracking-[0.2em] uppercase font-medium">{product.brand}</p>
                      <span className="text-[0.6rem] text-white/20">#{String(product.id).padStart(4,'0')}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm leading-snug mb-2.5 group-hover:text-[#F0D080] transition-colors duration-300">{product.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={product.rating}/>
                      <span className="text-white/25 text-[0.62rem]">{product.rating.toFixed(1)}</span>
                      <span className="text-white/15 text-[0.62rem]">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-lg leading-none">{fmt(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-white/25 text-xs line-through mt-0.5">{fmt(product.originalPrice)}</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        aria-label={inCart ? "Added to cart" : "Add to cart"}
                        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          inCart
                            ? "bg-green-500/20 border border-green-500/40 scale-95"
                            : "hover:scale-110 hover:shadow-lg"
                        }`}
                        style={!inCart ? { background:`#C9A84C18`, border:`1px solid #C9A84C35` } : {}}
                      >
                        {inCart ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 13l4 4L19 7"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="1.8">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          }
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <button className="btn-ghost px-10 py-3.5 text-[#C9A84C] text-[0.72rem] tracking-[0.2em] uppercase font-bold rounded-sm inline-flex items-center gap-2.5 group">
            View All {products.length}+ Timepieces
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

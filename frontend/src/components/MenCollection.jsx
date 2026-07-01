import { useState } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";


const styles = [
  { id: "all", name: "All Styles", icon: "🎯" },
  { id: "dress", name: "Dress", icon: "🎩", desc: "Formal elegance" },
  { id: "sport", name: "Sport", icon: "⛰", desc: "Adventure ready" },
  { id: "chrono", name: "Chronograph", icon: "⏱", desc: "Precision timing" },
  { id: "smart", name: "Smart", icon: "📱", desc: "Connected" },
];

export default function MenCollection({ onProductClick }) {
  const [selected, setSelected] = useState("all");
  const [sort, setSort] = useState("relevant");
  const { addToCart, toggleWishlist, wishlist, products } = useCart();
  const [addedToCart, setAddedToCart] = useState(null);

  const menWatches = products.filter(p => p.gender === "men" || p.name === "Rose Pavé Edition");
  const filtered = selected === "all" ? menWatches : menWatches.filter(w => w.style === selected);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="mb-14 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4">
            Men's <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Collection</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Precision instruments crafted for the modern man. From boardroom elegance to adventure expeditions.
          </p>
        </div>

        {/* Style filters */}
        <div className="flex overflow-x-auto gap-3 mb-12 pb-2 scrollbar-hide">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                selected === s.id
                  ? "bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-[#0A0A0F] shadow-lg"
                  : "bg-white/[0.05] border border-white/10 text-white/60 hover:text-white hover:border-[#C9A84C]/40"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-sm tracking-wider uppercase">{s.name}</span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-white/40 text-sm">{sorted.length} watches available</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded-sm focus:border-[#C9A84C] focus:outline-none self-start sm:self-auto"
          >
            <option value="relevant">Most Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((w, i) => {
            const inWish = wishlist.find(item => item.id === w.id);
            return (
              <div
                key={w.id}
                className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden card-hover group animate-fade-up cursor-pointer"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => onProductClick && onProductClick(w.id)}
              >
                <div className="h-48 bg-gradient-to-br from-[#C9A84C]/15 to-transparent flex items-center justify-center relative overflow-hidden">
                  <WatchImage
                    src={w.image}
                    alt={w.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    fallbackSize="text-6xl"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(w); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 transition-all group/heart"
                  >
                    <svg className={`w-4 h-4 transition-all duration-200 ${inWish ? "fill-[#EF4444] stroke-[#EF4444]" : "stroke-white/50"}`} fill="none" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  <p className="text-xs text-white/25 tracking-widest uppercase mb-1">{w.brand}</p>
                  <h3 className="text-white font-bold text-sm mb-2 group-hover:text-[#C9A84C] transition-colors">{w.name}</h3>
                  <p className="text-[#C9A84C] text-xs font-semibold mb-3 tracking-wider">{w.feature}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-black text-lg">${w.price.toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(w, 1);
                        setAddedToCart(w.id);
                        setTimeout(() => setAddedToCart(null), 1500);
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        addedToCart === w.id
                          ? "bg-green-500/20 border border-green-500/40"
                          : "bg-[#C9A84C]/15 border border-[#C9A84C]/30 hover:bg-[#C9A84C]/25"
                      }`}
                    >
                      {addedToCart === w.id ? (
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 13l4 4L19 7"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

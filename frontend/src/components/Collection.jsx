import { useState } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

const collectionCategories = [
  { id: "dress", name: "Dress Watches", desc: "Elegant minimalism for formal occasions", icon: "🎩" },
  { id: "dive", name: "Dive Watches", desc: "Built for depth, perfected on land", icon: "🏊" },
  { id: "chrono", name: "Chronographs", desc: "Racing-bred precision, everyday elegance", icon: "⏱" },
  { id: "smart", name: "Smart Luxury", desc: "Connected intelligence, refined form", icon: "📱" },
];

export default function Collection({ onProductClick, initialCategory = null }) {
  const [selected, setSelected] = useState(initialCategory);
  const [sort, setSort] = useState("relevant");
  const { addToCart, products } = useCart();
  const [addedToCart, setAddedToCart] = useState(null);

  const filtered = selected ? products.filter(p => p.style === selected) : products;
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4">
            The Complete <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Collection</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Curated selections from the world's most prestigious watchmakers. Every piece authenticated and guaranteed.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 mb-16">
          <button
            onClick={() => setSelected(null)}
            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group text-left ${
              selected === null
                ? "border-[#C9A84C] bg-[#C9A84C]/15"
                : "border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/50"
            }`}
          >
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-white font-bold text-lg mb-1">All Watches</h3>
            <p className="text-white/40 text-sm">{products.length} pieces</p>
          </button>

          {collectionCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group text-left ${
                selected === cat.id
                  ? "border-[#C9A84C] bg-[#C9A84C]/15"
                  : "border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/50"
              }`}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-white font-bold text-lg mb-1">{cat.name}</h3>
              <p className="text-white/40 text-sm">{products.filter(w => w.style === cat.id).length} pieces</p>
            </button>
          ))}
        </div>

        {/* Sort & view options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-white/40 text-sm">{sorted.length} watches found</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-sm focus:border-[#C9A84C] focus:outline-none"
          >
            <option value="relevant">Most Relevant</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map((w, i) => (
            <div
              key={w.id}
              onClick={() => onProductClick && onProductClick(w.id)}
              className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden card-hover animate-fade-up group cursor-pointer"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="h-48 bg-gradient-to-br from-[#C9A84C]/10 to-transparent flex items-center justify-center overflow-hidden relative">
                <WatchImage
                  src={w.image}
                  alt={w.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackSize="text-4xl"
                />
              </div>
              <div className="p-5">
                <p className="text-xs text-white/25 tracking-widest uppercase mb-1">{w.brand}</p>
                <h3 className="text-white font-bold text-sm mb-3 group-hover:text-[#C9A84C] transition-colors">{w.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-white font-black text-lg">${w.price.toLocaleString()}</span>
                  <button
                    onClick={(e) => handleAddToCart(e, w)}
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
          ))}
        </div>
      </div>
    </div>
  );
}

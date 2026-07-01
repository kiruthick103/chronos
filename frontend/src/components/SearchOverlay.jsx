import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

export default function SearchOverlay({ isOpen, onClose, setPage, onProductClick }) {
  const { products } = useCart();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0F]/95 backdrop-blur-xl animate-fade-in">
      <div className="max-w-4xl mx-auto px-6 pt-24">
        <div className="flex items-center justify-between mb-12">
          <div className="relative flex-1 mr-8">
            <svg
              className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-[#C9A84C]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Search timepieces, brands, categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-10 text-2xl text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C] transition-colors"
            />
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
            {results.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  if (onProductClick) {
                    onProductClick(p.id);
                  } else {
                    setPage("collection");
                  }
                  onClose();
                }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#C9A84C]/30 hover:bg-white/10 transition-all group text-left"
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                  <WatchImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" fallbackSize="text-2xl" />
                </div>
                <div>
                  <p className="text-[0.65rem] text-white/30 tracking-[0.2em] uppercase mb-1">{p.brand}</p>
                  <h3 className="text-white font-bold text-sm mb-1">{p.name}</h3>
                  <p className="text-[#C9A84C] font-black text-sm">${p.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        ) : query.trim().length > 1 ? (
          <p className="text-white/30 text-center py-20">No matching timepieces found.</p>
        ) : (
          <div className="animate-fade-up">
            <h4 className="text-white/40 text-xs font-black tracking-[0.3em] uppercase mb-6">Popular Categories</h4>
            <div className="flex flex-wrap gap-3">
              {["Rolex", "Patek Philippe", "Omega", "Dive Watches", "Chronographs"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQuery(cat)}
                  className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-semibold hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-all"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

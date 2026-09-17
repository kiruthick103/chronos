import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

export default function Wishlist({ onProductClick, setPage }) {
  const { wishlist, toggleWishlist, addToCart, cart } = useCart();

  return (
    <div className="min-h-screen pt-32 pb-16 px-5 sm:px-8 bg-[#090A0E]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fade-up flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <span className="text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#EF4444]">
                Collector's Curation
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold text-white mb-2">
              My <span className="bg-gradient-to-r from-[#EF4444] to-[#F87171] bg-clip-text text-transparent">Wishlist</span>
            </h1>
            <p className="text-white/50 text-base max-w-2xl font-light">
              Your hand-selected vault of exceptional luxury timepieces.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-4 py-2 rounded-full">
              {wishlist.length} {wishlist.length === 1 ? "Timepiece" : "Timepieces"}
            </span>
          </div>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((w, i) => {
              const inCart = cart.find(item => item.id === w.id);
              return (
                <div
                  key={w.id}
                  className="bg-[#0F1118] border border-white/8 hover:border-[#D4AF37]/40 rounded-2xl overflow-hidden card-hover animate-fade-up group cursor-pointer transition-all duration-300"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => onProductClick && onProductClick(w.id)}
                >
                  <div className="h-56 bg-gradient-to-br from-white/[0.02] to-white/[0.06] flex items-center justify-center overflow-hidden relative p-4">
                    <WatchImage
                      src={w.image}
                      alt={w.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      fallbackSize="text-4xl"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(w);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-[#EF4444] hover:bg-black/80 border border-white/10 transition-colors shadow-lg"
                      aria-label="Remove from Wishlist"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    {w.condition && (
                      <span className="absolute bottom-3 left-3 text-[0.62rem] font-bold tracking-widest uppercase text-white/70 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10">
                        {w.condition}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <p className="text-[0.68rem] text-[#D4AF37] tracking-[0.2em] uppercase font-bold">{w.brand}</p>
                      <h3 className="text-white font-bold text-sm truncate group-hover:text-[#E5C378] transition-colors">{w.name}</h3>
                      {w.refNumber && (
                        <p className="text-[0.68rem] text-white/40 font-mono mt-0.5">{w.refNumber}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <span className="text-white font-black text-base">${w.price?.toLocaleString()}</span>
                        {w.originalPrice && w.originalPrice > w.price && (
                          <span className="text-[0.68rem] text-white/30 line-through block">
                            ${w.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(w, 1);
                        }}
                        className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                          inCart
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-[#C5A059] hover:bg-[#D4AF37] text-[#090A0E]"
                        }`}
                      >
                        {inCart ? "In Bag" : "Add to Bag"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center animate-fade-up max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#EF4444]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              Explore our certified vault of rare and iconic timepieces. Save your favorites to track market value and availability.
            </p>
            <button
              onClick={() => {
                if (setPage) setPage("collection");
                else window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#C5A059] text-[#090A0E] text-xs font-black tracking-[0.2em] uppercase rounded-xl hover:opacity-90 shadow-[0_4px_24px_rgba(212,175,55,0.25)] transition-all"
            >
              Explore Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

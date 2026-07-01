import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

export default function Wishlist({ onProductClick }) {
  const { wishlist, toggleWishlist, addToCart, cart } = useCart();

  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4">
            My <span className="bg-gradient-to-r from-[#EF4444] to-[#F87171] bg-clip-text text-transparent">Wishlist</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Your curated selection of exceptional timepieces.
          </p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((w, i) => {
              const inCart = cart.find(item => item.id === w.id);
              return (
                <div
                  key={w.id}
                  className="bg-[#111118] border border-white/5 rounded-2xl overflow-hidden card-hover animate-fade-up group cursor-pointer"
                  style={{ animationDelay: `${i * 0.05}s` }}
                  onClick={() => onProductClick && onProductClick(w.id)}
                >
                  <div className="h-48 bg-gradient-to-br from-[#EF4444]/10 to-transparent flex items-center justify-center overflow-hidden relative">
                    <WatchImage
                      src={w.image}
                      alt={w.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackSize="text-4xl"
                    />
                    <button
                      onClick={() => toggleWishlist(w)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-[#EF4444] border border-white/10"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-white/25 tracking-widest uppercase mb-1">{w.brand}</p>
                    <h3 className="text-white font-bold text-sm mb-3 group-hover:text-[#C9A84C] transition-colors">{w.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-black text-lg">${w.price.toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(w, 1)}
                        className={`px-4 py-2 rounded-sm text-xs font-bold transition-all ${
                          inCart
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "btn-gold text-[#0A0A0F]"
                        }`}
                      >
                        {inCart ? "In Cart" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center animate-fade-up">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your wishlist is empty</h2>
            <p className="text-white/40 mb-8">Start exploring and save your favorite timepieces here.</p>
            <button
              onClick={() => window.location.reload()} // Simplest way to go back or handle in App
              className="btn-gold px-8 py-3 text-[#0A0A0F] text-sm font-black tracking-widest uppercase rounded-sm"
            >
              Browse Collection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

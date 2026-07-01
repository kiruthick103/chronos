import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Products from "./components/Products";
import OfferBanner from "./components/OfferBanner";
import Reviews from "./components/Reviews";
import Footer from "./components/Footer";
import WatchFinder from "./components/WatchFinder";
import Collection from "./components/Collection";
import BrandsPage from "./components/BrandsPage";
import MenCollection from "./components/MenCollection";
import WomenCollection from "./components/WomenCollection";
import About from "./components/About";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import AdminPanel from "./components/AdminPanel";
import ProductDetail from "./components/ProductDetail";


// Page loader
function PageLoader({ done }) {
  return (
    <div
      className={`fixed inset-0 z-[999] bg-[#0A0A0F] flex flex-col items-center justify-center transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border border-[#C9A84C]/20 animate-pulse-ring" />
        <svg viewBox="0 0 64 64" className="absolute inset-0 w-16 h-16 animate-spin" style={{animationDuration:"3s"}}>
          <circle cx="32" cy="32" r="28" fill="none" stroke="url(#loaderGold)" strokeWidth="1.5" strokeDasharray="40 140" strokeLinecap="round"/>
          <defs>
            <linearGradient id="loaderGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C9A84C"/>
              <stop offset="100%" stopColor="#F0D080"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#C9A84C" strokeWidth="1.5"/>
            <path d="M12 7v5l3 3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <span className="text-xs text-[#C9A84C]/60 tracking-[0.4em] uppercase font-medium">Chronolux</span>
    </div>
  );
}

// Scroll-to-top button
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-6 z-40 w-11 h-11 rounded-full btn-gold flex items-center justify-center shadow-xl transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <svg className="w-5 h-5 text-[#0A0A0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageLoader done={loaded} />
      <div className="bg-[#0A0A0F] text-white font-sans">
        <Navbar currentPage={page} setPage={setPage} onProductClick={handleProductClick} />
        <main>
          {page === "home" && (
            <>
              <Hero setPage={setPage} />
              <Brands />
              <Categories />
              <Products onProductClick={handleProductClick} />
              <OfferBanner />
              <Reviews />
            </>
          )}
          {page === "finder" && <WatchFinder setPage={setPage} onProductClick={handleProductClick} />}
          {page === "collection" && <Collection onProductClick={handleProductClick} />}
          {page === "brands" && <BrandsPage />}
          {page === "men" && <MenCollection onProductClick={handleProductClick} />}
          {page === "women" && <WomenCollection onProductClick={handleProductClick} />}
          {page === "about" && <About />}
          {page === "cart" && <Cart />}
          {page === "wishlist" && <Wishlist onProductClick={handleProductClick} />}
          {page === "admin" && <AdminPanel />}
          {page === "detail" && <ProductDetail productId={selectedProductId} setPage={setPage} onProductClick={handleProductClick} />}
        </main>
        <Footer setPage={setPage} />
      </div>
      <ScrollTop />
    </>
  );
}

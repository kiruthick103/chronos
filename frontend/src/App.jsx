import { useState, useEffect, Suspense, lazy } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import Products from "./components/Products";
import OfferBanner from "./components/OfferBanner";
import Reviews from "./components/Reviews";
import NewsletterSignup from "./components/NewsletterSignup";
import Footer from "./components/Footer";
import AuthLoader from "./components/AuthLoader";
import SoftAurora from "./components/SoftAurora";
import ProtectedRoute from "./components/ProtectedRoute";

// Dynamic page imports for bundle optimization
const WatchFinder = lazy(() => import("./components/WatchFinder"));
const Collection = lazy(() => import("./components/Collection"));
const BrandsPage = lazy(() => import("./components/BrandsPage"));
const MenCollection = lazy(() => import("./components/MenCollection"));
const WomenCollection = lazy(() => import("./components/WomenCollection"));
const About = lazy(() => import("./components/About"));
const SellWatch = lazy(() => import("./components/SellWatch"));
const Contact = lazy(() => import("./components/Contact"));
const Cart = lazy(() => import("./components/Cart"));
const Wishlist = lazy(() => import("./components/Wishlist"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Profile = lazy(() => import("./components/Profile"));

// ─── Splash loader (shown on first site entry) ────────────────────────────────
function PageLoader({ done }) {
  return (
    <div
      className={`fixed inset-0 z-[999] bg-[#07070A] flex flex-col items-center justify-center transition-opacity duration-700 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/20 animate-pulse-ring" />
        <svg
          viewBox="0 0 64 64"
          className="absolute inset-0 w-16 h-16 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <circle
            cx="32" cy="32" r="28"
            fill="none" stroke="url(#loaderGold)"
            strokeWidth="1.5" strokeDasharray="40 140" strokeLinecap="round"
          />
          <defs>
            <linearGradient id="loaderGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C5A059" />
              <stop offset="100%" stopColor="#F5E2B3" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#D4AF37" strokeWidth="1.5" />
            <path d="M12 7v5l3 3" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <span className="font-display text-xs text-[#D4AF37] tracking-[0.4em] uppercase font-bold">
        Chronolux Geneva
      </span>
    </div>
  );
}

// ─── Scroll-to-top button ─────────────────────────────────────────────────────
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C5A059] flex items-center justify-center shadow-2xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0 hover:scale-110" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg className="w-5 h-5 text-[#090A0E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

// ─── Main app content ────────────────────────────────────────────────────────
function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [collectionFilter, setCollectionFilter] = useState(null);
  const [page, setPage] = useState(() => {
    if (window.location.pathname === "/admin") {
      return "admin";
    }
    return "home";
  });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [siteLoaded, setSiteLoaded] = useState(true);

  // Sync page changes to browser URL path
  useEffect(() => {
    if (page === "admin") {
      if (window.location.pathname !== "/admin") {
        window.history.pushState(null, "", "/admin");
      }
    } else if (page !== "login" && page !== "signup") {
      if (window.location.pathname !== "/") {
        window.history.pushState(null, "", "/");
      }
    }
  }, [page]);

  // Handle admin route protection
  useEffect(() => {
    if (page === "admin" && !loading) {
      if (!user) {
        setPage("login");
      } else if (!isAdmin) {
        setPage("home");
        window.history.replaceState(null, "", "/");
      }
    }
  }, [page, user, loading, isAdmin]);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectFilter = (filter) => {
    setCollectionFilter(filter);
    setPage("collection");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auth resolving spinner
  if (loading) return <AuthLoader />;

  // Dedicated Auth Views (Login / Signup)
  if (page === "login" || page === "signup") {
    return (
      <div className="bg-[#07070A] text-white font-sans min-h-screen relative overflow-hidden flex flex-col justify-center">
        <div className="fixed inset-0 pointer-events-none z-0 opacity-25">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={1}
            color1="#C5A059"
            color2="#7A1C1C"
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction
            mouseInfluence={0.25}
          />
        </div>

        {/* Back to store navigation */}
        <div className="relative z-20 max-w-md mx-auto w-full px-6 pt-6">
          <button
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#D4AF37] hover:underline"
          >
            &larr; Return to Chronolux Store
          </button>
        </div>

        <div className="relative z-10 flex-grow flex items-center justify-center py-8">
          <Suspense fallback={<AuthLoader />}>
            {page === "signup" ? (
              <Signup setPage={setPage} />
            ) : (
              <Login setPage={setPage} />
            )}
          </Suspense>
        </div>
      </div>
    );
  }

  // Full Store Experience (Works for both Guests and Authenticated Collectors)
  return (
    <div className="bg-[#090A0E] text-white font-sans min-h-screen relative overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <SoftAurora
          speed={0.4}
          scale={1.5}
          brightness={0.8}
          color1="#C5A059"
          color2="#3A1C6A"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={0.8}
          enableMouseInteraction
          mouseInfluence={0.2}
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <PageLoader done={siteLoaded} />
        {page !== "admin" && (
          <Navbar
            currentPage={page}
            setPage={setPage}
            onProductClick={handleProductClick}
            onSelectFilter={handleSelectFilter}
          />
        )}
        <main className="flex-grow">
          <Suspense fallback={<AuthLoader />}>
            {page === "home" && (
              <>
                <Hero setPage={setPage} />
                <Brands />
                <Categories setPage={setPage} setCollectionCategory={(filter) => handleSelectFilter(typeof filter === 'object' && filter !== null ? filter : { category: filter })} />
                <Products onProductClick={handleProductClick} />
                <OfferBanner />
                <Reviews />
                <NewsletterSignup />
              </>
            )}
            {page === "finder" && (
              <WatchFinder setPage={setPage} onProductClick={handleProductClick} />
            )}
            {page === "collection" && (
              <Collection
                onProductClick={handleProductClick}
                initialFilter={collectionFilter}
              />
            )}
            {page === "brands" && <BrandsPage />}
            {page === "men" && <MenCollection onProductClick={handleProductClick} />}
            {page === "women" && <WomenCollection onProductClick={handleProductClick} />}
            {page === "about" && <About />}
            {page === "sell" && <SellWatch setPage={setPage} />}
            {page === "contact" && <Contact />}
            {page === "cart" && <Cart />}
            {page === "wishlist" && <Wishlist onProductClick={handleProductClick} setPage={setPage} />}
            {page === "admin" && (
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            )}
            {page === "detail" && (
              <ProductDetail
                productId={selectedProductId}
                setPage={setPage}
                onProductClick={handleProductClick}
              />
            )}
            {page === "profile" && (
              <ProtectedRoute>
                <Profile setPage={setPage} />
              </ProtectedRoute>
            )}
          </Suspense>
        </main>
        {page !== "admin" && <Footer setPage={setPage} />}
        <ScrollTop />
      </div>
    </div>
  );
}

// ─── Root Provider ────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

import { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
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
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import AuthLoader from "./components/AuthLoader";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Splash loader (shown on first site entry) ────────────────────────────────
function PageLoader({ done }) {
  return (
    <div
      className={`fixed inset-0 z-[999] bg-[#0A0A0F] flex flex-col items-center justify-center transition-opacity duration-700 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border border-[#C9A84C]/20 animate-pulse-ring" />
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
              <stop offset="0%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#F0D080" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="#C9A84C" strokeWidth="1.5" />
            <path d="M12 7v5l3 3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <span className="text-xs text-[#C9A84C]/60 tracking-[0.4em] uppercase font-medium">
        Chronolux
      </span>
    </div>
  );
}

// ─── Scroll-to-top button ─────────────────────────────────────────────────────
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
      className={`fixed bottom-8 right-6 z-40 w-11 h-11 rounded-full btn-gold flex items-center justify-center shadow-xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <svg className="w-5 h-5 text-[#0A0A0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}

// ─── Main app content — reads auth state to decide what to show ───────────────
function AppContent() {
  const { user, loading, isAdmin } = useAuth();
  const [page, setPage] = useState("login");          // default to login
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [siteLoaded, setSiteLoaded] = useState(false); // splash for main site

  // Verify backend connectivity and log results to the console
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (!apiUrl) {
      console.warn("⚠️ VITE_API_URL environment variable is not defined.");
      console.error(
        "❌ Backend Connection Failed\n" +
        "Reason: Missing environment variable VITE_API_URL.\n" +
        "Fix: Please create/verify the .env file in the React project root with VITE_API_URL " +
        "pointing to your backend (locally) or set it in the Vercel dashboard (production)."
      );
      return;
    }

    fetch(`${apiUrl}/api/test`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Backend Connected Successfully");
        console.log("Backend Response:", data);
      })
      .catch((err) => {
        console.error("❌ Backend Connection Failed");
        console.error(err);
        
        // Automated diagnostic helper in the console
        console.group("🔍 Diagnostic Analysis:");
        console.log(`- API Endpoint checked: ${apiUrl}/api/test`);
        console.log("- Possible issues to check:");
        console.log("  1. Cold Start: Render free plans spin down after 15 mins of inactivity. It can take ~50 seconds to boot back up. Try refreshing the page.");
        console.log("  2. CORS Policy: Check if CORS package is enabled in the backend using \`app.use(cors())\`.");
        console.log("  3. Mixed Content: If the site is HTTPS (Vercel) and backend is HTTP, the browser will block the request. Ensure the backend URL starts with https://.");
        console.log("  4. Offline: Check if the Render service has been suspended or is currently rebuilding.");
        console.groupEnd();
      });
  }, []);

  // When user logs in, switch to home and start the splash timer
  useEffect(() => {
    if (user) {
      // If user was trying to access a protected page, redirect to that
      // For now, just go home
      setPage("home");
      setSiteLoaded(false);
      const t = setTimeout(() => setSiteLoaded(true), 1200);
      return () => clearTimeout(t);
    } else if (!loading) {
      // logged out → always go back to login
      setPage("login");
    }
  }, [user, loading]);

  // Protect admin route
  useEffect(() => {
    if (page === "admin" && !isAdmin) {
      setPage("home");
    }
  }, [page, isAdmin]);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 1️⃣ Still resolving session — show spinner
  if (loading) return <AuthLoader />;

  // 2️⃣ Not logged in — show only Login or Signup
  if (!user) {
    return (
      <div className="bg-[#0A0A0F] text-white font-sans">
        {page === "signup"
          ? <Signup setPage={setPage} />
          : <Login setPage={setPage} />
        }
      </div>
    );
  }

  // 3️⃣ Logged in — show full website
  return (
    <div className="bg-[#0A0A0F] text-white font-sans">
      <PageLoader done={siteLoaded} />
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
        {page === "finder"     && <WatchFinder setPage={setPage} onProductClick={handleProductClick} />}
        {page === "collection" && <Collection onProductClick={handleProductClick} />}
        {page === "brands"     && <BrandsPage />}
        {page === "men"        && <MenCollection onProductClick={handleProductClick} />}
        {page === "women"      && <WomenCollection onProductClick={handleProductClick} />}
        {page === "about"      && <About />}
        {page === "cart"       && (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )}
        {page === "wishlist"   && (
          <ProtectedRoute>
            <Wishlist onProductClick={handleProductClick} />
          </ProtectedRoute>
        )}
        {page === "admin"      && (
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        )}
        {page === "detail"     && (
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
      </main>
      <Footer setPage={setPage} />
      <ScrollTop />
    </div>
  );
}

// ─── Root — providers only, no logic ─────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

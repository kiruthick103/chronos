import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SearchOverlay from "./SearchOverlay";
import TrustBar from "./TrustBar";
import { brandsList, categoriesList } from "../data/products";

export default function Navbar({ currentPage, setPage, onProductClick, onSelectFilter }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const { cartCount, wishlistCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const megaMenuTimeoutRef = useRef(null);
  const accountRef = useRef(null);

  // Scroll listener for sticky header styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnterShop = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeaveShop = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200);
  };

  const navigateTo = (page, filter = null) => {
    if (filter && onSelectFilter) {
      onSelectFilter(filter);
    }
    setPage(page);
    setMegaMenuOpen(false);
    setMobileOpen(false);
    setAccountDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    setAccountDropdownOpen(false);
    await signOut();
    navigateTo("home");
  };

  return (
    <>
      <TrustBar />
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#090A0E]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-2xl py-2"
            : "bg-[#090A0E]/80 backdrop-blur-md border-b border-white/5 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo("home")}
            className="flex items-center gap-3 group text-left flex-shrink-0"
            aria-label="Chronolux Home"
          >
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#E5C378] via-[#C5A059] to-[#8A6A27] p-[1.5px] shadow-[0_0_15px_rgba(197,160,89,0.3)]">
              <div className="w-full h-full rounded-full bg-[#090A0E] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#D4AF37] group-hover:rotate-45 transition-transform duration-500">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-[0.2em] uppercase text-white leading-none">
                Chrono<span className="text-[#D4AF37]">lux</span>
              </span>
              <span className="text-[0.55rem] tracking-[0.35em] uppercase text-[#D4AF37]/70 font-medium mt-0.5">
                Geneva &bull; Paris &bull; New York
              </span>
            </div>
          </button>

          {/* Desktop Navigation with Mega Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Shop with Mega-Menu Trigger */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnterShop}
              onMouseLeave={handleMouseLeaveShop}
            >
              <button
                onClick={() => navigateTo("collection")}
                className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 py-1 ${
                  currentPage === "collection" ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
                }`}
                aria-expanded={megaMenuOpen}
              >
                <span>Shop</span>
                <svg
                  className={`w-3 h-3 text-[#D4AF37] transition-transform duration-300 ${
                    megaMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega-Menu Dropdown Panel */}
              {megaMenuOpen && (
                <div className="absolute top-full -left-24 w-[760px] bg-[#0D0E13] border border-[#D4AF37]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-6 grid grid-cols-3 gap-6 animate-fade-in z-50">
                  {/* Column 1: Browse by Brand */}
                  <div>
                    <h4 className="text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#D4AF37] mb-3 pb-2 border-b border-white/10">
                      Prestige Brands
                    </h4>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {brandsList.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => navigateTo("collection", { brand })}
                          className="text-left text-xs text-white/70 hover:text-[#E5C378] py-1 transition-colors block truncate"
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Browse by Category / Style */}
                  <div>
                    <h4 className="text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#D4AF37] mb-3 pb-2 border-b border-white/10">
                      Horological Styles
                    </h4>
                    <ul className="space-y-2">
                      {categoriesList.filter((c) => c !== "All").map((cat) => (
                        <li key={cat}>
                          <button
                            onClick={() => navigateTo("collection", { category: cat })}
                            className="text-left text-xs text-white/70 hover:text-[#E5C378] py-1 transition-colors flex items-center justify-between w-full"
                          >
                            <span>{cat}</span>
                            <span className="text-[0.65rem] text-[#D4AF37]/50">&rarr;</span>
                          </button>
                        </li>
                      ))}
                      <li className="pt-2">
                        <button
                          onClick={() => navigateTo("collection", { condition: "Vintage" })}
                          className="text-left text-xs text-[#E5C378] hover:underline font-medium block"
                        >
                          &bull; Vintage Curations
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigateTo("collection", { condition: "New" })}
                          className="text-left text-xs text-[#E5C378] hover:underline font-medium block"
                        >
                          &bull; Unworn &amp; New In Box
                        </button>
                      </li>
                    </ul>
                  </div>

                  {/* Column 3: Featured Horological Spotlight */}
                  <div className="bg-gradient-to-b from-[#14161F] to-[#0A0A0F] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full inline-block mb-2">
                        Curator's Choice
                      </span>
                      <h5 className="font-display text-sm font-bold text-white mb-1">
                        Rolex Cosmograph Daytona
                      </h5>
                      <p className="text-[0.7rem] text-white/50 mb-3">
                        Ref. 116500LN "Panda" — White Lacquer Dial with Cerachrom Bezel.
                      </p>
                      <div className="text-xs text-[#D4AF37] font-semibold mb-3">
                        $31,500 USD
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (onProductClick) onProductClick("rolex-daytona-116500ln");
                        else navigateTo("collection");
                        setMegaMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] text-[#090A0E] text-[0.72rem] font-bold tracking-wider uppercase transition-colors text-center"
                    >
                      View Timepiece
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Brands Nav */}
            <button
              onClick={() => navigateTo("brands")}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 py-1 ${
                currentPage === "brands" ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              }`}
            >
              Brands
            </button>

            {/* Sell Your Watch Nav */}
            <button
              onClick={() => navigateTo("sell")}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 py-1 relative ${
                currentPage === "sell" ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              }`}
            >
              <span>Sell Your Watch</span>
              <span className="absolute -top-2 -right-3 text-[0.55rem] font-bold text-[#090A0E] bg-[#D4AF37] px-1.5 py-0.2 rounded-full uppercase tracking-normal">
                Instant
              </span>
            </button>

            {/* About Nav */}
            <button
              onClick={() => navigateTo("about")}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 py-1 ${
                currentPage === "about" ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              }`}
            >
              About
            </button>

            {/* Contact Nav */}
            <button
              onClick={() => navigateTo("contact")}
              className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 py-1 ${
                currentPage === "contact" ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
              }`}
            >
              Contact
            </button>

            {/* Admin Link if Admin */}
            {isAdmin && (
              <button
                onClick={() => navigateTo("admin")}
                className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded hover:bg-[#D4AF37]/10 transition-colors"
              >
                Admin
              </button>
            )}
          </nav>

          {/* Action Icons: Search, Wishlist, Cart, Account */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search catalog"
              className="p-2 text-white/70 hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo("wishlist")}
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="p-2 text-white/70 hover:text-[#D4AF37] transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#C5A059] text-[#090A0E] text-[0.65rem] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigateTo("cart")}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="p-2 text-white/70 hover:text-[#D4AF37] transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#D4AF37] text-[#090A0E] text-[0.65rem] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Auth dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                aria-label="Account menu"
                className="p-2 text-white/70 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs text-[#E5C378] font-bold">
                  {user ? (user.email ? user.email[0].toUpperCase() : "U") : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Account Dropdown */}
              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#0D0E13] border border-[#D4AF37]/30 rounded-xl shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-[0.65rem] text-white/40 uppercase tracking-widest">Signed in as</p>
                        <p className="font-semibold text-white truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => navigateTo("profile")}
                        className="w-full text-left px-4 py-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-colors"
                      >
                        Account &amp; Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => navigateTo("admin")}
                          className="w-full text-left px-4 py-2 text-[#D4AF37] hover:bg-white/5 transition-colors font-medium"
                        >
                          Horological Admin
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/5 transition-colors"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="font-medium text-white">Guest Collector</p>
                        <p className="text-[0.68rem] text-white/50">Sign in to manage orders &amp; valuations</p>
                      </div>
                      <button
                        onClick={() => navigateTo("login")}
                        className="w-full text-left px-4 py-2 text-[#D4AF37] font-semibold hover:bg-white/5 transition-colors"
                      >
                        Sign In / Register
                      </button>
                      <button
                        onClick={() => navigateTo("sell")}
                        className="w-full text-left px-4 py-2 text-white/80 hover:bg-white/5 transition-colors"
                      >
                        Request Watch Valuation
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-white/80 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#090A0E] border-b border-[#D4AF37]/20 px-6 py-6 animate-fade-in text-sm space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Shop Collapsible in Mobile */}
            <div>
              <button
                onClick={() => setMobileShopExpanded(!mobileShopExpanded)}
                className="flex items-center justify-between w-full text-left font-semibold tracking-wider uppercase text-white py-2"
              >
                <span>Shop Catalog</span>
                <span className="text-[#D4AF37]">{mobileShopExpanded ? "−" : "+"}</span>
              </button>
              {mobileShopExpanded && (
                <div className="pl-4 py-2 space-y-3 border-l border-[#D4AF37]/20 mt-1">
                  <button
                    onClick={() => navigateTo("collection")}
                    className="block text-xs text-[#D4AF37] font-semibold"
                  >
                    &bull; View All 64+ Watches
                  </button>
                  <p className="text-[0.65rem] text-white/40 uppercase tracking-wider font-bold pt-1">
                    Featured Brands
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                    {brandsList.map((b) => (
                      <button
                        key={b}
                        onClick={() => navigateTo("collection", { brand: b })}
                        className="text-left py-1 hover:text-[#D4AF37]"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <p className="text-[0.65rem] text-white/40 uppercase tracking-wider font-bold pt-2">
                    By Category
                  </p>
                  <div className="space-y-1.5 text-xs text-white/70">
                    {categoriesList.filter((c) => c !== "All").map((c) => (
                      <button
                        key={c}
                        onClick={() => navigateTo("collection", { category: c })}
                        className="block py-1 hover:text-[#D4AF37]"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo("brands")}
              className="block w-full text-left font-semibold tracking-wider uppercase text-white/90 py-2 border-b border-white/5"
            >
              Prestige Brands
            </button>

            <button
              onClick={() => navigateTo("sell")}
              className="flex items-center justify-between w-full text-left font-semibold tracking-wider uppercase text-[#D4AF37] py-2 border-b border-white/5"
            >
              <span>Sell Your Watch</span>
              <span className="text-[0.6rem] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">
                Instant Valuation
              </span>
            </button>

            <button
              onClick={() => navigateTo("about")}
              className="block w-full text-left font-semibold tracking-wider uppercase text-white/90 py-2 border-b border-white/5"
            >
              About Chronolux
            </button>

            <button
              onClick={() => navigateTo("contact")}
              className="block w-full text-left font-semibold tracking-wider uppercase text-white/90 py-2 border-b border-white/5"
            >
              Concierge &amp; Contact
            </button>

            {isAdmin && (
              <button
                onClick={() => navigateTo("admin")}
                className="block w-full text-left font-semibold tracking-wider uppercase text-[#D4AF37] py-2"
              >
                Horological Admin Panel
              </button>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400 font-semibold uppercase tracking-wider"
                >
                  Sign Out ({user.email})
                </button>
              ) : (
                <button
                  onClick={() => navigateTo("login")}
                  className="w-full py-2.5 rounded-lg bg-[#C5A059] text-[#090A0E] text-center font-bold tracking-wider uppercase text-xs"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        setPage={setPage}
        onProductClick={onProductClick}
      />
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import SearchOverlay from "./SearchOverlay";

// Base nav links — Admin is added dynamically based on role
const BASE_NAV_LINKS = [
  { label: "Collection", page: "collection" },
  { label: "Brands", page: "brands" },
  { label: "Men", page: "men" },
  { label: "Women", page: "women" },
  { label: "About", page: "about" },
];

export default function Navbar({ currentPage, setPage, onProductClick }) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount, wishlistCount } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const dropdownRef = useRef(null);

  // Build nav links: admin link only for admins
  const navLinks = isAdmin
    ? [...BASE_NAV_LINKS, { label: "Admin", page: "admin", adminOnly: true }]
    : BASE_NAV_LINKS;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Account";

  // Scroll listener
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavClick = (page, e) => {
    e?.preventDefault();
    setPage(page);
    setOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0F]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(201,168,76,0.15)] py-0"
          : "bg-transparent py-2"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="#" onClick={(e) => handleNavClick("home", e)} className="flex items-center gap-2.5 group flex-shrink-0" aria-label="Chronolux home">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full bg-[#C9A84C]/20 scale-0 group-hover:scale-150 transition-transform duration-500" />
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-[0_0_12px_rgba(201,168,76,0.4)]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#0A0A0F" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <span className="text-[1.1rem] font-bold tracking-[0.18em] text-white uppercase leading-none">
            Chrono<span className="text-[#C9A84C]">lux</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-7" role="navigation">
          {navLinks.map(({ label, page, adminOnly }) => (
            <li key={label}>
              <a
                href="#"
                onClick={(e) => handleNavClick(page, e)}
                className={`relative text-[0.78rem] tracking-[0.18em] uppercase font-medium transition-colors duration-200 group ${
                  adminOnly
                    ? currentPage === page
                      ? "text-[#C9A84C]"
                      : "text-[#C9A84C]/50 hover:text-[#C9A84C]"
                    : currentPage === page
                    ? "text-[#C9A84C]"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {label}
                {adminOnly && (
                  <span className="ml-1.5 text-[8px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded-full font-black tracking-wider uppercase align-middle">A</span>
                )}
                <span className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[#C9A84C] to-[#F0D080] transition-all duration-300 ${currentPage === page ? "w-full" : "w-0 group-hover:w-full"}`} />
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={(e) => handleNavClick("finder", e)}
              className={`relative text-[0.78rem] tracking-[0.18em] uppercase font-medium transition-colors duration-200 group ${
                currentPage === "finder" ? "text-[#C9A84C]" : "text-white/55 hover:text-white"
              }`}
            >
              Find Your Watch
              <span className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-[#C9A84C] to-[#F0D080] transition-all duration-300 ${currentPage === "finder" ? "w-full" : "w-0 group-hover:w-full"}`} />
            </button>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-[#C9A84C] transition-colors duration-200 rounded-full hover:bg-white/5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <button
            onClick={(e) => handleNavClick("wishlist", e)}
            aria-label="Wishlist"
            className="hidden sm:flex relative w-9 h-9 items-center justify-center text-white/50 hover:text-[#EF4444] transition-colors duration-200 rounded-full hover:bg-white/5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EF4444] text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            onClick={(e) => handleNavClick("cart", e)}
            aria-label="Shopping cart"
            className="relative w-9 h-9 flex items-center justify-center text-white/50 hover:text-[#C9A84C] transition-colors duration-200 rounded-full hover:bg-white/5"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C9A84C] text-[#0A0A0F] text-[9px] font-black rounded-full flex items-center justify-center leading-none animate-pulse">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth Area — Desktop */}
          {user ? (
            /* User dropdown */
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 ml-1 px-3 py-1.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]/60 transition-all duration-200 group"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                {/* Avatar circle */}
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-[10px] font-black text-[#0A0A0F] uppercase flex-shrink-0">
                  {displayName.charAt(0)}
                </span>
                <span className="text-xs text-white/80 font-medium tracking-wide max-w-[100px] truncate group-hover:text-white transition-colors">
                  {displayName}
                </span>
                <svg
                  width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                  className={`text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className={`absolute right-0 top-full mt-2 w-48 bg-[#0D0D14] border border-white/10 rounded-xl shadow-2xl overflow-hidden transition-all duration-200 origin-top-right ${
                  dropdownOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/8">
                  <p className="text-xs text-white/40 tracking-wider uppercase">Signed in as</p>
                  <p className="text-sm text-white font-medium truncate mt-0.5">{displayName}</p>
                  <p className="text-xs text-white/30 truncate">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    id="dropdown-profile-btn"
                    onClick={() => handleNavClick("profile")}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/65 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </button>

                  {/* Admin Panel shortcut — only for admins */}
                  {isAdmin && (
                    <button
                      id="dropdown-admin-btn"
                      onClick={() => handleNavClick("admin")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#C9A84C]/70 hover:text-[#C9A84C] hover:bg-[#C9A84C]/5 transition-colors text-left"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      Admin Panel
                    </button>
                  )}

                  <div className="border-t border-white/8 my-1" />

                  <button
                    id="dropdown-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Login / Sign Up links */
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <button
                id="nav-login-btn"
                onClick={() => handleNavClick("login")}
                className="px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-white/60 hover:text-white transition-colors duration-200"
              >
                Login
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => handleNavClick("signup")}
                className="px-4 py-2 text-xs font-black tracking-[0.12em] uppercase rounded-sm btn-gold text-[#0A0A0F]"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="lg:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors ml-1"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {open
                ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" d="M4 6h16M4 12h10M4 18h16"/>}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${open ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="bg-[#0D0D14] border-t border-[#C9A84C]/10 px-6 py-6 flex flex-col gap-1">

          {/* Mobile user info or login links */}
          {user ? (
            <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/8">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-sm font-black text-[#0A0A0F] uppercase flex-shrink-0">
                {displayName.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-white font-medium truncate">{displayName}</p>
                <p className="text-xs text-white/35 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 pb-4 mb-2 border-b border-white/8">
              <button
                onClick={() => handleNavClick("login")}
                className="flex-1 py-2.5 text-xs font-semibold tracking-widest uppercase border border-white/15 text-white/60 hover:text-white hover:border-white/30 rounded-lg transition-colors text-center"
              >
                Login
              </button>
              <button
                onClick={() => handleNavClick("signup")}
                className="flex-1 py-2.5 text-xs font-black tracking-widest uppercase btn-gold text-[#0A0A0F] rounded-lg text-center"
              >
                Sign Up
              </button>
            </div>
          )}

          {navLinks.map(({ label, page, adminOnly }) => (
            <a
              key={label}
              href="#"
              onClick={(e) => handleNavClick(page, e)}
              className={`flex items-center justify-between py-3 text-sm tracking-widest uppercase font-medium border-b border-white/5 last:border-0 transition-colors ${
                adminOnly ? "text-[#C9A84C]/60 hover:text-[#C9A84C]" : "text-white/60 hover:text-[#C9A84C]"
              }`}
            >
              <span className="flex items-center gap-2">
                {label}
                {adminOnly && (
                  <span className="text-[8px] bg-[#C9A84C]/20 text-[#C9A84C] px-1.5 py-0.5 rounded-full font-black tracking-wider uppercase">Admin</span>
                )}
              </span>
              <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          ))}
          <button
            onClick={(e) => handleNavClick("finder", e)}
            className="flex items-center justify-between py-3 text-sm text-white/60 hover:text-[#C9A84C] tracking-widest uppercase font-medium border-b border-white/5 transition-colors"
          >
            Find Your Watch
            <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <button
            onClick={(e) => handleNavClick("cart", e)}
            className="flex items-center justify-between py-3 text-sm text-white/60 hover:text-[#C9A84C] tracking-widest uppercase font-medium border-b border-white/5 transition-colors"
          >
            Shopping Cart {cartCount > 0 && <span className="text-[#C9A84C] font-bold">({cartCount})</span>}
          </button>

          {/* Mobile: Profile & Logout (when logged in) */}
          {user && (
            <>
              <button
                onClick={() => handleNavClick("profile")}
                className="flex items-center justify-between py-3 text-sm text-white/60 hover:text-[#C9A84C] tracking-widest uppercase font-medium border-b border-white/5 transition-colors"
              >
                Profile
                <svg className="w-4 h-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-between py-3 text-sm text-red-400 hover:text-red-300 tracking-widest uppercase font-medium transition-colors"
              >
                Logout
                <svg className="w-4 h-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </>
          )}

          {!user && (
            <a href="#" onClick={(e) => handleNavClick("finder", e)} className="mt-4 btn-gold py-3 text-center text-[#0A0A0F] text-sm font-black tracking-widest uppercase rounded-sm">
              Start Quiz
            </a>
          )}
        </div>
      </div>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} setPage={setPage} onProductClick={onProductClick} />
    </header>
  );
}

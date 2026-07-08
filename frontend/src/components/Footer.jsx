const footerLinks = {
  Collections: ["Dress Watches", "Dive Watches", "Chronographs", "Smart Luxury", "Vintage Pieces", "Limited Editions"],
  Brands: ["Rolex", "Patek Philippe", "Omega", "Cartier", "TAG Heuer", "IWC", "Breitling", "Audemars Piguet"],
  Services: ["Authentication", "Consignment", "Watch Servicing", "Insurance", "Gift Cards", "Trade-In Program"],
  Company: ["Our Story", "Careers", "Press", "Sustainability", "Partner With Us", "Contact", "Admin Panel"],
};

const socials = [
  {
    name: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    name: "Twitter/X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
      </svg>
    ),
  },
  {
    name: "Pinterest",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
];

export default function Footer({ setPage }) {
  return (
    <footer className="bg-[#060608] border-t border-white/5">
      {/* Newsletter strip */}
      <div className="border-b border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-white mb-1">The Collector's Dispatch</h3>
            <p className="text-white/40 text-sm">Rare arrivals, market insights, and exclusive access — weekly.</p>
          </div>
          <div className="flex w-full max-w-md gap-0">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/10 border-r-0 rounded-l-sm px-5 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-[#0A0A0F] text-sm font-black tracking-wider uppercase rounded-r-sm whitespace-nowrap hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0D080] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#0A0A0F" strokeWidth="2"/>
                  <path d="M12 7v5l3 3" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-[0.15em] text-white uppercase">
                Chrono<span className="text-[#C9A84C]">lux</span>
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-xs">
              The world's most trusted marketplace for pre-owned and new luxury timepieces. Authenticated. Guaranteed. Unforgettable.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#C9A84C] hover:border-[#C9A84C]/40 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Trust badges */}
            <div className="mt-7 space-y-2">
              {["SSL Secured Checkout", "Official Brand Partners", "10,000+ Verified Reviews"].map(b => (
                <div key={b} className="flex items-center gap-2 text-white/30 text-xs">
                  <svg className="w-3 h-3 text-[#C9A84C] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white font-bold text-xs tracking-[0.2em] uppercase mb-5">{heading}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={(e) => {
                        if (link === "Admin Panel" && setPage) {
                          e.preventDefault();
                          setPage("admin");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      className="text-white/35 text-sm hover:text-[#C9A84C] transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © 2025 Chronolux. All rights reserved. Prices in USD. All timepieces independently authenticated.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Use", "Cookie Settings", "Accessibility"].map(l => (
              <a key={l} href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

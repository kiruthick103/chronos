import { useEffect, useState } from "react";

export default function Hero({ setPage, onProductClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [showFilm, setShowFilm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 px-4 sm:px-8">
      {/* Cinematic Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 w-[750px] h-[750px] bg-gradient-to-tr from-[#D4AF37]/12 via-[#C5A059]/8 to-transparent rounded-full blur-[140px] transition-transform duration-700 ease-out"
          style={{ transform: `translate(-50%, ${scrollY * 0.15}px)` }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#090A0E] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Editorial Headline & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-8 text-left">
          {/* Subtle Horological Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#E5C378]">
              The 2025 Authenticated Collection
            </span>
          </div>

          {/* Editorial Display Heading */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Curators of <br />
              <span className="italic font-normal bg-gradient-to-r from-[#F5E2B3] via-[#D4AF37] to-[#A98539] bg-clip-text text-transparent">
                Horological
              </span>{" "}
              Mastery
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl font-light leading-relaxed">
              From Patek Philippe to Rolex and Audemars Piguet — every timepiece in our vault is meticulously inspected, authenticated, and warranted by master Swiss watchmakers.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4 flex-wrap pt-2">
            <button
              onClick={() => {
                setPage("collection");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#090A0E] font-bold text-xs tracking-[0.2em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group"
            >
              <span>Explore Collection</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            <button
              onClick={() => {
                setPage("sell");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-7 py-4 rounded-xl border border-white/20 hover:border-[#D4AF37] text-white/90 hover:text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-white/5 transition-all duration-300"
            >
              Sell Your Timepiece
            </button>

            <button
              onClick={() => setShowFilm(true)}
              className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-[#E5C378] font-medium py-2 px-3 transition-colors ml-1"
            >
              <span className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center bg-white/5 hover:border-[#D4AF37] transition-colors">
                <svg className="w-3.5 h-3.5 ml-0.5 fill-current text-[#D4AF37]" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span>Watch Heritage</span>
            </button>
          </div>

          {/* Editorial Trust Keynotes */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 max-w-lg">
            <div>
              <p className="font-display text-2xl font-bold text-[#E5C378]">32+</p>
              <p className="text-[0.65rem] text-white/40 tracking-[0.15em] uppercase mt-0.5">
                Prestige References
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[#E5C378]">$100M+</p>
              <p className="text-[0.65rem] text-white/40 tracking-[0.15em] uppercase mt-0.5">
                Authenticated Volume
              </p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-[#E5C378]">100%</p>
              <p className="text-[0.65rem] text-white/40 tracking-[0.15em] uppercase mt-0.5">
                Swiss Escrow Protection
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Cinematic Watch Visual with Scroll Parallax (5 cols) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div 
            className="relative w-full max-w-[420px] transition-transform duration-300 ease-out"
            style={{ transform: `translateY(${scrollY * -0.06}px)` }}
          >
            {/* Background Halo */}
            <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-3xl scale-95 animate-pulse" />
            
            {/* Luxury Watch Showcase Card */}
            <div 
              onClick={() => onProductClick ? onProductClick("rolex-submariner-126610ln") : setPage("collection")}
              className="relative rounded-3xl p-6 bg-gradient-to-b from-[#161822]/90 to-[#0A0B10]/95 border border-[#D4AF37]/30 shadow-[0_30px_80px_rgba(0,0,0,0.85)] group cursor-pointer hover:border-[#D4AF37]/60 transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-[#050608]">
                <img
                  src="/images/rolex-submariner-hero.png"
                  alt="Rolex Submariner Date 41 Ref. 126610LN Certified Luxury Watch"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Authenticity Badge */}
                <div className="absolute top-4 right-4 bg-[#090A0E]/90 backdrop-blur-md border border-[#D4AF37]/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl z-10">
                  <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[0.62rem] font-bold tracking-widest uppercase text-white">
                    Certified Authentic
                  </span>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#090A0E] via-[#090A0E]/85 to-transparent p-5 z-10">
                  <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#D4AF37] uppercase block mb-1">
                    Rolex
                  </span>
                  <h3 className="font-display text-xl font-bold text-white leading-tight">
                    Submariner Date 41 Ref. 126610LN
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-sm font-bold text-white">$14,850 USD</span>
                    <span className="text-[0.68rem] text-emerald-400 font-semibold tracking-wider uppercase">
                      In Vault &bull; Ready to Ship
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Floating Badge Left - Positioned higher so it NEVER overlaps the bottom title */}
            <div className="absolute -left-6 sm:-left-8 top-16 bg-[#0E1017]/95 border border-[#D4AF37]/30 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl hidden sm:flex items-center gap-3 z-20 pointer-events-none">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[0.62rem] uppercase tracking-wider text-white/50">Calibration</p>
                <p className="text-xs font-bold text-white">+1.2 s/day (COSC)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Film Modal */}
      {showFilm && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setShowFilm(false)}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#0E1017] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="font-display font-bold text-lg text-white">
                Chronolux — The Art of Horology
              </span>
              <button
                onClick={() => setShowFilm(false)}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center relative">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/S_8qM0zQ-h8?autoplay=1&mute=1&loop=1&playlist=S_8qM0zQ-h8"
                title="Horology Craftsmanship"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

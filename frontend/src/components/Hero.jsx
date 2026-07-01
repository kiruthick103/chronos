import { useEffect, useRef } from "react";

// Animated ticking watch SVG
function HeroWatch() {
  const secRef = useRef(null);
  const minRef = useRef(null);
  const hrRef = useRef(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      if (secRef.current) secRef.current.style.transform = `rotate(${s * 6}deg)`;
      if (minRef.current) minRef.current.style.transform = `rotate(${m * 6}deg)`;
      if (hrRef.current)  hrRef.current.style.transform  = `rotate(${h * 30}deg)`;
    };
    tick();
    const id = setInterval(tick, 100);
    return () => clearInterval(id);
  }, []);

  const cx = 160, cy = 210;

  return (
    <svg viewBox="0 0 320 420" xmlns="http://www.w3.org/2000/svg" className="w-full animate-float drop-shadow-2xl" style={{filter:"drop-shadow(0 40px 80px rgba(0,0,0,0.8))"}}>
      <defs>
        <linearGradient id="bezelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#F0D080"/>
          <stop offset="30%" stopColor="#C9A84C"/>
          <stop offset="60%" stopColor="#8B6914"/>
          <stop offset="100%" stopColor="#F0D080"/>
        </linearGradient>
        <linearGradient id="goldRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor="#F0D080" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3"/>
        </linearGradient>
        <radialGradient id="dialBg" cx="38%" cy="32%">
          <stop offset="0%"  stopColor="#1e1e1e"/>
          <stop offset="60%" stopColor="#0d0d0d"/>
          <stop offset="100%" stopColor="#050505"/>
        </radialGradient>
      </defs>

      {/* Strap top */}
      <rect x="128" y="8" width="64" height="92" rx="10" fill="#141414" stroke="#2a2a2a" strokeWidth="1"/>
      <rect x="136" y="12" width="48" height="84" rx="7" fill="#0e0e0e"/>
      {[26,42,58,74].map(y => <line key={y} x1="138" y1={y} x2="184" y2={y} stroke="#1c1c1c" strokeWidth="1.2"/>)}
      <rect x="136" y="12" width="48" height="3" rx="1.5" fill="#1f1f1f"/>

      {/* Lugs */}
      <rect x="108" y="88" width="22" height="18" rx="5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.8"/>
      <rect x="190" y="88" width="22" height="18" rx="5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.8"/>

      {/* Case outer (gold bezel) */}
      <rect x="58" y="98" width="204" height="224" rx="42" fill="url(#bezelGrad)"/>
      {/* Case inner */}
      <rect x="66" y="106" width="188" height="208" rx="36" fill="#0d0d0d" stroke="url(#goldRing)" strokeWidth="1"/>

      {/* Crown pushers */}
      <rect x="260" y="152" width="20" height="11" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>
      <line x1="263" y1="157.5" x2="277" y2="157.5" stroke="#C9A84C" strokeWidth="0.6" opacity="0.5"/>
      <rect x="260" y="178" width="20" height="11" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>

      {/* Dial bg */}
      <circle cx={cx} cy={cy} r="82" fill="url(#dialBg)"/>
      {/* Dial texture ring */}
      <circle cx={cx} cy={cy} r="80" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.35"/>
      <circle cx={cx} cy={cy} r="72" fill="none" stroke="#333" strokeWidth="0.3" opacity="0.5"/>

      {/* Hour markers */}
      {Array.from({length:12}).map((_,i) => {
        const a = (i * 30 - 90) * Math.PI/180;
        const isQuarter = i % 3 === 0;
        const outer = 76, inner = isQuarter ? 62 : 69;
        return (
          <line key={i}
            x1={cx + Math.cos(a)*inner} y1={cy + Math.sin(a)*inner}
            x2={cx + Math.cos(a)*outer} y2={cy + Math.sin(a)*outer}
            stroke={isQuarter ? "#C9A84C" : "#555"}
            strokeWidth={isQuarter ? 2.5 : 1.2}
            strokeLinecap="round"
          />
        );
      })}

      {/* Brand */}
      <text x={cx} y={cy-28} textAnchor="middle" fill="#C9A84C" fontSize="9.5" fontFamily="Georgia,serif" letterSpacing="4" fontWeight="bold">CHRONOLUX</text>
      <text x={cx} y={cy-15} textAnchor="middle" fill="#555" fontSize="5.5" fontFamily="Arial,sans-serif" letterSpacing="2.5">SWISS MADE</text>

      {/* Subdial at 6 */}
      <circle cx={cx} cy={cy+38} r="16" fill="none" stroke="#222" strokeWidth="1.2"/>
      <circle cx={cx} cy={cy+38} r="14" fill="#080808"/>
      {[0,90,180,270].map(a => {
        const r2 = a * Math.PI/180;
        return <line key={a} x1={cx+Math.cos(r2)*10} y1={cy+38+Math.sin(r2)*10} x2={cx+Math.cos(r2)*13} y2={cy+38+Math.sin(r2)*13} stroke="#444" strokeWidth="1"/>;
      })}
      <text x={cx} y={cy+41} textAnchor="middle" fill="#555" fontSize="4" fontFamily="Arial">30</text>

      {/* Power reserve at 3 */}
      <rect x={cx+28} y={cy-8} width="26" height="14" rx="6" fill="none" stroke="#222" strokeWidth="1"/>
      <rect x={cx+30} y={cy-6} width="18" height="10" rx="4" fill="#0d1a0d"/>
      <rect x={cx+30} y={cy-6} width="14" height="10" rx="4" fill="#0a2a0a"/>
      <text x={cx+43} y={cy+2} textAnchor="middle" fill="#22c55e" fontSize="4" fontFamily="Arial">POWER</text>

      {/* Hands — rotate around dial center */}
      <g style={{transformOrigin: `${cx}px ${cy}px`}} ref={hrRef}>
        <line x1={cx} y1={cy+14} x2={cx} y2={cy-44}
          stroke="#f0f0f0" strokeWidth="5" strokeLinecap="round"
          style={{filter:"drop-shadow(0 0 2px rgba(255,255,255,0.3))"}}/>
        <polygon points={`${cx-2},${cy+12} ${cx+2},${cy+12} ${cx},${cy-44}`} fill="#E8E8E8" opacity="0.3"/>
      </g>
      <g style={{transformOrigin: `${cx}px ${cy}px`}} ref={minRef}>
        <line x1={cx} y1={cy+18} x2={cx} y2={cy-62}
          stroke="#e0e0e0" strokeWidth="3.5" strokeLinecap="round"
          style={{filter:"drop-shadow(0 0 2px rgba(255,255,255,0.2))"}}/>
      </g>
      <g style={{transformOrigin: `${cx}px ${cy}px`}} ref={secRef}>
        <line x1={cx} y1={cy+22} x2={cx} y2={cy-68}
          stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx={cx} cy={cy+20} r="4" fill="#C9A84C"/>
        <line x1={cx} y1={cy+18} x2={cx} y2={cy+26}
          stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
      </g>

      {/* Center cap */}
      <circle cx={cx} cy={cy} r="5" fill="#C9A84C"/>
      <circle cx={cx} cy={cy} r="3" fill="#fff"/>
      <circle cx={cx} cy={cy} r="1.5" fill="#C9A84C"/>

      {/* Strap bottom */}
      <rect x="108" y="314" width="22" height="18" rx="5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.8"/>
      <rect x="190" y="314" width="22" height="18" rx="5" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="0.8"/>
      <rect x="128" y="320" width="64" height="92" rx="10" fill="#141414" stroke="#2a2a2a" strokeWidth="1"/>
      <rect x="136" y="324" width="48" height="84" rx="7" fill="#0e0e0e"/>
      {[338,354,370,386].map(y => <line key={y} x1="138" y1={y} x2="184" y2={y} stroke="#1c1c1c" strokeWidth="1.2"/>)}
      {/* Buckle */}
      <rect x="142" y="396" width="36" height="14" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>
      <line x1="150" y1="396" x2="150" y2="410" stroke="#C9A84C" strokeWidth="1" opacity="0.6"/>
      {[156,162,168].map(x => <circle key={x} cx={x} cy="403" r="1.2" fill="#C9A84C" opacity="0.4"/>)}
    </svg>
  );
}

export default function Hero({ setPage }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16" aria-label="Hero">

      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Primary gradient glow */}
        <div className="absolute top-1/4 left-1/3 w-[800px] h-[800px] bg-[#C9A84C]/12 rounded-full blur-[150px] animate-float-slow"/>
        
        {/* Secondary accent glow */}
        <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[#6B3FA0]/15 rounded-full blur-[140px] animate-float"/>
        
        {/* Tertiary accent */}
        <div className="absolute top-3/4 left-10 w-[400px] h-[400px] bg-[#C9A84C]/8 rounded-full blur-[100px]"/>

        {/* Grid background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"72px 72px"}}/>
        
        {/* Accent lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A84C]/20 to-transparent"/>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full grid md:grid-cols-2 gap-8 lg:gap-16 items-center py-12 md:py-20 relative z-10">

        {/* Left side */}
        <div className="space-y-8 relative z-10 order-2 md:order-1">

          <div className="animate-fade-up inline-flex items-center gap-2.5 bg-white/[0.04] border border-[#C9A84C]/25 rounded-full px-4 py-2.5 backdrop-blur-sm w-fit">
            <span className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse"/>
            <span className="text-[0.68rem] text-[#C9A84C] tracking-[0.25em] uppercase font-semibold">New 2025 Collection Arrived</span>
          </div>

          <div className="animate-fade-up-delay-1 space-y-3">
            <h1 className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] font-bold leading-[0.88] tracking-tight">
              <span className="block text-white">Time Is</span>
              <span className="block text-gradient animate-pulse-slow">Your Art</span>
            </h1>
            <p className="text-white/20 text-[0.9rem] tracking-[0.35em] uppercase font-light pl-0.5">Wear It Well</p>
          </div>

          <p className="animate-fade-up-delay-2 text-white/50 text-base sm:text-[1.05rem] leading-relaxed max-w-[420px]">
            Curated from the world's finest ateliers — each piece a testament to mechanical mastery and timeless design.
          </p>

          <div className="animate-fade-up-delay-3 flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setPage("collection")}
              className="btn-gold px-8 py-3.5 text-[#0A0A0F] text-xs font-black tracking-[0.2em] uppercase rounded-md inline-flex items-center gap-2 group shadow-lg"
            >
              Explore Collection
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => alert("Playing Brand Film...")}
              className="group flex items-center gap-3 text-white/50 hover:text-white transition-all duration-300 hover-lift"
            >
              <span className="relative w-12 h-12 rounded-full border-2 border-white/15 group-hover:border-[#C9A84C]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#C9A84C]/10 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.2)]">
                <span className="absolute inset-0 rounded-full bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/5 transition-colors"/>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" className="ml-0.5 text-white/70 group-hover:text-white transition-colors">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
              <span className="text-[0.75rem] tracking-[0.18em] uppercase font-semibold">Watch Film</span>
            </button>
          </div>

          {/* Enhanced stats */}
          <div className="animate-fade-up-delay-4 flex items-center gap-6 sm:gap-10 pt-6 border-t border-white/10">
            {[["500+", "Models"], ["12K+", "Happy Clients"], ["40+", "Luxury Brands"]].map(([num, label]) => (
              <div key={label} className="group cursor-pointer">
                <div className="text-xl sm:text-2xl font-black text-[#C9A84C] tabular-nums group-hover:scale-110 transition-transform duration-300 origin-left">{num}</div>
                <div className="text-[0.65rem] text-white/35 tracking-[0.15em] uppercase mt-0.5 whitespace-nowrap group-hover:text-white/50 transition-colors">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — watch */}
        <div className="relative flex items-center justify-center order-1 md:order-2 animate-fade-up-delay-2">
          <div className="relative w-full max-w-[280px] sm:max-w-[340px] mx-auto">

            {/* Layered glows */}
            <div className="absolute inset-[-15%] rounded-full bg-[#C9A84C]/20 blur-3xl animate-glow opacity-60"/>
            <div className="absolute inset-[-25%] rounded-full bg-[#C9A84C]/10 blur-[120px] animate-float-slow"/>

            <HeroWatch />

            {/* Caliber tag with glass effect */}
            <div className="absolute top-8 -right-2 sm:-right-8 animate-fade-up-delay-3 glass rounded-2xl px-4 py-3 shadow-lg-premium">
              <div className="text-[0.62rem] text-white/35 tracking-[0.15em] uppercase">Movement</div>
              <div className="text-sm font-bold text-[#C9A84C] mt-0.5">Cal. ETA 2824-2</div>
              <div className="text-[0.6rem] text-white/25 tracking-wider mt-0.5">25 Jewels · 28,800 vph</div>
            </div>

            {/* Water resistant tag */}
            <div className="absolute bottom-16 -left-2 sm:-left-8 animate-fade-up-delay-4 glass border-green-500/20 rounded-2xl px-4 py-3 shadow-lg-premium">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
                <span className="text-[0.62rem] text-white/40 tracking-wider uppercase">Water Resistant</span>
              </div>
              <div className="text-sm font-bold text-white">100m / 330ft</div>
            </div>

            {/* Live tick indicator */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#C9A84C] rounded-full animate-pulse"/>
              <span className="text-[0.6rem] text-white/25 tracking-widest uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-slow" aria-hidden="true">
        <span className="text-[0.6rem] text-white/20 tracking-[0.3em] uppercase">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C]/40 via-[#C9A84C]/20 to-transparent"/>
      </div>
    </section>
  );
}

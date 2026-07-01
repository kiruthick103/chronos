import { useState, useEffect } from "react";

function useCountdown(endMs) {
  const calc = () => {
    const diff = Math.max(0, endMs - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function FlipDigit({ val, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-16 sm:w-16 sm:h-18">
        {/* Top half */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-[#0d0d0d] border border-[#C9A84C]/20 rounded-t-lg overflow-hidden flex items-end justify-center pb-0.5">
          <span className="text-2xl sm:text-3xl font-black text-[#C9A84C] tabular-nums leading-none">{String(val).padStart(2,"0")}</span>
        </div>
        {/* Bottom half */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#111] border border-t-0 border-[#C9A84C]/20 rounded-b-lg overflow-hidden flex items-start justify-center pt-0.5">
          <span className="text-2xl sm:text-3xl font-black text-[#C9A84C]/70 tabular-nums leading-none">{String(val).padStart(2,"0")}</span>
        </div>
        {/* Center divider */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-px h-px bg-black z-10"/>
      </div>
      <span className="text-[0.58rem] text-white/30 tracking-[0.25em] uppercase font-medium">{label}</span>
    </div>
  );
}

// Offer watch SVG
function OfferWatch() {
  return (
    <svg viewBox="0 0 220 310" xmlns="http://www.w3.org/2000/svg" className="w-full animate-float"
      style={{filter:"drop-shadow(0 24px 60px rgba(0,0,0,0.7))"}}>
      {/* Band top */}
      <rect x="78" y="6" width="64" height="60" rx="9" fill="#1a0e00" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.3"/>
      {[18,28,38,48].map(y=><line key={y} x1="82" y1={y} x2="138" y2={y} stroke="#251500" strokeWidth="1"/>)}
      {/* Lugs */}
      <rect x="56" y="62" width="24" height="16" rx="5" fill="#1c1c1c"/>
      <rect x="140" y="62" width="24" height="16" rx="5" fill="#1c1c1c"/>
      {/* Case */}
      <rect x="24" y="72" width="172" height="166" rx="38" fill="url(#offerBezel)"/>
      <rect x="30" y="78" width="160" height="154" rx="32" fill="#080808" stroke="url(#offerRing)" strokeWidth="1.2"/>
      {/* Crown */}
      <rect x="194" y="128" width="18" height="10" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>
      <line x1="197" y1="133" x2="209" y2="133" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5"/>
      <rect x="194" y="152" width="18" height="10" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>
      {/* Dial */}
      <circle cx="110" cy="155" r="64" fill="url(#offerDial)"/>
      <circle cx="110" cy="155" r="62.5" fill="none" stroke="#C9A84C" strokeWidth="0.4" opacity="0.35"/>
      <circle cx="110" cy="155" r="55" fill="none" stroke="#C9A84C" strokeWidth="0.2" opacity="0.15" strokeDasharray="2 4"/>
      {Array.from({length:12}).map((_,i) => {
        const a=(i*30-90)*Math.PI/180;
        const isQ=i%3===0;
        return <line key={i}
          x1={110+Math.cos(a)*(isQ?51:55)} y1={155+Math.sin(a)*(isQ?51:55)}
          x2={110+Math.cos(a)*61.5} y2={155+Math.sin(a)*61.5}
          stroke={isQ?"#C9A84C":"#444"} strokeWidth={isQ?2.5:0.8} strokeLinecap="round"/>;
      })}
      {/* Sub-dials */}
      <circle cx="110" cy="178" r="13" fill="none" stroke="#1f1f1f" strokeWidth="1.2"/>
      <circle cx="110" cy="178" r="11" fill="#050505"/>
      <circle cx="80" cy="155" r="11" fill="none" stroke="#1f1f1f" strokeWidth="1"/>
      <circle cx="80" cy="155" r="9" fill="#050505"/>
      <circle cx="140" cy="155" r="11" fill="none" stroke="#1f1f1f" strokeWidth="1"/>
      <circle cx="140" cy="155" r="9" fill="#050505"/>
      {/* Brand */}
      <text x="110" y="130" textAnchor="middle" fill="#C9A84C" fontSize="8" fontFamily="Georgia,serif" letterSpacing="3.5" fontWeight="bold">CHRONOLUX</text>
      <text x="110" y="142" textAnchor="middle" fill="#444" fontSize="5" fontFamily="Arial" letterSpacing="2">TOURBILLON · SWISS MADE</text>
      {/* Hands */}
      <line x1="110" y1="155" x2="96" y2="112" stroke="#f0f0f0" strokeWidth="4.5" strokeLinecap="round"/>
      <line x1="110" y1="155" x2="148" y2="135" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round"/>
      <line x1="110" y1="155" x2="104" y2="100" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="110" y1="155" x2="113" y2="175" stroke="#C9A84C" strokeWidth="1.5"/>
      <circle cx="110" cy="155" r="5" fill="#C9A84C"/>
      <circle cx="110" cy="155" r="2.5" fill="#fff"/>
      {/* Band bottom */}
      <rect x="56" y="238" width="24" height="16" rx="5" fill="#1c1c1c"/>
      <rect x="140" y="238" width="24" height="16" rx="5" fill="#1c1c1c"/>
      <rect x="78" y="248" width="64" height="55" rx="9" fill="#1a0e00" stroke="#C9A84C" strokeWidth="0.7" strokeOpacity="0.3"/>
      {[258,268,278,288].map(y=><line key={y} x1="82" y1={y} x2="138" y2={y} stroke="#251500" strokeWidth="1"/>)}
      <rect x="88" y="294" width="44" height="12" rx="4" fill="#1c1c1c" stroke="#C9A84C" strokeWidth="0.8"/>
      <line x1="98" y1="294" x2="98" y2="306" stroke="#C9A84C" strokeWidth="0.8" opacity="0.5"/>
      {[106,112,118].map(x=><circle key={x} cx={x} cy="300" r="1.2" fill="#C9A84C" opacity="0.35"/>)}
      <defs>
        <linearGradient id="offerBezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D080"/>
          <stop offset="30%" stopColor="#C9A84C"/>
          <stop offset="65%" stopColor="#7a5a0e"/>
          <stop offset="100%" stopColor="#F0D080"/>
        </linearGradient>
        <linearGradient id="offerRing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D080" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.2"/>
        </linearGradient>
        <radialGradient id="offerDial" cx="35%" cy="28%">
          <stop offset="0%" stopColor="#1c1c1c"/>
          <stop offset="60%" stopColor="#0a0a0a"/>
          <stop offset="100%" stopColor="#030303"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

const perks = [
  { icon:"M5 13l4 4L19 7", text:"Free Global Shipping" },
  { icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text:"2-Year Warranty" },
  { icon:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", text:"Auth Certificate" },
  { icon:"M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6", text:"Easy Returns" },
];

export default function OfferBanner() {
  const endTime = Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000 + 59 * 1000;
  const time = useCountdown(endTime);

  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 overflow-hidden" aria-label="Flash sale offer">
      {/* Background */}
      <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#110800 0%,#0A0A0F 45%,#0e0018 100%)"}}/>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage:"repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)", backgroundSize:"18px 18px"}}/>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{backgroundImage:"repeating-linear-gradient(-45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)", backgroundSize:"18px 18px"}}/>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#C9A84C]/6 rounded-full blur-[130px]"/>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 xl:gap-24">

          {/* Watch */}
          <div className="relative w-full max-w-[220px] sm:max-w-[260px] flex-shrink-0 animate-fade-up">
            <div className="absolute inset-[-30%] bg-[#C9A84C]/8 rounded-full blur-3xl animate-glow"/>
            <OfferWatch/>
            <div className="absolute -top-3 -right-6 bg-[#F87171] text-white rounded-xl px-4 py-2.5 font-black text-2xl shadow-2xl" style={{transform:"rotate(6deg)"}}>
              -20%
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-pulse"/>
              <span className="text-[0.65rem] text-[#C9A84C] tracking-[0.25em] uppercase font-semibold">Flash Sale — Ending Soon</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-4 animate-fade-up-delay-1">
              Summer Prestige<br/>
              <span className="bg-gradient-to-r from-[#C9A84C] via-[#F0D080] to-[#C9A84C] bg-clip-text text-transparent"
                style={{backgroundSize:"200% 100%",animation:"shimmer 4s linear infinite"}}>
                Event 2025
              </span>
            </h2>

            <p className="text-white/45 text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0 animate-fade-up-delay-2">
              Exclusive savings on over 200 authenticated timepieces. Once gone, these prices never return.
            </p>

            {/* Countdown */}
            <div className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start mb-8 animate-fade-up-delay-2">
              <FlipDigit val={time.h} label="Hours"/>
              <span className="text-[#C9A84C]/60 text-3xl font-thin mb-5">:</span>
              <FlipDigit val={time.m} label="Minutes"/>
              <span className="text-[#C9A84C]/60 text-3xl font-thin mb-5">:</span>
              <FlipDigit val={time.s} label="Seconds"/>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8 animate-fade-up-delay-3">
              <a href="#" className="btn-gold px-8 py-4 text-[#0A0A0F] text-xs font-black tracking-[0.2em] uppercase rounded-sm inline-flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(201,168,76,0.25)]">
                Claim Offer Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#" className="btn-ghost px-8 py-4 text-white text-xs font-bold tracking-[0.18em] uppercase rounded-sm inline-flex items-center justify-center gap-2">
                View All Deals
              </a>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 animate-fade-up-delay-4">
              {perks.map(({ icon, text }) => (
                <div key={text} className="flex flex-col items-center lg:items-start gap-2 bg-white/[0.03] border border-white/5 rounded-xl p-3 hover:border-[#C9A84C]/20 transition-colors group">
                  <svg className="w-4 h-4 text-[#C9A84C] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d={icon}/>
                  </svg>
                  <span className="text-white/40 text-[0.62rem] tracking-wider text-center lg:text-left leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

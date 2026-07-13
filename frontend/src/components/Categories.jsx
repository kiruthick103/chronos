const categories = [
  {
    title: "Dress Watches",
    pageId: "dress",
    count: 124,
    accent: "#C9A84C",
    gradient: "from-[#C9A84C]/12 via-[#C9A84C]/6 to-transparent",
    borderHover: "hover:border-[#C9A84C]/40",
    ringColor: "rgba(201,168,76,0.15)",
    desc: "Ultra-thin dials for formal occasions",
    features: ["Mechanical", "Sapphire Crystal", "Leather Strap"],
    icon: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <circle cx="36" cy="36" r="26" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.2"/>
        <circle cx="36" cy="36" r="22" fill="#0d0d0d"/>
        <circle cx="36" cy="36" r="21" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.4"/>
        {Array.from({length:12}).map((_,i) => {
          const a=(i*30-90)*Math.PI/180;
          const o=19,n=i%3===0?16:17.5;
          return <line key={i} x1={36+Math.cos(a)*n} y1={36+Math.sin(a)*n} x2={36+Math.cos(a)*o} y2={36+Math.sin(a)*o} stroke={i%3===0?"#C9A84C":"#555"} strokeWidth={i%3===0?2:0.8} strokeLinecap="round"/>;
        })}
        <line x1="36" y1="36" x2="36" y2="21" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="45" y2="36" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="32" y2="25" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="2" fill="#C9A84C"/>
        <rect x="30" y="6" width="12" height="8" rx="2.5" fill="#111" stroke="#C9A84C" strokeWidth="0.7"/>
        <rect x="30" y="58" width="12" height="8" rx="2.5" fill="#111" stroke="#C9A84C" strokeWidth="0.7"/>
      </svg>
    ),
  },
  {
    title: "Dive Watches",
    pageId: "dive",
    count: 87,
    accent: "#38BDF8",
    gradient: "from-[#38BDF8]/12 via-[#38BDF8]/6 to-transparent",
    borderHover: "hover:border-[#38BDF8]/40",
    ringColor: "rgba(56,189,248,0.15)",
    desc: "Built for depth, perfected on land",
    features: ["300m Water Resistance", "Rotating Bezel", "Luminous Hands"],
    icon: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <circle cx="36" cy="36" r="26" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.3"/>
        <circle cx="36" cy="36" r="22" fill="#030d18"/>
        <circle cx="36" cy="36" r="21" fill="none" stroke="#38BDF8" strokeWidth="0.5" opacity="0.4"/>
        {Array.from({length:12}).map((_,i) => {
          const a=(i*30-90)*Math.PI/180;
          return <rect key={i} x={36+Math.cos(a)*16.5-0.8} y={36+Math.sin(a)*16.5-2.5} width="1.6" height="5" rx="0.8" fill={i%3===0?"#38BDF8":"#335"} transform={`rotate(${i*30},${36+Math.cos(a)*16.5},${36+Math.sin(a)*16.5})`}/>;
        })}
        <line x1="36" y1="36" x2="28" y2="20" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="48" y2="36" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="2.5" fill="#38BDF8"/>
        <rect x="30" y="6" width="12" height="9" rx="3" fill="#030d18" stroke="#38BDF8" strokeWidth="0.7"/>
        <rect x="30" y="57" width="12" height="9" rx="3" fill="#030d18" stroke="#38BDF8" strokeWidth="0.7"/>
        <rect x="2" y="30" width="8" height="12" rx="3" fill="#030d18" stroke="#38BDF8" strokeWidth="0.7"/>
        <rect x="2" y="22" width="8" height="8" rx="2" fill="#030d18" stroke="#38BDF8" strokeWidth="0.6"/>
      </svg>
    ),
  },
  {
    title: "Chronographs",
    pageId: "chrono",
    count: 203,
    accent: "#F87171",
    gradient: "from-[#F87171]/12 via-[#F87171]/6 to-transparent",
    borderHover: "hover:border-[#F87171]/40",
    ringColor: "rgba(248,113,113,0.15)",
    desc: "Racing-bred precision, everyday elegance",
    features: ["Flyback", "Tachymeter", "Column Wheel"],
    icon: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <circle cx="36" cy="36" r="26" fill="none" stroke="#F87171" strokeWidth="1" opacity="0.2"/>
        <circle cx="36" cy="36" r="22" fill="#0d0505"/>
        <circle cx="36" cy="36" r="21" fill="none" stroke="#F87171" strokeWidth="0.5" opacity="0.4"/>
        <circle cx="36" cy="47" r="7" fill="none" stroke="#F87171" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="24" cy="36" r="6" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="48" cy="36" r="6" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.5"/>
        {Array.from({length:12}).map((_,i) => {
          const a=(i*30-90)*Math.PI/180;
          const o=19,n=i%3===0?16:17.5;
          return <line key={i} x1={36+Math.cos(a)*n} y1={36+Math.sin(a)*n} x2={36+Math.cos(a)*o} y2={36+Math.sin(a)*o} stroke={i%3===0?"#F87171":"#444"} strokeWidth={i%3===0?2:0.8} strokeLinecap="round"/>;
        })}
        <line x1="36" y1="36" x2="36" y2="19" stroke="#F87171" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="46" y2="30" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="2" fill="#F87171"/>
        <rect x="30" y="6" width="12" height="8" rx="2.5" fill="#0d0505" stroke="#F87171" strokeWidth="0.7"/>
        <rect x="3" y="21" width="7" height="10" rx="2" fill="#0d0505" stroke="#666" strokeWidth="0.6"/>
        <rect x="3" y="14" width="7" height="7" rx="2" fill="#0d0505" stroke="#666" strokeWidth="0.6"/>
      </svg>
    ),
  },
  {
    title: "Smart Luxury",
    pageId: "smart",
    count: 56,
    accent: "#C084FC",
    gradient: "from-[#C084FC]/12 via-[#C084FC]/6 to-transparent",
    borderHover: "hover:border-[#C084FC]/40",
    ringColor: "rgba(192,132,252,0.15)",
    desc: "Connected intelligence, refined form",
    features: ["Health Tracking", "AMOLED", "5-Day Battery"],
    icon: (
      <svg viewBox="0 0 72 72" className="w-16 h-16">
        <rect x="18" y="14" width="36" height="44" rx="9" fill="#150920" stroke="#C084FC" strokeWidth="1" opacity="0.6"/>
        <rect x="22" y="18" width="28" height="36" rx="5" fill="#1d0f2e"/>
        <rect x="24" y="20" width="24" height="32" rx="4" fill="#C084FC" opacity="0.08"/>
        <circle cx="36" cy="36" r="9" fill="none" stroke="#C084FC" strokeWidth="0.8" opacity="0.4"/>
        {Array.from({length:8}).map((_,i) => {
          const a=(i*45-90)*Math.PI/180;
          return <circle key={i} cx={36+Math.cos(a)*7} cy={36+Math.sin(a)*7} r="0.8" fill="#C084FC" opacity="0.5"/>;
        })}
        <line x1="36" y1="36" x2="36" y2="28" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="36" y1="36" x2="41" y2="36" stroke="#e0e0e0" strokeWidth="1" strokeLinecap="round"/>
        <circle cx="36" cy="36" r="2" fill="#C084FC"/>
        <rect x="28" y="6" width="16" height="9" rx="3.5" fill="#150920" stroke="#C084FC" strokeWidth="0.7"/>
        <rect x="28" y="57" width="16" height="9" rx="3.5" fill="#150920" stroke="#C084FC" strokeWidth="0.7"/>
        <circle cx="44" cy="24" r="2.5" fill="#C084FC" opacity="0.6"/>
        <line x1="44" y1="21.5" x2="44" y2="19" stroke="#C084FC" strokeWidth="0.8" opacity="0.4"/>
      </svg>
    ),
  },
];

export default function Categories({ setPage, setCollectionCategory }) {
  const handleCategoryClick = (pageId) => {
    setCollectionCategory(pageId);
    setPage("collection");
  };

  const handleAllCategories = () => {
    setCollectionCategory(null);
    setPage("collection");
  };

  return (
    <section className="py-20 sm:py-28 px-5 sm:px-8" aria-labelledby="categories-heading">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-5">
          <div className="animate-fade-up">
            <p className="text-[#C9A84C] text-[0.68rem] tracking-[0.3em] uppercase font-semibold mb-3">Browse By Style</p>
            <h2 id="categories-heading" className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
              Find Your <br className="hidden sm:block"/>
              <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">
                Perfect Match
              </span>
            </h2>
          </div>
          <button
            onClick={handleAllCategories}
            className="animate-fade-up hidden sm:flex items-center gap-2 text-white/35 hover:text-[#C9A84C] text-[0.72rem] tracking-[0.2em] uppercase font-medium transition-colors group w-fit"
          >
            All Categories
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              onClick={() => handleCategoryClick(cat.pageId)}
              className={`group relative bg-gradient-to-br ${cat.gradient} border border-white/8 ${cat.borderHover} rounded-2xl p-6 sm:p-7 card-hover overflow-hidden flex flex-col gap-5 animate-fade-up text-left w-full`}
              style={{ animationDelay: `${i * 0.08}s` }}
              aria-label={`Browse ${cat.title}`}
            >
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at top right, ${cat.ringColor}, transparent)` }}/>

              {/* Top: icon + count */}
              <div className="flex items-start justify-between">
                <div className="group-hover:scale-110 transition-transform duration-400 origin-bottom-left">
                  {cat.icon}
                </div>
                <div className="text-right">
                  <div className="text-xs font-black tabular-nums" style={{ color: cat.accent }}>{cat.count}</div>
                  <div className="text-[0.6rem] text-white/25 tracking-wider uppercase">pieces</div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-white transition-colors">{cat.title}</h3>
                <p className="text-white/35 text-xs leading-relaxed mb-4">{cat.desc}</p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.features.map(f => (
                    <span key={f} className="text-[0.58rem] px-2 py-0.5 rounded-full border tracking-wider uppercase"
                      style={{ borderColor: `${cat.accent}30`, color: `${cat.accent}80`, background: `${cat.accent}08` }}>
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-[0.68rem] tracking-widest uppercase font-semibold text-white/40 group-hover:text-white/60 transition-colors">
                  Shop Now
                </span>
                <div className="w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                  style={{ borderColor: `${cat.accent}40`, background: `${cat.accent}10` }}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke={cat.accent} strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

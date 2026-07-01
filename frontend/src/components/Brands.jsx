const brands = [
  { name: "Rolex",       country: "Switzerland", est: "1905", tier: "Prestige" },
  { name: "Patek Philippe", country: "Geneva",   est: "1839", tier: "Grand Complication" },
  { name: "Omega",       country: "Biel",        est: "1848", tier: "Official Timekeeper" },
  { name: "Cartier",     country: "Paris",       est: "1847", tier: "Jeweller" },
  { name: "TAG Heuer",   country: "La Chaux",    est: "1860", tier: "Sport Luxury" },
  { name: "IWC",         country: "Schaffhausen",est: "1868", tier: "Engineering" },
  { name: "Breitling",   country: "Grenchen",    est: "1884", tier: "Aviation" },
  { name: "Audemars Piguet",country:"Le Brassus",est: "1875", tier: "Haute Horlogerie" },
];

export default function Brands() {
  return (
    <section className="border-y border-white/5 bg-[#0C0C12] py-10 overflow-hidden" aria-label="Authorized brands">
      <p className="text-center text-[0.6rem] text-white/20 tracking-[0.4em] uppercase mb-7">
        Authorized Dealer For
      </p>

      <div className="relative">
        <div className="flex animate-marquee">
          {[...brands, ...brands].map((b, i) => (
            <div key={i}
              className="inline-flex items-center gap-3.5 px-8 sm:px-12 border-r border-white/5 group cursor-pointer flex-shrink-0 hover:bg-white/[0.02] transition-colors py-2">
              {/* Monogram circle */}
              <div className="w-9 h-9 rounded-full border border-[#C9A84C]/20 bg-gradient-to-br from-[#C9A84C]/10 to-transparent flex items-center justify-center text-[#C9A84C] text-xs font-black flex-shrink-0 group-hover:border-[#C9A84C]/50 group-hover:shadow-[0_0_12px_rgba(201,168,76,0.2)] transition-all duration-300">
                {b.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div>
                <div className="text-white/60 group-hover:text-[#C9A84C] transition-colors duration-300 font-semibold tracking-[0.12em] text-[0.8rem] uppercase whitespace-nowrap">
                  {b.name}
                </div>
                <div className="text-white/20 text-[0.58rem] tracking-widest whitespace-nowrap mt-0.5">{b.tier} · {b.est}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0C0C12] to-transparent pointer-events-none z-10"/>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0C0C12] to-transparent pointer-events-none z-10"/>
      </div>
    </section>
  );
}

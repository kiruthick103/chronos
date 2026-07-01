const brands = [
  { name: "Rolex", country: "Geneva, Switzerland", est: 1905, tagline: "The Crown of Watches", watches: 24, speciality: "Sport Luxury", desc: "Iconic precision instruments trusted by professionals worldwide." },
  { name: "Patek Philippe", country: "Geneva, Switzerland", est: 1839, tagline: "You Never Actually Own a Patek Philippe", watches: 18, speciality: "Grand Complication", desc: "Pinnacle of horology excellence and mechanical artistry." },
  { name: "Omega", country: "Biel, Switzerland", est: 1848, tagline: "Timekeeping of the Stars", watches: 21, speciality: "Official Timekeeper", desc: "Precision chronographs chosen for space exploration." },
  { name: "Cartier", country: "Paris, France", est: 1847, tagline: "Jeweller of Kings", watches: 15, speciality: "Jewellery Watch", desc: "Legendary designs merging watchmaking with fine jewelry." },
  { name: "TAG Heuer", country: "La Chaux-de-Fonds, Switzerland", est: 1860, tagline: "Don't Crack Under Pressure", watches: 19, speciality: "Chronograph", desc: "Racing chronographs and sports timing instruments." },
  { name: "IWC", country: "Schaffhausen, Switzerland", est: 1868, tagline: "Engineering the Impossible", watches: 17, speciality: "Engineering", desc: "Technical innovation meets minimalist design." },
  { name: "Breitling", country: "Grenchen, Switzerland", est: 1884, tagline: "Your Instrument", watches: 20, speciality: "Aviation", desc: "Precision instruments for aviation and exploration." },
  { name: "Audemars Piguet", country: "Le Brassus, Switzerland", est: 1875, tagline: "To Break the Rules, You Must First Master Them", watches: 16, speciality: "Haute Horlogerie", desc: "Master craftsmanship and innovative watchmaking." },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 animate-fade-up text-center lg:text-left">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-4">
            Authorized <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Dealers</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto lg:mx-0">
            40+ of the world's most prestigious watchmakers, all authenticated and guaranteed. We partner exclusively with heritage brands.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { num: "40+", label: "Brands" },
            { num: brands.reduce((acc, b) => acc + b.watches, 0), label: "Timepieces" },
            { num: "200+", label: "Years Heritage" },
          ].map(({ num, label }) => (
            <div key={label} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center card-hover">
              <div className="text-4xl font-black text-[#C9A84C] mb-2">{num}</div>
              <div className="text-white/40 text-sm tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {brands.map((brand, i) => (
            <div
              key={brand.name}
              className="group relative bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-[#C9A84C]/40 rounded-2xl p-6 sm:p-8 card-hover animate-fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Top */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#C9A84C] tracking-widest uppercase font-bold mb-1">Est. {brand.est}</p>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">{brand.name}</h3>
                  </div>
                  <span className="text-[0.6rem] text-white/30 text-right whitespace-nowrap leading-tight">{brand.country}</span>
                </div>

                {/* Tagline */}
                <p className="italic text-white/40 text-sm mb-4 group-hover:text-[#C9A84C] transition-colors duration-300">
                  "{brand.tagline}"
                </p>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-5">{brand.desc}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[#C9A84C] font-black">{brand.watches}</span>
                    <span className="text-white/30 text-xs ml-1 tracking-widest uppercase">Watches</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex-1">
                    <span className="text-white/40 text-xs tracking-widest uppercase">Specialty</span>
                    <p className="text-white text-sm font-semibold">{brand.speciality}</p>
                  </div>
                </div>

                {/* CTA */}
                <a href="#" className="inline-flex items-center gap-2 mt-6 text-[#C9A84C] hover:text-[#F0D080] transition-colors text-sm font-bold tracking-wider uppercase">
                  Explore Collection
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const values = [
  { icon: "🔍", title: "Authenticity", desc: "Every timepiece is independently verified by certified gemologists and horologists." },
  { icon: "🏆", title: "Excellence", desc: "We curate only the finest examples from 40+ prestigious watchmakers worldwide." },
  { icon: "🤝", title: "Trust", desc: "12,000+ verified reviews from collectors who've found their perfect watch with us." },
  { icon: "♻️", title: "Sustainability", desc: "We champion pre-owned luxury to reduce waste and preserve horological heritage." },
];

const team = [
  { name: "Marcus Webb", role: "Founder & CEO", bio: "30+ years in luxury watchmaking and auction houses." },
  { name: "Elena Rossi", role: "Head of Curation", bio: "Former Patek Philippe specialist with unmatched expertise." },
  { name: "James Chen", role: "Authentication Lead", bio: "Certified by WOSOG and Christie's with 2000+ pieces verified." },
  { name: "Sophie Laurent", role: "Client Relations", bio: "Dedicated to matching collectors with their dream timepieces." },
];

const timeline = [
  { year: 2008, title: "Founded", desc: "Started as a small boutique in Geneva, Switzerland." },
  { year: 2012, title: "Global Expansion", desc: "Opened offices in London, Tokyo, and New York." },
  { year: 2018, title: "Digital Pioneer", desc: "Launched world's first authenticated online luxury watch marketplace." },
  { year: 2023, title: "10,000+ Happy Collectors", desc: "Became trusted destination for discerning timepiece enthusiasts." },
];

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-24 animate-fade-up">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Chronolux</span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed max-w-3xl mb-8">
            We're more than an e-commerce platform. We're custodians of horological heritage, dedicated to connecting passionate collectors with authenticated timepieces from the world's most prestigious watchmakers.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-[#C9A84C] to-[#F0D080]" />
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-white/50 leading-relaxed">
              To make luxury timepieces accessible, authentic, and affordable. We believe every collector deserves access to authenticated, certified watches backed by transparent pricing and white-glove service.
            </p>
          </div>
          <div className="animate-fade-up-delay-1">
            <h2 className="font-display text-3xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-white/50 leading-relaxed">
              To become the world's most trusted marketplace for luxury watches, where expertise meets accessibility, and every transaction is guided by integrity, transparency, and a passion for horology.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-24">
          <h2 className="font-display text-4xl font-bold text-white mb-12 text-center">Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, i) => (
              <div
                key={val.title}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{val.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{val.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-24">
          <h2 className="font-display text-4xl font-bold text-white mb-12 text-center">Our Journey</h2>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <div
                key={item.year}
                className="flex gap-6 sm:gap-12 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0D080] flex items-center justify-center">
                    <span className="text-[#0A0A0F] font-black text-lg">{item.year}</span>
                  </div>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-24">
          <h2 className="font-display text-4xl font-bold text-white mb-12 text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={member.name}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F0D080] mx-auto mb-4 flex items-center justify-center">
                  <span className="text-[#0A0A0F] text-2xl font-black">{member.name[0]}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                <p className="text-[#C9A84C] text-sm font-semibold mb-3 tracking-wider">{member.role}</p>
                <p className="text-white/50 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-white/[0.05] to-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-12 text-center animate-fade-up">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-10">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: "16", label: "Years of Excellence" },
              { num: "40+", label: "Authorized Brands" },
              { num: "12K+", label: "Happy Collectors" },
              { num: "500+", label: "Authenticated Watches" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-3xl sm:text-4xl font-black text-[#C9A84C] mb-2">{num}</div>
                <div className="text-white/50 text-xs sm:text-sm tracking-widest uppercase">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mt-16 animate-fade-up-delay-2">
          <a href="#" className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-[#0A0A0F] text-sm font-black tracking-[0.2em] uppercase rounded-sm">
            Start Your Journey
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

const reviews = [
  {
    name: "Sebastian Hartmann",
    location: "Zürich, Switzerland",
    avatar: "SH",
    avatarColor: "#C9A84C",
    rating: 5,
    title: "Flawless acquisition, impeccable service",
    text: "I've purchased from auction houses and private dealers for 20 years. Chronolux matched the experience in every way — authentication was rigorous, packaging was extraordinary, and my Patek arrived in perfect condition.",
    product: "Patek Philippe Nautilus",
    verified: true,
  },
  {
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    avatar: "YT",
    avatarColor: "#3B9EFF",
    rating: 5,
    title: "The GMT I'd been hunting for 3 years",
    text: "Chronolux had the specific reference I needed with the original box and papers. The condition was exactly as described. White-glove delivery was a wonderful touch — opened the box with ceremony.",
    product: "Rolex GMT-Master II",
    verified: true,
  },
  {
    name: "Amara Diallo",
    location: "Paris, France",
    avatar: "AD",
    avatarColor: "#A855F7",
    rating: 5,
    title: "A gift that became a family heirloom",
    text: "Bought a Cartier Tank for my husband's 50th birthday. The concierge team helped me choose the right reference and included a personalised card. He was moved to tears. Worth every euro.",
    product: "Cartier Tank Américaine",
    verified: true,
  },
  {
    name: "Marcus Webb",
    location: "London, UK",
    avatar: "MW",
    avatarColor: "#EF4444",
    rating: 4,
    title: "Serious collectors take note",
    text: "The depth of inventory here is unreal. I found three references I'd marked as 'nearly impossible' — all authenticated, all fairly priced. Their market reports are also genuinely useful research tools.",
    product: "Audemars Piguet Royal Oak",
    verified: true,
  },
  {
    name: "Priya Nair",
    location: "Dubai, UAE",
    avatar: "PN",
    avatarColor: "#22D3EE",
    rating: 5,
    title: "Exceeded every expectation",
    text: "I was nervous buying online at this price point. The video authentication call put every concern to rest. The watch arrived in 48 hours, double-boxed with silk padding. Simply magnificent.",
    product: "IWC Portugieser Perpetual",
    verified: true,
  },
  {
    name: "Luca Ferretti",
    location: "Milan, Italy",
    avatar: "LF",
    avatarColor: "#F472B6",
    rating: 5,
    title: "Best online luxury experience, period",
    text: "As someone who works in fashion, presentation matters enormously to me. The unboxing was as beautiful as any maison. The watch itself was pristine. I've already recommended Chronolux to four colleagues.",
    product: "Omega Speedmaster Pro",
    verified: true,
  },
];

const StarFilled = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#C9A84C">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function Reviews() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Client Voices</p>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
            Worn With <br />
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">
              Confidence
            </span>
          </h2>
        </div>

        {/* Summary stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-black text-[#C9A84C]">4.9</div>
            <div className="flex justify-center mt-1 gap-0.5">
              {[1,2,3,4,5].map(i => <StarFilled key={i}/>)}
            </div>
            <div className="text-white/30 text-xs mt-1 tracking-wider">Average Rating</div>
          </div>
          <div className="w-px h-14 bg-white/10"/>
          <div className="text-center">
            <div className="text-4xl font-black text-white">12K+</div>
            <div className="text-white/30 text-xs mt-1 tracking-wider">Verified Reviews</div>
          </div>
          <div className="w-px h-14 bg-white/10"/>
          <div className="text-center">
            <div className="text-4xl font-black text-white">98%</div>
            <div className="text-white/30 text-xs mt-1 tracking-wider">Would Return</div>
          </div>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="group bg-[#111118] border border-white/5 rounded-2xl p-7 hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col gap-5"
          >
            {/* Top: avatar + name + stars */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-[#0A0A0F] text-sm font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${review.avatarColor}, ${review.avatarColor}80)` }}
                >
                  {review.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-sm">{review.name}</span>
                    {review.verified && (
                      <svg className="w-3.5 h-3.5 text-[#3B9EFF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <div className="text-white/30 text-xs mt-0.5">{review.location}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({length: review.rating}).map((_,i) => <StarFilled key={i}/>)}
              </div>
            </div>

            {/* Quote mark */}
            <svg className="w-6 h-6 text-[#C9A84C]/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>

            {/* Content */}
            <div className="flex-1">
              <h4 className="text-white font-bold text-sm mb-2 leading-snug">{review.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{review.text}</p>
            </div>

            {/* Product tag */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
              <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 3"/>
              </svg>
              <span className="text-[#C9A84C]/70 text-xs tracking-wider">{review.product}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 text-white/40 hover:text-[#C9A84C] text-sm tracking-widest uppercase transition-colors group">
          Read All 12,000+ Reviews
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </section>
  );
}

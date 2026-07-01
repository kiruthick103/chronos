import { useState } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

const questions = [
  {
    id: "budget",
    title: "What's Your Budget?",
    type: "select",
    options: [
      { label: "Under $2,000", value: "budget-low", max: 2000 },
      { label: "$2,000 - $5,000", value: "budget-mid", max: 5000 },
      { label: "$5,000 - $10,000", value: "budget-high", max: 10000 },
      { label: "$10,000+", value: "budget-luxury", max: 999999 },
    ],
  },
  {
    id: "use",
    title: "Primary Use?",
    type: "select",
    options: [
      { label: "Formal/Dress", value: "dress", category: "Dress Watches" },
      { label: "Sports/Adventure", value: "sport", category: "Dive Watches" },
      { label: "Precision Timing", value: "chrono", category: "Chronographs" },
      { label: "Smart Features", value: "smart", category: "Smart Luxury" },
    ],
  },
  {
    id: "waterResist",
    title: "Water Resistance Needed?",
    type: "select",
    options: [
      { label: "None (Dress only)", value: "none", min: 0 },
      { label: "Splash Resistant", value: "splash", min: 30 },
      { label: "Swim/Snorkel", value: "swim", min: 100 },
      { label: "Dive Ready (300m+)", value: "dive", min: 300 },
    ],
  },
  {
    id: "movement",
    title: "Movement Preference?",
    type: "select",
    options: [
      { label: "Automatic/Mechanical", value: "auto", type: "mechanical" },
      { label: "Quartz (Precise)", value: "quartz", type: "quartz" },
      { label: "No Preference", value: "any", type: "any" },
    ],
  },
];

function Quiz({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleSelect = (value, option) => {
    const newAnswers = { ...answers, [q.id]: { value, ...option } };
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrent(current + 1);
    }
  };

  const handleBack = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-5 sm:px-8 pt-32 pb-12">
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">{q.title}</h2>
            <span className="text-sm text-white/40 tracking-widest">{current + 1}/{questions.length}</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F0D080] transition-all duration-500" style={{ width: `${progress}%` }}/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value, opt)}
              className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 text-left group ${
                answers[q.id]?.value === opt.value
                  ? "border-[#C9A84C] bg-[#C9A84C]/15"
                  : "border-white/10 bg-white/[0.03] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/8"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                  answers[q.id]?.value === opt.value
                    ? "border-[#C9A84C] bg-[#C9A84C]"
                    : "border-white/40 group-hover:border-[#C9A84C]"
                }`}>
                  {answers[q.id]?.value === opt.value && (
                    <svg className="w-3 h-3 text-[#0A0A0F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <span className={`text-sm sm:text-base font-semibold transition-colors ${
                  answers[q.id]?.value === opt.value ? "text-white" : "text-white/70 group-hover:text-white"
                }`}>
                  {opt.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-between">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="px-6 py-3 border border-white/20 text-white/50 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/40 hover:text-white rounded-sm transition-all text-sm font-semibold tracking-wider uppercase"
          >
            Back
          </button>
          <button
            onClick={() => handleSelect(answers[q.id]?.value)}
            disabled={!answers[q.id]}
            className="btn-gold px-8 py-3 text-[#0A0A0F] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-black tracking-wider uppercase rounded-sm flex items-center gap-2"
          >
            {isLast ? "See Results" : "Next"}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Results({ answers, setPage }) {
  const [wishlist, setWishlist] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const { addToCart, products } = useCart();

  const filtered = products.filter(w => {
    const budget = answers.budget?.max || 999999;
    const category = answers.use?.category;
    const waterMin = answers.waterResist?.min || 0;
    const movement = answers.movement?.type;

    if (w.price > budget) return false;
    if (category && w.category !== category) return false;
    if (w.water < waterMin) return false;
    if (movement !== "any" && w.movement !== movement) return false;
    return true;
  });

  const displayWatches = filter === "all" ? filtered : filtered.filter(w => {
    if (filter === "price-asc") return true;
    if (filter === "price-desc") return true;
    if (filter === "rating") return w.rating >= 4.8;
    return true;
  }).sort((a, b) => {
    if (filter === "price-asc") return a.price - b.price;
    if (filter === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen px-5 sm:px-8 pt-32 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <button
            onClick={() => setPage("home")}
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#C9A84C] text-sm font-semibold tracking-wider mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Shop
          </button>

          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">Your Perfect Match</h1>
          <p className="text-white/40 text-base">{displayWatches.length} watches found based on your preferences</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/40 tracking-wider uppercase font-semibold">Sort:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-sm focus:border-[#C9A84C] focus:outline-none transition-colors"
            >
              <option value="all">Most Relevant</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayWatches.map((w) => (
            <div key={w.id} className="bg-[#111118] border border-white/5 rounded-2xl p-6 card-hover animate-fade-up cursor-pointer" onClick={() => onProductClick && onProductClick(w.id)}>
              <div className="h-40 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-[#C9A84C]/10">
                <WatchImage src={w.image} alt={w.name} className="w-full h-full object-cover" fallbackSize="text-4xl" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-white/25 tracking-widest uppercase mb-1">{w.brand}</p>
                  <h3 className="text-white font-bold text-base">{w.name}</h3>
                </div>
                <button
                  onClick={() => setWishlist(prev => {
                    const next = new Set(prev);
                    next.has(w.id) ? next.delete(w.id) : next.add(w.id);
                    return next;
                  })}
                  className="text-white/30 hover:text-[#EF4444] transition-colors"
                >
                  <svg className={`w-5 h-5 ${wishlist.has(w.id) ? "fill-[#EF4444]" : ""}`} fill={wishlist.has(w.id) ? "#EF4444" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Water Resistant</span>
                  <span className="text-white font-semibold">{w.water}m</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Movement</span>
                  <span className="text-white font-semibold capitalize">{w.movement}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-black text-lg">${w.price.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => addToCart(w, 1)}
                  className="btn-gold px-3 py-2 text-[#0A0A0F] text-xs font-bold rounded-sm"
                >
                  Add Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WatchFinder({ setPage, onProductClick }) {
  const [stage, setStage] = useState("quiz");
  const [answers, setAnswers] = useState(null);

  return (
    <>
      {stage === "quiz" ? (
        <Quiz onComplete={(ans) => {
          setAnswers(ans);
          setStage("results");
        }} />
      ) : (
        <Results answers={answers} setPage={setPage} />
      )}
    </>
  );
}

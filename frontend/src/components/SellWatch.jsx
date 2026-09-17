import { useState } from "react";
import { brandsList } from "../data/products";

export default function SellWatch({ setPage }) {
  const [formData, setFormData] = useState({
    brand: "Rolex",
    model: "",
    refNumber: "",
    year: "",
    condition: "Excellent (Pre-Owned)",
    boxPapers: "Complete Set (Box & Papers)",
    expectedPrice: "",
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-8 bg-[#090A0E] text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-8">
          <span className="text-[0.68rem] tracking-[0.3em] uppercase font-bold text-[#D4AF37] inline-block">
            Chronolux Horological Acquisitions
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Sell or Trade Your <br />
            <span className="italic font-normal bg-gradient-to-r from-[#F5E2B3] via-[#D4AF37] to-[#A98539] bg-clip-text text-transparent">
              Luxury Timepiece
            </span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg font-light leading-relaxed">
            Obtain top market valuation backed by instant wire transfer or trade towards your next grail with an exclusive 10% credit bonus.
          </p>
        </div>

        {/* 3-Step Process Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#0F1118] border border-white/10 relative group hover:border-[#D4AF37]/40 transition-all duration-300">
            <span className="text-3xl font-display font-bold text-[#D4AF37]/30 absolute top-6 right-6">
              01
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">1. Request Valuation</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Submit your watch reference, condition, and photos. Our horologists provide an actionable quote within 2 hours.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F1118] border border-white/10 relative group hover:border-[#D4AF37]/40 transition-all duration-300">
            <span className="text-3xl font-display font-bold text-[#D4AF37]/30 absolute top-6 right-6">
              02
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">2. Fully Insured Courier</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              We provide a prepaid, fully insured armored shipping kit with tamper-evident seal and real-time GPS tracking.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0F1118] border border-white/10 relative group hover:border-[#D4AF37]/40 transition-all duration-300">
            <span className="text-3xl font-display font-bold text-[#D4AF37]/30 absolute top-6 right-6">
              03
            </span>
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">3. Instant Wire Payout</h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Upon 30-point inspection at our Geneva/New York vault, funds are disbursed the same day directly to your bank account.
            </p>
          </div>
        </div>

        {/* Valuation Submission Form */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0D0E14] border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="mb-8 pb-6 border-b border-white/10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Instant Watch Appraisal Request
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Confidential &bull; No obligation &bull; Complimentary appraisal
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-white">Appraisal Request Submitted</h3>
              <p className="text-white/60 text-sm max-w-md mx-auto">
                Thank you, {formData.name || "Collector"}. Our Senior Horologist is reviewing your {formData.brand} timepiece and will contact you at {formData.email} within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-lg border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase hover:bg-[#D4AF37]/10"
              >
                Submit Another Timepiece
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Brand *
                  </label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    {brandsList.map((b) => (
                      <option key={b} value={b} className="bg-[#14161F]">
                        {b}
                      </option>
                    ))}
                    <option value="Other" className="bg-[#14161F]">Other Luxury Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Submariner, Nautilus, Royal Oak"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 126610LN, 5711/1A"
                    value={formData.refNumber}
                    onChange={(e) => setFormData({ ...formData, refNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Box &amp; Papers Status
                  </label>
                  <select
                    value={formData.boxPapers}
                    onChange={(e) => setFormData({ ...formData, boxPapers: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Complete Set (Box & Papers)">Complete Set (Box & Papers)</option>
                    <option value="Original Papers Only">Original Papers Only</option>
                    <option value="Original Box Only">Original Box Only</option>
                    <option value="Watch Only">Watch Only</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Unworn / New In Box">Unworn / New In Box</option>
                    <option value="Mint / Like New">Mint / Like New</option>
                    <option value="Excellent (Pre-Owned)">Excellent (Pre-Owned)</option>
                    <option value="Vintage (Original Patina)">Vintage (Original Patina)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Approx. Year
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2022"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Expected Amount ($)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/70 mb-2">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/10 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C378] to-[#C5A059] text-[#090A0E] text-xs font-bold tracking-[0.2em] uppercase shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.5)] transition-all"
              >
                Request Free Insured Appraisal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

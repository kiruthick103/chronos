import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#07070A] border-y border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
        <span className="text-[0.68rem] tracking-[0.3em] uppercase font-bold text-[#D4AF37] inline-block">
          Chronolux Private Circle
        </span>

        <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Receive $250 Towards Your First Acquisition
        </h2>

        <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
          Subscribe for confidential private vault releases, horological market intelligence, and invitation-only collector salons.
        </p>

        {subscribed ? (
          <div className="p-6 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 max-w-md mx-auto animate-fade-in">
            <svg className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h4 className="font-display font-bold text-lg text-white">Welcome to the Circle</h4>
            <p className="text-xs text-white/70 mt-1">
              Your promotional code <span className="font-mono text-[#D4AF37] font-bold">CHRONO250</span> has been issued.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl bg-[#12131A] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap px-7 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#D4AF37] text-[#090A0E] text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-lg"
            >
              Claim Voucher
            </button>
          </form>
        )}

        <p className="text-[0.65rem] text-white/30 tracking-wider">
          By subscribing, you agree to our Terms and Privacy Policy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}

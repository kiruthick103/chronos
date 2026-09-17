import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Signup({ setPage }) {
  const { signUp, connectionStatus } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);

    if (result.success) {
      setSuccess("Account successfully created! Redirecting to Chronolux...");
      setTimeout(() => {
        setPage("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 1200);
    } else {
      setError(result.error || "Unable to complete registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-24">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-[#0D0D14] border border-white/8 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-sm">

          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-[0_0_24px_rgba(201,168,76,0.35)] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#0A0A0F" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.12em] text-white uppercase">
              Chrono<span className="text-[#C9A84C]">lux</span>
            </h1>
            <p className="text-white/40 text-sm mt-1 tracking-wider">Join The Collectors Guild</p>
          </div>

          {/* Reconnect notice if cloud is waking up */}
          {connectionStatus === "reconnecting" && (
            <div className="mb-6 px-3.5 py-2.5 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-xs text-[#E5C378] flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A84C]"></span>
              </span>
              <span>Supabase Cloud Resuming &bull; Session auto-persists locally</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm leading-relaxed flex items-center gap-2">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="flex flex-col gap-4" noValidate>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-name" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="James Bond"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/[0.06] transition-all duration-200"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-email" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/[0.06] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-password" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/[0.06] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="signup-confirm-password" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#C9A84C]/60 focus:bg-white/[0.06] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading || !!success}
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-[#0A0A0F] font-black text-sm tracking-[0.18em] uppercase rounded-xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(201,168,76,0.25)]"
            >
              {loading ? "Creating account…" : "Register Account"}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-white/35">
            Already have an account?{" "}
            <button
              id="go-to-login-btn"
              onClick={() => setPage("login")}
              className="text-[#C9A84C] hover:text-[#F0D080] font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-5 text-center">
          <button
            onClick={() => setPage("home")}
            className="text-xs text-white/30 hover:text-white/60 tracking-widest uppercase transition-colors"
          >
            ← Back to store
          </button>
        </div>
      </div>
    </div>
  );
}

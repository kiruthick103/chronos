import { useState } from "react";
import { supabase } from "../supabaseClient";

const DEMO_EMAIL = "kiruthick3238q@gmail.com";
const DEMO_PASSWORD = "Kiruthick@123";

export default function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const doLogin = async (loginEmail, loginPassword) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    return signInError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const err = await doLogin(email, password);
    setLoading(false);
    if (err) setError(err.message);
    // on success, AuthContext fires → App.jsx redirects to home automatically
  };

  const handleDemoLogin = async () => {
    setError("");
    setDemoLoading(true);
    // visually fill the fields so the user can see the credentials
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    // small delay so the fill animation is visible
    await new Promise((r) => setTimeout(r, 600));
    const err = await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    setDemoLoading(false);
    if (err) setError(err.message);
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
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center shadow-[0_0_24px_rgba(201,168,76,0.35)] mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#0A0A0F" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-[0.12em] text-white uppercase">
              Chrono<span className="text-[#C9A84C]">lux</span>
            </h1>
            <p className="text-white/40 text-sm mt-1 tracking-wider">Welcome back</p>
          </div>

          {/* ── Demo Login Banner ── */}
          <div className="mb-6 rounded-xl border border-[#C9A84C]/25 bg-[#C9A84C]/5 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 w-7 h-7 rounded-full bg-[#C9A84C]/15 flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-1">Demo Access</p>
                <p className="text-white/50 text-xs leading-relaxed mb-3">
                  Explore the full store and admin panel instantly with our demo account.
                </p>
                <div className="flex flex-col gap-1 mb-3 font-mono text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 w-14 flex-shrink-0">Email</span>
                    <span className="text-white/70 truncate">{DEMO_EMAIL}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/30 w-14 flex-shrink-0">Password</span>
                    <span className="text-white/70">Kiruthick@123</span>
                  </div>
                </div>
                <button
                  id="demo-login-btn"
                  onClick={handleDemoLogin}
                  disabled={demoLoading || loading}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#C9A84C] to-[#F0D080] text-[#0A0A0F] text-xs font-black tracking-[0.15em] uppercase hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_2px_16px_rgba(201,168,76,0.2)]"
                >
                  {demoLoading ? (
                    <>
                      <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                      </svg>
                      Try Demo →
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/25 tracking-widest uppercase">or sign in manually</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
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
                  id="login-email"
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
              <label htmlFor="login-password" className="text-xs text-white/50 tracking-[0.15em] uppercase font-medium">
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
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading || demoLoading}
              className="mt-2 w-full py-3.5 bg-white/[0.06] border border-white/12 text-white font-bold text-sm tracking-[0.12em] uppercase rounded-xl hover:bg-white/[0.10] hover:border-white/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-white/35">
            Don't have an account?{" "}
            <button
              id="go-to-signup-btn"
              onClick={() => setPage("signup")}
              className="text-[#C9A84C] hover:text-[#F0D080] font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

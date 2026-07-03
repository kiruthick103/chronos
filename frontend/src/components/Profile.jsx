import { useAuth } from "../context/AuthContext";

export default function Profile({ setPage }) {
  const { user, isAdmin, signOut } = useAuth();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-start justify-center pt-28 pb-20 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A84C]/4 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">

        {/* ── Avatar + name header ── */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-2xl font-black text-[#0A0A0F] shadow-[0_0_32px_rgba(201,168,76,0.35)]">
              {initials}
            </div>
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg" title="Admin">
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#0A0A0F" strokeWidth="2.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">{displayName}</h1>
          {isAdmin && (
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] text-xs font-bold tracking-widest uppercase">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Admin
            </span>
          )}
        </div>

        {/* ── Info card ── */}
        <div className="bg-[#0D0D14] border border-white/8 rounded-2xl overflow-hidden shadow-2xl mb-4">

          {/* Section header */}
          <div className="px-6 py-4 border-b border-white/6">
            <p className="text-xs text-white/35 tracking-[0.2em] uppercase font-medium">Account Details</p>
          </div>

          {/* Fields */}
          <div className="divide-y divide-white/5">

            {/* Full name */}
            <div className="flex items-center px-6 py-4 gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="1.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/35 tracking-wider uppercase mb-0.5">Full Name</p>
                <p className="text-sm text-white font-medium truncate">{displayName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center px-6 py-4 gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/35 tracking-wider uppercase mb-0.5">Email</p>
                <p className="text-sm text-white font-medium truncate">{user?.email}</p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center px-6 py-4 gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="1.8">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/35 tracking-wider uppercase mb-0.5">Role</p>
                <p className="text-sm font-medium">
                  {isAdmin ? (
                    <span className="text-[#C9A84C]">Administrator</span>
                  ) : (
                    <span className="text-white/70">Customer</span>
                  )}
                </p>
              </div>
            </div>

            {/* Member since */}
            <div className="flex items-center px-6 py-4 gap-4">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#C9A84C" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/35 tracking-wider uppercase mb-0.5">Member Since</p>
                <p className="text-sm text-white/70 font-medium">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Admin shortcut (admins only) ── */}
        {isAdmin && (
          <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-2xl px-6 py-4 mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-0.5">Admin Access</p>
              <p className="text-white/40 text-xs">You have full admin privileges</p>
            </div>
            <button
              onClick={() => setPage("admin")}
              className="flex-shrink-0 px-4 py-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30 rounded-lg text-[#C9A84C] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C]/25 transition-colors"
            >
              Open Panel →
            </button>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="bg-[#0D0D14] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
          <button
            onClick={() => setPage("home")}
            className="w-full flex items-center gap-3 px-6 py-4 text-sm text-white/60 hover:text-white hover:bg-white/4 transition-colors border-b border-white/5 text-left"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Back to Store
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-4 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

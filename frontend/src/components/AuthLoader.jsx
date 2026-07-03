export default function AuthLoader() {
  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center z-[999]">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 56 56" className="w-14 h-14 animate-spin" style={{ animationDuration: "2s" }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke="#C9A84C22" strokeWidth="3" />
            <circle
              cx="28" cy="28" r="24"
              fill="none" stroke="url(#authSpinGold)"
              strokeWidth="3" strokeDasharray="30 120" strokeLinecap="round"
            />
            <defs>
              <linearGradient id="authSpinGold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#F0D080" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="#C9A84C" strokeWidth="1.8" />
              <path d="M12 7v5l3 3" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <span className="text-xs text-[#C9A84C]/50 tracking-[0.35em] uppercase font-medium">
          Chronolux
        </span>
      </div>
    </div>
  );
}

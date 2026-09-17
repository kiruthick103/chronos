import { useState, useEffect } from "react";

export default function WatchImage({ src, alt, className = "", fallbackSize = "" }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Reset states if the src changes
  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#12131A] via-[#0D0E13] to-[#08090C] text-center select-none relative overflow-hidden p-4 group">
        {/* Subtle radial golden glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

        {/* Bespoke Horological Dial Emblem */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#D4AF37]/30 bg-[#0A0B0E] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer case bevel */}
            <circle cx="50" cy="50" r="46" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.3" />
            <circle cx="50" cy="50" r="42" fill="#0D0E14" stroke="#D4AF37" strokeWidth="0.75" opacity="0.5" />
            
            {/* Hour Markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const r1 = deg % 90 === 0 ? 32 : 35;
              const r2 = 40;
              const x1 = 50 + r1 * Math.cos(rad);
              const y1 = 50 + r1 * Math.sin(rad);
              const x2 = 50 + r2 * Math.cos(rad);
              const y2 = 50 + r2 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#D4AF37"
                  strokeWidth={deg % 90 === 0 ? "2" : "1"}
                  strokeLinecap="round"
                  opacity={deg % 90 === 0 ? "0.9" : "0.5"}
                />
              );
            })}

            {/* Watch Hands */}
            <line x1="50" y1="50" x2="50" y2="24" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" />
            <line x1="50" y1="50" x2="68" y2="40" stroke="#F5E2B3" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="50" cy="50" r="3" fill="#D4AF37" />
          </svg>
        </div>

        <span className="mt-2 text-[0.6rem] tracking-[0.25em] uppercase font-bold text-[#D4AF37]/80 leading-none">
          Chronolux
        </span>
        <span className="text-[0.5rem] tracking-[0.3em] uppercase text-white/30 mt-0.5">
          Certified Horology
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Shimmer skeleton loader while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-white/[0.08] to-white/[0.03] animate-pulse rounded-lg" />
      )}
      <img
        src={src}
        alt={alt || "Luxury Timepiece"}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

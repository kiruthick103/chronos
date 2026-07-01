import { useState, useEffect } from "react";

export default function WatchImage({ src, alt, className, fallbackSize = "text-4xl" }) {
  const [error, setError] = useState(false);

  // Reset error state if the src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-white/[0.08] text-white/40 select-none">
        <span className={fallbackSize} role="img" aria-label="Watch placeholder">⌚</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

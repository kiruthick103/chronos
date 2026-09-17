import React from "react";

export default function TrustBar() {
  const trustItems = [
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: "Certified Authentic",
      subtext: "30-Point Horologist Inspection"
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      label: "Free Insured Shipping",
      subtext: "Armored Courier Worldwide"
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      label: "14-Day Returns",
      subtext: "100% Full Refund Privilege"
    },
    {
      icon: (
        <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Lifetime Authenticity Guarantee",
      subtext: "Serial Matched & Escrow Backed"
    }
  ];

  return (
    <div className="bg-[#07070A] border-b border-[#D4AF37]/15 py-2 px-4 text-xs font-sans text-white/70 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-6 sm:gap-8">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <span className="p-1 rounded bg-[#D4AF37]/10 flex items-center justify-center">
              {item.icon}
            </span>
            <span className="font-semibold text-white tracking-wide uppercase text-[0.7rem]">
              {item.label}
            </span>
            <span className="hidden md:inline text-white/40 text-[0.68rem] tracking-normal">
              — {item.subtext}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

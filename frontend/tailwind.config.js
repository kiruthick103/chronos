/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#FDF9EC",
          100: "#FAF0C8",
          200: "#F5DC8A",
          300: "#F0D080",
          400: "#E8C05A",
          500: "#C9A84C",
          600: "#A88730",
          700: "#866A1E",
          800: "#634E14",
          900: "#40320C",
        },
        obsidian: {
          50:  "#f4f4f6",
          100: "#e8e8ed",
          200: "#c9c9d4",
          300: "#9999af",
          400: "#666682",
          500: "#3d3d58",
          600: "#252538",
          700: "#141420",
          800: "#0D0D14",
          900: "#0A0A0F",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #F0D080 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(135deg, #0A0A0F 0%, #0D0D14 100%)",
        "hero-radial": "radial-gradient(ellipse at top, #C9A84C10 0%, transparent 60%)",
      },
      boxShadow: {
        "gold": "0 0 40px rgba(201, 168, 76, 0.3)",
        "gold-lg": "0 0 80px rgba(201, 168, 76, 0.2)",
        "card": "0 24px 64px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};

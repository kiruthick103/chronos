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
          50:  "#FAF6EC",
          100: "#F4ECCC",
          200: "#EBD89A",
          300: "#DFC268",
          400: "#D4AF37",
          500: "#C5A059",
          600: "#A98539",
          700: "#8A6A27",
          800: "#644C1B",
          900: "#3D2D10",
        },
        brass: {
          300: "#E8C97E",
          400: "#D4AF37",
          500: "#C5A059",
          600: "#A68032",
        },
        obsidian: {
          50:  "#f4f4f6",
          100: "#e8e8ed",
          200: "#c9c9d4",
          300: "#9999af",
          400: "#666682",
          500: "#3d3d58",
          600: "#222230",
          700: "#181822",
          800: "#111118",
          900: "#0A0A0F",
          950: "#07070A",
        },
        charcoal: {
          800: "#14161C",
          850: "#101217",
          900: "#0C0D11",
          950: "#08090C",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
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

# ⌚ Chronolux — Premium Watch E-Commerce Landing Page

A luxury watch e-commerce homepage built with **React 18** + **Tailwind CSS 3** + **Vite**.

## Stack

| Tool | Version |
|------|---------|
| React | 18.3 |
| Tailwind CSS | 3.4 |
| Vite | 5.4 |
| PostCSS | 8.4 |

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky nav with mobile menu
│   │   ├── Hero.jsx          # Full-screen hero with SVG watch
│   │   ├── Brands.jsx        # Auto-scrolling brand marquee
│   │   ├── Categories.jsx    # 4-column category cards
│   │   ├── Products.jsx      # Filterable 8-product grid
│   │   ├── OfferBanner.jsx   # Flash sale with live countdown
│   │   ├── Reviews.jsx       # 6-card testimonial grid
│   │   └── Footer.jsx        # Full footer with newsletter
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- **Navbar** — Sticky glass morphism, mobile hamburger menu, gold CTA
- **Hero** — Full-screen with animated SVG watch illustration, floating spec badges, stat counters
- **Brands** — Infinite marquee ticker (pauses on hover) with 8 luxury brands
- **Categories** — 4 watch categories (Dress, Dive, Chrono, Smart) with custom SVG icons
- **Products** — 8 watch cards with filter tabs, wishlist toggle, SVG watch faces, ratings
- **Offer Banner** — Flash sale with live countdown timer, animated SVG watch
- **Reviews** — 6 verified client testimonials with ratings and product attribution
- **Footer** — Newsletter signup, 4-column links, social icons, trust badges

## Design System

- **Background**: `#0A0A0F` (deep obsidian)
- **Gold accent**: `#C9A84C` → `#F0D080` gradient
- **Typography**: Inter (sans) + Google Fonts
- **Cards**: `#111118` with `border-white/5`
- **All watch illustrations**: Pure inline SVG — no external images required

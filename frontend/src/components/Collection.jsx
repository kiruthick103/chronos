import { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";
import { brandsList, categoriesList, materialsList, conditionsList } from "../data/products";

function SkeletonCard() {
  return (
    <div className="bg-[#0F1118] border border-white/5 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-60 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-white/10 rounded" />
        <div className="h-5 w-4/5 bg-white/10 rounded" />
        <div className="h-3 w-24 bg-white/10 rounded" />
        <div className="flex justify-between items-center pt-3 border-t border-white/5">
          <div className="h-6 w-24 bg-white/10 rounded" />
          <div className="w-9 h-9 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function Collection({ onProductClick, initialFilter = null }) {
  const { products, addToCart, toggleWishlist, wishlist } = useCart();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState(() => {
    if (initialFilter?.brand) return [initialFilter.brand];
    return [];
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (initialFilter?.category) return initialFilter.category;
    return "All";
  });
  const [selectedPriceTier, setSelectedPriceTier] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState(() => {
    if (initialFilter?.condition) return initialFilter.condition;
    return "all";
  });
  const [sortOption, setSortOption] = useState("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addedToCartId, setAddedToCartId] = useState(null);

  // Sync initialFilter prop updates (e.g. when user clicks Mega-Menu link)
  useEffect(() => {
    if (initialFilter?.brand) {
      setSelectedBrands([initialFilter.brand]);
    }
    if (initialFilter?.category) {
      setSelectedCategory(initialFilter.category);
    }
    if (initialFilter?.condition) {
      setSelectedCondition(initialFilter.condition);
    }
  }, [initialFilter]);

  // Handle filter changes with a subtle simulated loading skeleton
  const triggerLoading = () => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  };

  const handleBrandToggle = (brand) => {
    triggerLoading();
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    triggerLoading();
    setSearchQuery("");
    setSelectedBrands([]);
    setSelectedCategory("All");
    setSelectedPriceTier("all");
    setSelectedMaterial("all");
    setSelectedCondition("all");
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search Query (Name, Brand, Reference Number)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesRef = p.refNumber ? p.refNumber.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesBrand && !matchesRef) return false;
      }

      // 2. Brand Filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(p.brand)) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== "All") {
        if (p.category !== selectedCategory) return false;
      }

      // 4. Price Tier Filter
      if (selectedPriceTier === "under-10k" && p.price >= 10000) return false;
      if (selectedPriceTier === "10k-25k" && (p.price < 10000 || p.price > 25000)) return false;
      if (selectedPriceTier === "25k-50k" && (p.price < 25000 || p.price > 50000)) return false;
      if (selectedPriceTier === "over-50k" && p.price <= 50000) return false;

      // 5. Case Material
      if (selectedMaterial !== "all") {
        if (p.caseMaterial !== selectedMaterial) return false;
      }

      // 6. Condition Filter
      if (selectedCondition !== "all") {
        if (p.condition !== selectedCondition) return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedBrands,
    selectedCategory,
    selectedPriceTier,
    selectedMaterial,
    selectedCondition
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "newest":
        return list.sort((a, b) => (b.year || 2024) - (a.year || 2024));
      case "popularity":
        return list.sort((a, b) => b.rating - a.rating || (b.reviews || 0) - (a.reviews || 0));
      case "featured":
      default:
        return list;
    }
  }, [filteredProducts, sortOption]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCartId(product.id);
    setTimeout(() => setAddedToCartId(null), 1500);
  };

  const handleToggleWishlist = (e, product) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const activeFilterCount =
    (selectedBrands.length ? 1 : 0) +
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedPriceTier !== "all" ? 1 : 0) +
    (selectedMaterial !== "all" ? 1 : 0) +
    (selectedCondition !== "all" ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-[#090A0E] text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Editorial Collection Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              <span className="text-[0.68rem] tracking-[0.25em] uppercase font-bold text-[#D4AF37]">
                The Chronolux Vault
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
              The Complete <span className="italic font-normal text-[#E5C378]">Catalog</span>
            </h1>
            <p className="text-white/50 text-sm sm:text-base max-w-2xl mt-2 font-light">
              32+ certified authentic luxury timepieces across 12 prestigious ateliers. Fully inspected, calibrated, and guaranteed.
            </p>
          </div>

          {/* Quick Active Counts */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-white/40">
              Showing <span className="text-white font-bold">{sortedProducts.length}</span> of {products.length} Timepieces
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[#D4AF37] hover:underline font-semibold tracking-wider uppercase text-[0.7rem]"
              >
                Reset Filters ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Live Search & Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0D0E14] p-4 rounded-2xl border border-white/10">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by brand, reference (e.g. 126610LN), or model..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                triggerLoading();
              }}
              className="w-full bg-[#141620] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                &times;
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141620] border border-white/10 text-xs font-semibold uppercase tracking-wider text-white"
            >
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <span className="text-[0.68rem] tracking-wider uppercase text-white/40 hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  triggerLoading();
                }}
                className="w-full md:w-auto bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="featured">Curated Spotlight</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Collector Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-[#0D0E14] border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-white">
                Filter Vault
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-[0.68rem] text-[#D4AF37] hover:underline uppercase tracking-wider"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Brands Filter */}
            <div className="space-y-3">
              <label className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block">
                Brand ({selectedBrands.length ? selectedBrands.length : "All"})
              </label>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 no-scrollbar">
                {brandsList.map((brand) => {
                  const isChecked = selectedBrands.includes(brand);
                  const brandCount = products.filter((p) => p.brand === brand).length;
                  return (
                    <label
                      key={brand}
                      className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(brand)}
                          className="rounded border-white/20 bg-white/5 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className={isChecked ? "text-[#E5C378] font-bold" : "text-white/70 group-hover:text-white"}>
                          {brand}
                        </span>
                      </div>
                      <span className="text-[0.65rem] text-white/30 font-mono">
                        {brandCount}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Horological Category Filter */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block">
                Category
              </label>
              <div className="space-y-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      triggerLoading();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#D4AF37]/15 text-[#E5C378] font-bold border border-[#D4AF37]/30"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[0.65rem] text-white/30 font-mono">
                      {cat === "All" ? products.length : products.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block">
                Price Range
              </label>
              <div className="space-y-1 text-xs">
                {[
                  { id: "all", label: "All Values" },
                  { id: "under-10k", label: "Under $10,000" },
                  { id: "10k-25k", label: "$10,000 – $25,000" },
                  { id: "25k-50k", label: "$25,000 – $50,000" },
                  { id: "over-50k", label: "$50,000+" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedPriceTier(tier.id);
                      triggerLoading();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors ${
                      selectedPriceTier === tier.id
                        ? "bg-[#D4AF37]/15 text-[#E5C378] font-bold border border-[#D4AF37]/30"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Case Material */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block">
                Case Material
              </label>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedMaterial("all");
                    triggerLoading();
                  }}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs ${
                    selectedMaterial === "all"
                      ? "bg-[#D4AF37]/15 text-[#E5C378] font-bold border border-[#D4AF37]/30"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Materials
                </button>
                {materialsList.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMaterial(m);
                      triggerLoading();
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs ${
                      selectedMaterial === m
                        ? "bg-[#D4AF37]/15 text-[#E5C378] font-bold border border-[#D4AF37]/30"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-[#D4AF37] block">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                {["all", ...conditionsList].map((cond) => (
                  <button
                    key={cond}
                    onClick={() => {
                      setSelectedCondition(cond);
                      triggerLoading();
                    }}
                    className={`py-1.5 px-2 rounded-lg capitalize text-[0.7rem] transition-colors ${
                      selectedCondition === cond
                        ? "bg-[#D4AF37] text-[#090A0E] font-bold"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {cond === "all" ? "All" : cond}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid (9 cols) */}
          <main className="lg:col-span-9">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-24 bg-[#0D0E14] border border-white/5 rounded-3xl p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  No Timepieces Match Your Criteria
                </h3>
                <p className="text-sm text-white/50 max-w-md mx-auto">
                  Try clearing some filters or searching for alternative reference numbers or brand names.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#C5A059] text-[#090A0E] text-xs font-bold tracking-wider uppercase hover:bg-[#D4AF37]"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((p, idx) => {
                  const isWishlisted = wishlist.some((w) => w.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onProductClick && onProductClick(p.id)}
                      className="group bg-[#0D0E14] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col justify-between cursor-pointer animate-fade-up relative"
                      style={{ animationDelay: `${(idx % 6) * 0.05}s` }}
                    >
                      {/* Product Image Container */}
                      <div className="relative aspect-square overflow-hidden bg-[#050608] flex items-center justify-center">
                        <WatchImage
                          src={p.image}
                          alt={`${p.brand} ${p.name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
                          {p.certified && (
                            <span className="bg-[#090A0E]/90 border border-[#D4AF37]/50 text-[#D4AF37] px-2.5 py-0.5 rounded-full text-[0.62rem] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Certified</span>
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[0.62rem] font-bold tracking-wider uppercase shadow-md ${
                              p.condition === "New"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : p.condition === "Vintage"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-white/10 text-white/80 border border-white/20"
                            }`}
                          >
                            {p.condition}
                          </span>
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, p)}
                          aria-label="Toggle wishlist"
                          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                            isWishlisted
                              ? "bg-[#D4AF37] text-[#090A0E]"
                              : "bg-[#090A0E]/80 text-white/70 hover:text-white border border-white/10"
                          }`}
                        >
                          <svg className="w-4 h-4" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Card Information */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-[0.65rem] text-[#D4AF37] font-semibold tracking-[0.2em] uppercase mb-1">
                            <span>{p.brand}</span>
                            <span className="text-white/40 font-mono tracking-normal">{p.refNumber}</span>
                          </div>
                          <h3 className="font-display font-bold text-base text-white group-hover:text-[#E5C378] transition-colors line-clamp-1">
                            {p.name}
                          </h3>
                          <p className="text-[0.7rem] text-white/40 mt-1 line-clamp-1">
                            {p.specs?.caseSize} &bull; {p.caseMaterial} &bull; {p.specs?.movement?.split(" ")[0]}
                          </p>
                        </div>

                        {/* Price & Action Row */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <span className="font-display font-bold text-lg text-white">
                              ${p.price.toLocaleString()}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="block text-[0.68rem] text-white/40 line-through">
                                ${p.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleAddToCart(e, p)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
                              addedToCartId === p.id
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-[#161822] hover:bg-[#C5A059] text-white hover:text-[#090A0E] border border-white/10 hover:border-transparent"
                            }`}
                          >
                            {addedToCartId === p.id ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Added</span>
                              </>
                            ) : (
                              <span>Acquire</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-sm bg-[#0D0E14] h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">Filter Vault</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            {/* Brands in Mobile */}
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#D4AF37] mb-2">Brands</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {brandsList.map((b) => (
                  <button
                    key={b}
                    onClick={() => handleBrandToggle(b)}
                    className={`py-1.5 px-2 rounded-lg text-left truncate ${
                      selectedBrands.includes(b)
                        ? "bg-[#D4AF37] text-[#090A0E] font-bold"
                        : "bg-white/5 text-white/70"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Tier */}
            <div>
              <p className="text-xs font-bold tracking-wider uppercase text-[#D4AF37] mb-2">Price</p>
              <div className="space-y-1.5 text-xs">
                {[
                  { id: "all", label: "All Values" },
                  { id: "under-10k", label: "Under $10,000" },
                  { id: "10k-25k", label: "$10,000 – $25,000" },
                  { id: "25k-50k", label: "$25,000 – $50,000" },
                  { id: "over-50k", label: "$50,000+" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedPriceTier(tier.id)}
                    className={`block w-full text-left py-1.5 px-3 rounded-lg ${
                      selectedPriceTier === tier.id
                        ? "bg-[#D4AF37] text-[#090A0E] font-bold"
                        : "bg-white/5 text-white/70"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileFilterOpen(false);
                triggerLoading();
              }}
              className="w-full py-3 rounded-xl bg-[#C5A059] text-[#090A0E] text-xs font-bold tracking-wider uppercase mt-6"
            >
              Apply ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

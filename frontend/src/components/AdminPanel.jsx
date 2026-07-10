import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import WatchImage from "./WatchImage";

export default function AdminPanel() {
  const {
    products,
    orders,
    payments = [],
    offer,
    dbStatus,
    addProduct,
    editProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
    updateOffer,
    refreshProducts,
    refreshOrders,
    refreshPayments
  } = useCart();

  const [activeTab, setActiveTab] = useState("overview");
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All");

  // Product Form State
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: "Dress Watches",
    style: "dress",
    gender: "men",
    image: "",
    water: "50",
    movement: "mechanical",
    feature: "",
    description: "",
    specs: {
      movement: "",
      jewels: "",
      waterResistance: "",
      caseSize: "",
      caseMaterial: "",
      crystal: "Sapphire",
      bracelet: ""
    }
  });

  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");

  // Offer Form State
  const [offerForm, setOfferForm] = useState({
    title: offer.title,
    subtitle: offer.subtitle,
    discount: offer.discount,
    description: offer.description,
    watchName: offer.watchName,
    endTimeHours: 48
  });
  const [offerSuccess, setOfferSuccess] = useState("");

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null });

  // Get unique categories for dropdown
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Calculations for Overview Tab
  const totalRevenue = orders.reduce((sum, o) => o.payment_status === "paid" ? sum + o.total : sum, 0);
  const pendingRevenue = orders.reduce((sum, o) => o.payment_status === "pending" ? sum + o.total : sum, 0);
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  // Handle Product Form Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductFormError("");
    setProductFormSuccess("");

    if (!productForm.name || !productForm.brand || !productForm.price) {
      setProductFormError("Please fill in Name, Brand, and Price.");
      return;
    }

    const payload = {
      ...productForm,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
      water: Number(productForm.water),
      specs: {
        ...productForm.specs,
        movement: productForm.specs.movement || productForm.movement,
        waterResistance: productForm.specs.waterResistance || `${productForm.water}m`
      }
    };

    let result;
    if (isEditingProduct) {
      result = await editProduct(productForm.id, payload);
    } else {
      result = await addProduct(payload);
    }

    if (result.success) {
      setProductFormSuccess(isEditingProduct ? "✓ Watch updated successfully!" : "✓ Watch added successfully!");
      setTimeout(() => {
        setShowProductForm(false);
        resetProductForm();
      }, 1200);
    } else {
      setProductFormError(`Database Warning: ${result.error}. (Stored locally for this session).`);
      setTimeout(() => {
        setShowProductForm(false);
        resetProductForm();
      }, 3500);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      id: null,
      name: "",
      brand: "",
      price: "",
      originalPrice: "",
      category: "Dress Watches",
      style: "dress",
      gender: "men",
      image: "",
      water: "50",
      movement: "mechanical",
      feature: "",
      description: "",
      specs: {
        movement: "",
        jewels: "",
        waterResistance: "",
        caseSize: "",
        caseMaterial: "",
        crystal: "Sapphire",
        bracelet: ""
      }
    });
    setIsEditingProduct(false);
  };

  const handleEditClick = (p) => {
    setProductForm({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      originalPrice: p.originalPrice || "",
      category: p.category || "Dress Watches",
      style: p.style || "dress",
      gender: p.gender || "men",
      image: p.image || "",
      water: p.water || "50",
      movement: p.movement || "mechanical",
      feature: p.feature || "",
      description: p.description || "",
      specs: {
        movement: p.specs?.movement || "",
        jewels: p.specs?.jewels || "",
        waterResistance: p.specs?.waterResistance || "",
        caseSize: p.specs?.caseSize || "",
        caseMaterial: p.specs?.caseMaterial || "",
        crystal: p.specs?.crystal || "Sapphire",
        bracelet: p.specs?.bracelet || ""
      }
    });
    setIsEditingProduct(true);
    setShowProductForm(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteClick = (type, id) => {
    setDeleteConfirm({ type, id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (type === "product") {
      await deleteProduct(id);
    } else if (type === "order") {
      await deleteOrder(id);
    }
    setDeleteConfirm({ type: null, id: null });
  };

  // Handle Offer Form Submit
  const handleOfferSubmit = (e) => {
    e.preventDefault();
    updateOffer({
      title: offerForm.title,
      subtitle: offerForm.subtitle,
      discount: Number(offerForm.discount),
      description: offerForm.description,
      watchName: offerForm.watchName,
      endTime: Date.now() + Number(offerForm.endTimeHours) * 3600 * 1000
    });
    setOfferSuccess("✓ Offer campaign updated successfully!");
    setTimeout(() => setOfferSuccess(""), 3000);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === "All" || p.category === productCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-5 sm:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 animate-fade-up">
          <div>
            <span className="text-[#C9A84C] text-[0.68rem] tracking-[0.3em] uppercase font-semibold mb-3 block">MANAGEMENT CENTER</span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center gap-4">
              Admin <span className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] bg-clip-text text-transparent">Dashboard</span>
            </h1>
          </div>

          {/* Supabase Status Indicator */}
          <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"}`} />
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none font-bold">Supabase Connection</p>
              <p className="text-xs font-semibold text-white/80 mt-1">{dbStatus.message}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide gap-2 animate-fade-up" role="tablist">
          {[
            { id: "overview", name: "Overview", icon: "📊" },
            { id: "products", name: "Products Manager", icon: "⌚" },
            { id: "orders", name: "Orders Tracker", icon: "📦" },
            { id: "payments", name: "Payments Tracker", icon: "💳" },
            { id: "campaign", name: "Campaigns & Offers", icon: "🔥" },
            { id: "setup", name: "Database Setup", icon: "⚙️" }
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => { setActiveTab(tab.id); resetProductForm(); setShowProductForm(false); }}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm tracking-wider uppercase font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/5"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* -------------------- OVERVIEW TAB -------------------- */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-up">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="glass rounded-2xl p-6 border-white/5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Total Sales</p>
                  <h3 className="text-3xl font-black text-[#C9A84C]">${totalRevenue.toLocaleString()}</h3>
                  <p className="text-[10px] text-white/20 mt-1">From paid orders</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center text-2xl">💰</div>
              </div>

              <div className="glass rounded-2xl p-6 border-white/5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Pending Orders</p>
                  <h3 className="text-3xl font-black text-yellow-500">${pendingRevenue.toLocaleString()}</h3>
                  <p className="text-[10px] text-white/20 mt-1">Awaiting checkout payment</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-2xl">⏳</div>
              </div>

              <div className="glass rounded-2xl p-6 border-white/5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Total Orders</p>
                  <h3 className="text-3xl font-black text-white">{orders.length}</h3>
                  <p className="text-[10px] text-white/20 mt-1">Processed in database</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-2xl">📦</div>
              </div>

              <div className="glass rounded-2xl p-6 border-white/5 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-2">Total Products</p>
                  <h3 className="text-3xl font-black text-green-400">{products.length}</h3>
                  <p className="text-[10px] text-white/20 mt-1">Active watch models</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-2xl">⌚</div>
              </div>

            </div>

            {/* Quick Analytics Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Category Breakdown */}
              <div className="glass rounded-2xl p-6 border-white/5 lg:col-span-2">
                <h4 className="text-white font-bold text-lg mb-6">Inventory by Category</h4>
                <div className="space-y-4">
                  {Object.entries(categoryCounts).map(([cat, count]) => {
                    const pct = Math.round((count / products.length) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70 font-semibold">{cat}</span>
                          <span className="text-white/40">{count} watch{count !== 1 ? "es" : ""} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-[#C9A84C] to-[#F0D080] h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Status Breakdown */}
              <div className="glass rounded-2xl p-6 border-white/5">
                <h4 className="text-white font-bold text-lg mb-6">Order Statuses</h4>
                <div className="space-y-4 flex flex-col justify-center h-full pb-6">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map(status => {
                    const count = orders.filter(o => o.order_status === status).length;
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <span className="text-xs uppercase tracking-widest font-bold text-white/60">{status}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white">{count}</span>
                          <span className="text-[10px] text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full font-bold">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* -------------------- PRODUCTS TAB -------------------- */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fade-up">
            
            {/* Filter / Actions Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 gap-3">
                <input
                  type="text"
                  placeholder="Search by name or brand..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                />
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                onClick={() => { resetProductForm(); setShowProductForm(!showProductForm); }}
                className="btn-gold px-6 py-2.5 text-[#0A0A0F] text-xs font-black tracking-wider uppercase rounded-lg flex items-center justify-center gap-2"
              >
                {showProductForm ? "✕ Close Form" : "＋ Add New Watch"}
              </button>
            </div>

            {/* Product Add/Edit Form */}
            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="glass rounded-2xl p-6 sm:p-8 border-[#C9A84C]/30 shadow-lg animate-fade-up space-y-6">
                <h3 className="font-display text-2xl font-bold text-white pb-3 border-b border-white/10">
                  {isEditingProduct ? "Edit Luxury Watch Detail" : "Register New Luxury Watch"}
                </h3>

                {productFormError && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">{productFormError}</div>}
                {productFormSuccess && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">{productFormSuccess}</div>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Watch Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Submariner Date"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Brand *</label>
                    <input
                      type="text"
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="e.g. Rolex"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Retail Price ($) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="e.g. 9500"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Original Price (For Sale badge)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      placeholder="Leave blank if no discount"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    >
                      <option>Dress Watches</option>
                      <option>Dive Watches</option>
                      <option>Chronographs</option>
                      <option>Smart Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Visual Style (Theme filter)</label>
                    <select
                      value={productForm.style}
                      onChange={(e) => setProductForm({ ...productForm, style: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    >
                      <option value="dress">Dress</option>
                      <option value="sport">Sport</option>
                      <option value="chrono">Chrono</option>
                      <option value="smart">Smart</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Gender Category</label>
                    <select
                      value={productForm.gender}
                      onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    >
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                      <option value="unisex">Unisex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Movement Mechanism</label>
                    <select
                      value={productForm.movement}
                      onChange={(e) => setProductForm({ ...productForm, movement: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    >
                      <option value="mechanical">Mechanical Automatic</option>
                      <option value="quartz">Swiss Quartz</option>
                      <option value="manual">Manual Hand-wound</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Water Resistance (meters)</label>
                    <input
                      type="number"
                      value={productForm.water}
                      onChange={(e) => setProductForm({ ...productForm, water: e.target.value })}
                      placeholder="e.g. 100"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Image URL</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/... or leave blank for default emoji"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Highlight/Feature Description</label>
                    <input
                      type="text"
                      value={productForm.feature}
                      onChange={(e) => setProductForm({ ...productForm, feature: e.target.value })}
                      placeholder="e.g. Gold Bezel, 300m Diver, Tourbillon"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Full Description</label>
                    <textarea
                      rows="3"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Provide details about the craftsmanship, materials, strap and complications..."
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none resize-y"
                    />
                  </div>
                </div>

                {/* Specs sub-section */}
                <div className="p-5 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                  <h4 className="text-white font-bold text-sm tracking-wider uppercase text-[#C9A84C]/80">Technical Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Case Size</label>
                      <input
                        type="text"
                        value={productForm.specs.caseSize}
                        onChange={(e) => setProductForm({ ...productForm, specs: { ...productForm.specs, caseSize: e.target.value } })}
                        placeholder="e.g. 41mm"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:border-[#C9A84C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Case Material</label>
                      <input
                        type="text"
                        value={productForm.specs.caseMaterial}
                        onChange={(e) => setProductForm({ ...productForm, specs: { ...productForm.specs, caseMaterial: e.target.value } })}
                        placeholder="e.g. 18K Yellow Gold"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:border-[#C9A84C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Crystal</label>
                      <input
                        type="text"
                        value={productForm.specs.crystal}
                        onChange={(e) => setProductForm({ ...productForm, specs: { ...productForm.specs, crystal: e.target.value } })}
                        placeholder="e.g. Sapphire"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:border-[#C9A84C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5">Bracelet/Strap</label>
                      <input
                        type="text"
                        value={productForm.specs.bracelet}
                        onChange={(e) => setProductForm({ ...productForm, specs: { ...productForm.specs, bracelet: e.target.value } })}
                        placeholder="e.g. Oyster Steel"
                        className="w-full bg-white/5 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs focus:border-[#C9A84C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => { setShowProductForm(false); resetProductForm(); }}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 text-[#0A0A0F] text-xs font-black tracking-wider uppercase rounded-lg shadow-md"
                  >
                    {isEditingProduct ? "Update Watch" : "Publish Watch"}
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="glass rounded-2xl border-white/5 overflow-hidden shadow-lg-premium">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Watch</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Brand</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Category</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Price</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Specs</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                        
                        {/* Name / Image */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center flex-shrink-0">
                              <WatchImage src={p.image} alt={p.name} className="w-full h-full object-cover" fallbackSize="text-xl" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white leading-tight">{p.name}</p>
                              <p className="text-[10px] text-white/30 uppercase mt-0.5 tracking-wider">ID: {typeof p.id === "string" ? p.id.substring(0, 8) + "..." : p.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Brand */}
                        <td className="p-4 text-sm font-semibold text-white/70">{p.brand}</td>

                        {/* Category */}
                        <td className="p-4 text-sm text-white/60">{p.category}</td>

                        {/* Price */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-[#C9A84C]">${p.price.toLocaleString()}</span>
                            {p.originalPrice && (
                              <span className="text-xs text-white/30 line-through">${p.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </td>

                        {/* Specs Summary */}
                        <td className="p-4 text-xs text-white/40">
                          <p>{p.specs?.caseSize || "N/A"} • {p.specs?.caseMaterial || "N/A"}</p>
                          <p className="mt-0.5">{p.specs?.bracelet || "N/A"}</p>
                        </td>

                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="px-3 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/20 text-xs font-bold uppercase rounded-lg transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick("product", p.id)}
                              className="px-3 py-1.5 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 text-xs font-bold uppercase rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-white/30 text-sm">
                          No timepieces found matching the current search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Tracked Checkout Orders</h3>
              <span className="text-xs text-white/30">{orders.length} order{orders.length !== 1 ? "s" : ""} registered</span>
            </div>

            <div className="glass rounded-2xl border-white/5 overflow-hidden shadow-lg-premium">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Order / Client</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Shipping Address</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Order Cost</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Payment Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Shipping Status</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                        
                        {/* Order info & Customer */}
                        <td className="p-4">
                          <div>
                            <p className="font-bold text-sm text-white">Order #{typeof o.id === "string" ? o.id.substring(0, 8).toUpperCase() : o.id}</p>
                            <p className="text-xs text-[#C9A84C] mt-0.5 font-medium">{o.profiles?.full_name || "Guest Collector"}</p>
                            <p className="text-[10px] text-white/30 mt-1">{new Date(o.created_at).toLocaleString()}</p>
                          </div>
                        </td>

                        {/* Address */}
                        <td className="p-4 text-xs text-white/60">
                          {o.addresses ? (
                            <>
                              <p className="font-semibold text-white/80">{o.addresses.address_line1}</p>
                              <p className="mt-0.5">{o.addresses.city}, {o.addresses.postal_code}</p>
                              <p className="text-[10px] text-white/40">{o.addresses.country}</p>
                            </>
                          ) : (
                            <span className="text-white/35">No Address Provided</span>
                          )}
                        </td>

                        {/* Cost */}
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-black text-sm text-[#C9A84C]">${o.total?.toLocaleString() || "0"}</span>
                            <span className="text-[10px] text-white/30 mt-0.5">Subtotal: ${o.subtotal?.toLocaleString() || "0"}</span>
                          </div>
                        </td>

                        {/* Payment Status Dropdown */}
                        <td className="p-4">
                          <select
                            value={o.payment_status}
                            onChange={(e) => updateOrderStatus(o.id, "payment_status", e.target.value)}
                            className={`text-xs px-2.5 py-1.5 rounded-full font-bold uppercase tracking-wider bg-transparent border focus:outline-none cursor-pointer ${
                              o.payment_status === "paid"
                                ? "border-green-500/40 text-green-400 bg-green-500/5 hover:bg-green-500/10"
                                : "border-yellow-500/40 text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10"
                            }`}
                          >
                            <option value="pending" className="bg-[#111118] text-white">Pending</option>
                            <option value="paid" className="bg-[#111118] text-white">Paid</option>
                          </select>
                        </td>

                        {/* Shipping/Order Status Dropdown */}
                        <td className="p-4">
                          <select
                            value={o.order_status}
                            onChange={(e) => updateOrderStatus(o.id, "order_status", e.target.value)}
                            className="text-xs px-2.5 py-1.5 rounded-full font-bold uppercase tracking-wider bg-transparent border border-white/15 text-white/70 focus:outline-none cursor-pointer bg-[#0D0D14]"
                          >
                            <option value="pending" className="bg-[#111118] text-white">Pending</option>
                            <option value="processing" className="bg-[#111118] text-white">Processing</option>
                            <option value="shipped" className="bg-[#111118] text-white">Shipped</option>
                            <option value="delivered" className="bg-[#111118] text-white">Delivered</option>
                            <option value="cancelled" className="bg-[#111118] text-white">Cancelled</option>
                          </select>
                        </td>

                        {/* Delete Action */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteClick("order", o.id)}
                            className="text-red-400 hover:text-red-300 font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all"
                          >
                            Remove
                          </button>
                        </td>

                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-white/30 text-sm">
                          No checkout orders have been placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* -------------------- CAMPAIGNS & OFFERS TAB -------------------- */}
        {activeTab === "campaign" && (
          <div className="space-y-6 max-w-2xl mx-auto animate-fade-up">
            
            <div className="glass rounded-2xl p-6 sm:p-8 border-white/5 shadow-lg space-y-6">
              <div className="pb-3 border-b border-white/10 flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Homepage Promo Banner</h3>
                  <p className="text-xs text-white/40 mt-1">Directly control the flash sale campaign ending countdown.</p>
                </div>
              </div>

              {offerSuccess && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-lg">{offerSuccess}</div>}

              <form onSubmit={handleOfferSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Offer Event Title</label>
                  <input
                    type="text"
                    required
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Subtitle / Event Year</label>
                  <input
                    type="text"
                    required
                    value={offerForm.subtitle}
                    onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Discount (%)</label>
                    <input
                      type="number"
                      required
                      value={offerForm.discount}
                      onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Countdown Timer (Hours)</label>
                    <input
                      type="number"
                      required
                      value={offerForm.endTimeHours}
                      onChange={(e) => setOfferForm({ ...offerForm, endTimeHours: e.target.value })}
                      placeholder="e.g. 48"
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Watch Model / Illustration Label</label>
                  <input
                    type="text"
                    required
                    value={offerForm.watchName}
                    onChange={(e) => setOfferForm({ ...offerForm, watchName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/50 font-bold mb-2">Campaign Description</label>
                  <textarea
                    rows="3"
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-lg text-sm focus:border-[#C9A84C] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-3.5 text-[#0A0A0F] text-xs font-black tracking-[0.2em] uppercase rounded-lg shadow-md"
                >
                  Save & Push Campaign Live
                </button>
              </form>
            </div>

          </div>
        )}

        {/* -------------------- PAYMENTS TRACKER TAB -------------------- */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Razorpay Payment Transactions</h3>
              <span className="text-xs text-white/30">{payments.length} successful payment{payments.length !== 1 ? "s" : ""} logged</span>
            </div>

            <div className="glass rounded-2xl border-white/5 overflow-hidden shadow-lg-premium">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Payment ID</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Order Reference</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Client Info</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Amount Charged</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40">Currency</th>
                      <th className="p-4 text-xs font-bold uppercase tracking-wider text-white/40 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-all">
                        <td className="p-4 font-mono text-xs text-white/80">{p.razorpay_payment_id}</td>
                        <td className="p-4 font-mono text-xs text-white/55">
                          <p>Razorpay: {p.razorpay_order_id}</p>
                          <p className="text-[10px] text-white/35 mt-0.5">Local Order: #{typeof p.order_id === "string" ? p.order_id.substring(0, 8).toUpperCase() : p.order_id}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold text-white/80">{p.profiles?.full_name || "Demo Customer"}</p>
                          <p className="text-[10px] text-white/35 mt-0.5">{new Date(p.created_at).toLocaleString()}</p>
                        </td>
                        <td className="p-4 font-black text-sm text-[#C9A84C]">₹{p.amount.toLocaleString()}</td>
                        <td className="p-4 font-bold text-xs text-white/60">{p.currency}</td>
                        <td className="p-4 text-center">
                          <span className="text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/25">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-white/30 text-sm">
                          No Razorpay transactions have been recorded in the database yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- DATABASE SETUP TAB -------------------- */}
        {activeTab === "setup" && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-up">
            
            <div className="glass rounded-2xl p-6 sm:p-8 border-white/5 shadow-lg space-y-6">
              
              <div className="pb-4 border-b border-white/10 flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Supabase Row-Level Security (RLS) Setup</h3>
                  <p className="text-xs text-white/40 mt-1">Configure your Supabase database schema to authorize writing products and orders directly from this admin panel.</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  By default, Supabase enables **Row-Level Security (RLS)** on all new tables. When RLS is enabled, any client making writes (like creating a watch or placing an order) using the anonymous API key will be blocked, resulting in a database security policy violation.
                </p>
                
                <p className="font-bold text-white">
                  To allow this admin panel to save data directly to your database, you must run policies to authorize SELECT, INSERT, UPDATE, and DELETE operations.
                </p>

                <div className="p-4 bg-[#C9A84C]/5 border border-[#C9A84C]/15 rounded-xl">
                  <p className="text-xs font-bold text-[#C9A84C] uppercase tracking-wider mb-2">Instructions:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs">
                    <li>Log into your <strong>Supabase Dashboard</strong>.</li>
                    <li>Go to the <strong>SQL Editor</strong> in the left sidebar navigation.</li>
                    <li>Click <strong>New Query</strong>.</li>
                    <li>Copy and paste the SQL script below into the editor.</li>
                    <li>Click <strong>Run</strong> at the bottom right.</li>
                  </ol>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#C9A84C] font-semibold mb-2">SQL Script (Copy-Paste):</label>
                  <pre className="p-5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono overflow-x-auto text-green-300 select-all max-h-96">
{`-- 1. Create offers table if not exists
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  discount NUMERIC DEFAULT 0,
  end_time BIGINT,
  description TEXT,
  watch_name TEXT,
  is_active BOOLEAN DEFAULT true
);

-- 2. Policies for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read products" ON products;
DROP POLICY IF EXISTS "Allow public write products" ON products;
CREATE POLICY "Allow public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public write products" ON products FOR ALL USING (true);

-- 3. Policies for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow public write orders" ON orders;
CREATE POLICY "Allow public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public write orders" ON orders FOR ALL USING (true);

-- 4. Policies for order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read order_items" ON order_items;
DROP POLICY IF EXISTS "Allow public write order_items" ON order_items;
CREATE POLICY "Allow public read order_items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Allow public write order_items" ON order_items FOR ALL USING (true);

-- 5. Policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public write profiles" ON profiles;
CREATE POLICY "Allow public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public write profiles" ON profiles FOR ALL USING (true);

-- 6. Policies for addresses table
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read addresses" ON addresses;
DROP POLICY IF EXISTS "Allow public write addresses" ON addresses;
CREATE POLICY "Allow public read addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Allow public write addresses" ON addresses FOR ALL USING (true);

-- 7. Policies for offers table
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read offers" ON offers;
DROP POLICY IF EXISTS "Allow public write offers" ON offers;
CREATE POLICY "Allow public read offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Allow public write offers" ON offers FOR ALL USING (true);

-- 8. Create reviews table (for product reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  reviewer_name TEXT NOT NULL DEFAULT 'Anonymous',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public write reviews" ON reviews;
CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public write reviews" ON reviews FOR INSERT WITH CHECK (true);

-- 9. Create wishlists table (for persistent wishlists across sessions)
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, product_id)
);
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read wishlists" ON wishlists;
DROP POLICY IF EXISTS "Allow public write wishlists" ON wishlists;
DROP POLICY IF EXISTS "Allow public delete wishlists" ON wishlists;
CREATE POLICY "Allow public read wishlists" ON wishlists FOR SELECT USING (true);
CREATE POLICY "Allow public write wishlists" ON wishlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete wishlists" ON wishlists FOR DELETE USING (true);

-- 10. Create carts table (for persistent shopping carts across sessions)
CREATE TABLE IF NOT EXISTS carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(session_id, product_id)
);
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read carts" ON carts;
DROP POLICY IF EXISTS "Allow public write carts" ON carts;
DROP POLICY IF EXISTS "Allow public delete carts" ON carts;
DROP POLICY IF EXISTS "Allow public update carts" ON carts;
CREATE POLICY "Allow public read carts" ON carts FOR SELECT USING (true);
CREATE POLICY "Allow public write carts" ON carts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update carts" ON carts FOR ALL USING (true);

-- 11. Create payments table (for Razorpay payment tracking)
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT NOT NULL,
  razorpay_signature TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'captured',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read payments" ON payments;
DROP POLICY IF EXISTS "Allow public write payments" ON payments;
CREATE POLICY "Allow public read payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Allow public write payments" ON payments FOR INSERT WITH CHECK (true);

-- 12. Enable Realtime database replication for instant UI updates across clients
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR TABLE products, orders, offers, reviews, wishlists, carts, payments;`}
                  </pre>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirm.id && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass max-w-md w-full p-6 sm:p-7 rounded-2xl border-red-500/20 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-3xl mx-auto">⚠️</div>
            <div>
              <h4 className="font-display text-xl font-bold text-white mb-2">Confirm Delete</h4>
              <p className="text-sm text-white/50">
                Are you sure you want to delete this {deleteConfirm.type === "product" ? "timepiece" : "order"}? This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm({ type: null, id: null })}
                className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-red-500 text-white hover:bg-red-600 text-xs font-black tracking-wider uppercase rounded-lg"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

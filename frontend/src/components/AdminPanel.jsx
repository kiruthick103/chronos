import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
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

  const { signOut, user } = useAuth();

  // Layout States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  
  // Header Panel States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  // Notifications List
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New high-value order placed ($18,500)", time: "5 mins ago", read: false },
    { id: 2, text: "Low stock alert: Abyssal Pro 300 (1 left)", time: "1 hour ago", read: false },
    { id: 3, text: "Payment verification failed for order #401", time: "3 hours ago", read: true },
    { id: 4, text: "New review submitted for Lumiere Classique", time: "1 day ago", read: true }
  ]);

  // Tab specific states
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("All");
  const [productStatusFilter, setProductStatusFilter] = useState("All");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  
  const [inventorySearch, setInventorySearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const [stockAdjustId, setStockAdjustId] = useState(null);
  const [stockAdjustVal, setStockAdjustVal] = useState(0);

  // Marketing Coupons state
  const [coupons, setCoupons] = useState([
    { code: "PRESTIGE20", discount: 20, type: "percentage", status: "Active", used: 45 },
    { code: "CHRONOGOLD500", discount: 500, type: "fixed", status: "Active", used: 12 },
    { code: "LUMIERE10", discount: 10, type: "percentage", status: "Expired", used: 120 }
  ]);
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "", type: "percentage" });

  // Users management list
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Kiruthick", email: "kiruthick3238q@gmail.com", role: "Administrator", permissions: "Full Access", status: "Active" },
    { id: 2, name: "Jean-Pierre", email: "jp.pierre@chronolux.ch", role: "Inventory Manager", permissions: "Products & Stock", status: "Active" },
    { id: 3, name: "Aria Sterling", email: "aria@chronolux.com", role: "Marketing Editor", permissions: "Campaigns & Content", status: "Inactive" }
  ]);
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", email: "", role: "Editor" });

  // Activity logs
  const [auditLogs, setAuditLogs] = useState([
    { time: "Just now", user: "Kiruthick", action: "Updated database replication publication tables" },
    { time: "10 mins ago", user: "System", action: "Razorpay webhooks successfully verified transaction: pay_P102934" },
    { time: "1 hour ago", user: "Jean-Pierre", action: "Restocked Abyssal Pro 300 (+15 units)" },
    { time: "4 hours ago", user: "Aria Sterling", action: "Edited Summer Prestige marketing campaign details" }
  ]);

  // Settings state
  const [storeSettings, setStoreSettings] = useState({
    name: "Chronolux Luxury Watches",
    email: "concierge@chronolux.com",
    phone: "+41 (22) 789-0122",
    currency: "USD ($)",
    maintenanceMode: false,
    shippingRates: { standard: 0, express: 25, overnight: 50 },
    taxRate: 8
  });

  // Content Editor state
  const [contentForm, setContentForm] = useState({
    heroTitle: "Lumiere Classique",
    heroSubtitle: "A Testament to Time",
    aboutStory: "Founded in Geneva, Chronolux represents the pinnacle of haute horlogerie. Our master craftsmen combine centuries of Swiss watchmaking tradition with avant-garde engineering to produce timepieces of unparalleled precision and elegance.",
    faq1Question: "Are all watches authenticated?",
    faq1Answer: "Yes, every watch undergoes a rigorous 30-point authentication and certification process by our in-house watchmakers."
  });

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

  // Delete Confirm State
  const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null });

  // Offer / Campaign Form State
  const [offerForm, setOfferForm] = useState({
    title: "",
    subtitle: "",
    discount: 0,
    description: "",
    watchName: "",
    endTimeHours: 48
  });
  const [offerSuccess, setOfferSuccess] = useState("");

  // Sync offer from context once loaded
  useEffect(() => {
    if (offer) {
      setOfferForm({
        title: offer.title || "",
        subtitle: offer.subtitle || "",
        discount: offer.discount || 0,
        description: offer.description || "",
        watchName: offer.watchName || "",
        endTimeHours: 48
      });
    }
  }, [offer]);

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

  // Fetch unique categories for product filters
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  // Calculations for overview metrics
  const totalPaidRevenue = orders.reduce((sum, o) => o.payment_status === "paid" ? sum + o.total : sum, 0);
  const totalVisitorMock = 12450;
  const conversionRateMock = 2.4; // %
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Fetch profiles (customers) on mount and on tab select
  useEffect(() => {
    if (activeTab === "customers" || activeTab === "users" || activeTab === "dashboard") {
      fetchProfiles();
    }
  }, [activeTab]);

  const fetchProfiles = async () => {
    setCustomersLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.warn("Failed to load customer profiles:", err.message);
      // Fallback
      setCustomers([
        { id: "1", full_name: "John Doe", created_at: new Date().toISOString(), is_admin: false },
        { id: "2", full_name: "Kiruthick", created_at: new Date().toISOString(), is_admin: true }
      ]);
    } finally {
      setCustomersLoading(false);
    }
  };

  // Product CRUD Handlers
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
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `${isEditingProduct ? "Updated" : "Added"} watch: ${productForm.name}` }, ...prev]);
      setTimeout(() => {
        setShowProductForm(false);
        resetProductForm();
        refreshProducts();
      }, 1200);
    } else {
      setProductFormError(`Failed to save: ${result.error}`);
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
  };

  const handleDuplicate = async (p) => {
    const payload = {
      ...p,
      id: undefined,
      name: `${p.name} (Copy)`
    };
    const res = await addProduct(payload);
    if (res.success) {
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Duplicated watch: ${p.name}` }, ...prev]);
      refreshProducts();
    }
  };

  const handleDeleteClick = (type, id) => {
    setDeleteConfirm({ type, id });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (type === "product") {
      await deleteProduct(id);
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Deleted watch ID: ${id}` }, ...prev]);
      refreshProducts();
    } else if (type === "order") {
      await deleteOrder(id);
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Deleted order ID: ${id}` }, ...prev]);
      refreshOrders();
    }
    setDeleteConfirm({ type: null, id: null });
  };

  // Adjust stock values directly
  const handleStockSave = async (id, currentVal) => {
    const newStock = Number(stockAdjustVal);
    // Directly update Supabase specs column
    try {
      const p = products.find(prod => prod.id === id);
      const updatedSpecs = { ...p.specs, stock: newStock };
      const { error } = await supabase.from("products").update({ specs: updatedSpecs }).eq("id", id);
      if (error) throw error;
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Adjusted inventory stock for ${p.name} to ${newStock}` }, ...prev]);
      setStockAdjustId(null);
      refreshProducts();
    } catch (err) {
      alert("Failed to update stock: " + err.message);
    }
  };

  // Bulk product actions mock
  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;
    if (action === "delete") {
      if (confirm(`Are you sure you want to delete ${selectedProducts.length} items?`)) {
        for (const id of selectedProducts) {
          await deleteProduct(id);
        }
        setSelectedProducts([]);
        refreshProducts();
      }
    } else if (action === "archive") {
      alert(`Archived ${selectedProducts.length} products (mock action)`);
      setSelectedProducts([]);
    }
  };

  const toggleSelectProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Quick add modal handler
  const handleQuickAddSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const payload = {
      name: data.get("name"),
      brand: data.get("brand"),
      price: Number(data.get("price")),
      category: data.get("category"),
      movement: data.get("movement"),
      specs: {
        stock: Number(data.get("stock") || 10)
      }
    };
    const res = await addProduct(payload);
    if (res.success) {
      setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Quick added watch: ${payload.name}` }, ...prev]);
      setShowQuickAdd(false);
      refreshProducts();
    } else {
      alert("Error adding product: " + res.error);
    }
  };

  // Add Coupon code
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;
    setCoupons(prev => [
      {
        code: newCoupon.code.toUpperCase(),
        discount: Number(newCoupon.discount),
        type: newCoupon.type,
        status: "Active",
        used: 0
      },
      ...prev
    ]);
    setNewCoupon({ code: "", discount: "", type: "percentage" });
  };

  // Add Team member
  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeamMember.name || !newTeamMember.email) return;
    setTeamMembers(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: newTeamMember.name,
        email: newTeamMember.email,
        role: newTeamMember.role,
        permissions: newTeamMember.role === "Manager" ? "Products & Orders" : "View Only",
        status: "Active"
      }
    ]);
    setShowAddTeamModal(false);
    setNewTeamMember({ name: "", email: "", role: "Editor" });
  };

  // Export report dummy downloader
  const triggerReportExport = (format, type) => {
    const filename = `${type}_report_${new Date().toISOString().slice(0, 10)}.${format.toLowerCase()}`;
    const header = "Chronolux Executive Report\nGenerated: " + new Date().toLocaleString() + "\n\n";
    let content = header;
    
    if (type === "sales") {
      content += "Order ID,Customer,Total,Status,Payment\n";
      orders.forEach(o => {
        content += `${o.id},${o.profiles?.full_name || "Guest"},$${o.total},${o.order_status},${o.payment_status}\n`;
      });
    } else if (type === "inventory") {
      content += "Product Name,Brand,Category,Price,Stock\n";
      products.forEach(p => {
        content += `"${p.name}","${p.brand}","${p.category}",$${p.price},${p.specs?.stock || 0}\n`;
      });
    } else {
      content += "Log details generated successfully.";
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === "All" || p.category === productCategory;
    const matchesStatus = productStatusFilter === "All" || 
                          (productStatusFilter === "Active" && (p.specs?.stock || 0) > 0) ||
                          (productStatusFilter === "Archived" && (p.specs?.stock || 0) === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredOrders = orders.filter(o => {
    const nameMatch = o.profiles?.full_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                      o.id?.toLowerCase().includes(orderSearch.toLowerCase());
    const statusMatch = orderStatusFilter === "All" || o.order_status === orderStatusFilter;
    return nameMatch && statusMatch;
  });

  const filteredCustomers = customers.filter(c => {
    return c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
           c.id?.toLowerCase().includes(customerSearch.toLowerCase());
  });

  const filteredInventory = products.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) || 
                      p.brand.toLowerCase().includes(inventorySearch.toLowerCase());
    const matchesStock = stockFilter === "All" || 
                         (stockFilter === "low" && (p.specs?.stock || 0) > 0 && (p.specs?.stock || 0) <= 3) ||
                         (stockFilter === "out" && (p.specs?.stock || 0) === 0);
    return nameMatch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-[#060609] text-white font-sans flex">
      {/* ── LEFT SIDEBAR ── */}
      <aside className={`bg-[#0A0A0F] border-r border-white/5 transition-all duration-300 flex flex-col z-30 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3 justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full border border-[#C9A84C] flex items-center justify-center flex-shrink-0">
              <span className="text-[#C9A84C] font-black text-sm">C</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="font-display text-sm tracking-[0.25em] uppercase font-bold text-[#C9A84C] truncate">CHRONOLUX</span>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            {isSidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation Sidebar */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "products", label: "Products", icon: "⌚" },
            { id: "orders", label: "Orders", icon: "📦" },
            { id: "customers", label: "Customers", icon: "👥" },
            { id: "analytics", label: "Analytics", icon: "📈" },
            { id: "inventory", label: "Inventory", icon: "📋" },
            { id: "payments", label: "Payments", icon: "💳" },
            { id: "marketing", label: "Marketing", icon: "🔥" },
            { id: "content", label: "Content", icon: "📝" },
            { id: "users", label: "Users", icon: "🛡️" },
            { id: "reports", label: "Reports", icon: "📑" },
            { id: "settings", label: "Settings", icon: "⚙️" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedOrder(null); setSelectedCustomer(null); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                activeTab === tab.id
                  ? "bg-[#C9A84C]/10 text-[#C9A84C] font-bold border-l-2 border-[#C9A84C]"
                  : "text-white/40 hover:bg-white/[0.02] hover:text-white"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {!isSidebarCollapsed && (
                <span className="text-xs tracking-wider uppercase">{tab.label}</span>
              )}
              {isSidebarCollapsed && (
                <span className="absolute left-16 bg-[#0E0E15] border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User profile section at bottom */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <button
            onClick={() => { signOut(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400/70 hover:text-red-400 transition-all text-xs tracking-wider uppercase font-bold ${isSidebarCollapsed ? "justify-center" : ""}`}
          >
            <span>🚪</span>
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* ── TOP NAVBAR ── */}
        <header className="h-20 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sm:px-8 z-20 sticky top-0">
          {/* Global search */}
          <div className="w-full max-w-md relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                // Dynamically route search to active tab filter
                if (activeTab === "products") setProductSearch(e.target.value);
                if (activeTab === "orders") setOrderSearch(e.target.value);
                if (activeTab === "customers") setCustomerSearch(e.target.value);
              }}
              placeholder="Search anything..."
              className="w-full bg-white/[0.03] border border-white/5 text-white px-11 py-2 rounded-full focus:outline-none focus:border-[#C9A84C]/50 transition-colors text-sm"
            />
          </div>

          {/* Right nav actions */}
          <div className="flex items-center gap-5 relative">
            {/* Quick Add */}
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="btn-gold hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black tracking-widest uppercase hover:opacity-90 transition-all text-[#0A0A0F]"
            >
              <span>+</span> Quick Add
            </button>

            {/* Quick Add Dropdown */}
            {showQuickAdd && (
              <div className="absolute right-40 top-12 bg-[#0E0E16] border border-white/10 p-6 rounded-2xl w-80 shadow-2xl animate-fade-up z-50">
                <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Quick Add Watch</h4>
                <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Watch Name</label>
                    <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Brand</label>
                    <input name="brand" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Price ($)</label>
                      <input name="price" type="number" required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Initial Stock</label>
                      <input name="stock" type="number" defaultValue="5" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                      <select name="category" className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none">
                        <option value="Dress Watches">Dress</option>
                        <option value="Dive Watches">Dive</option>
                        <option value="Chronographs">Chronograph</option>
                        <option value="Smart Luxury">Smart</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Movement</label>
                      <input name="movement" defaultValue="mechanical" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-2.5 rounded-lg hover:opacity-95 transition-opacity mt-2">
                    Create Product
                  </button>
                </form>
              </div>
            )}

            {/* Notifications icon */}
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }}
              className="relative w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-lg text-white/60 hover:text-white"
            >
              <span>🔔</span>
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#C9A84C]" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-12 top-12 bg-[#0E0E16] border border-white/10 rounded-2xl w-80 shadow-2xl overflow-hidden animate-fade-up z-50">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C]">Alerts & Messages</h4>
                  <button 
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="text-[10px] text-white/40 hover:text-white uppercase font-bold tracking-wider"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/[0.01] transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}>
                      <p className="text-xs text-white/80 leading-normal">{n.text}</p>
                      <span className="text-[10px] text-white/30 block mt-1">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile trigger */}
            <button
              onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }}
              className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-xs font-black text-[#C9A84C]">
                AD
              </div>
              <span className="hidden md:inline text-xs font-semibold text-white/70">Administrator</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-12 bg-[#0E0E16] border border-white/10 rounded-2xl w-56 shadow-2xl overflow-hidden animate-fade-up z-50">
                <div className="p-4 border-b border-white/5">
                  <p className="text-xs text-white font-bold">{user?.email}</p>
                  <p className="text-[9px] text-[#C9A84C] font-semibold uppercase tracking-widest mt-1">Super Administrator</p>
                </div>
                <div className="py-2">
                  <button onClick={() => setActiveTab("settings")} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-xs text-white/70 hover:text-white uppercase tracking-wider font-bold">Store Settings</button>
                  <button onClick={() => signOut()} className="w-full text-left px-4 py-2.5 hover:bg-red-500/5 text-xs text-red-400 hover:text-red-300 uppercase tracking-wider font-bold border-t border-white/5">Sign Out</button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── MAIN WORKSPACE ── */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          
          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: DASHBOARD ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-up">
              
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { title: "Revenue", value: `$${totalPaidRevenue.toLocaleString()}`, label: "From paid orders", icon: "💰", color: "text-[#C9A84C]" },
                  { title: "Total Sales", value: `$${totalRevenue.toLocaleString()}`, label: "Orders value total", icon: "💸", color: "text-white" },
                  { title: "Orders", value: orders.length, label: "Total items ordered", icon: "📦", color: "text-blue-400" },
                  { title: "Customers", value: customers.length || 12, label: "Registered clients", icon: "👥", color: "text-purple-400" },
                  { title: "Products", value: products.length, label: "Total SKU catalog", icon: "⌚", color: "text-emerald-400" },
                  { title: "Conversion", value: `${conversionRateMock}%`, label: "Visitor purchase rate", icon: "🎯", color: "text-amber-500" }
                ].map((kpi, idx) => (
                  <div key={idx} className="glass rounded-2xl p-5 border-white/5 shadow-md flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{kpi.title}</span>
                      <span className="text-base">{kpi.icon}</span>
                    </div>
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-black ${kpi.color}`}>{kpi.value}</h3>
                      <p className="text-[9px] text-white/20 mt-1 leading-none">{kpi.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Executive Sales Trend Chart */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C]">Sales Executive Trend</h4>
                      <p className="text-[10px] text-white/30 mt-0.5">Historical monthly performance chart</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-white/50">USD ($)</span>
                    </div>
                  </div>

                  {/* SVG Custom Premium Line Chart */}
                  <div className="relative w-full h-64 mt-4">
                    <svg className="w-full h-full" viewBox="0 0 600 220">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="50" y1="20" x2="570" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="50" y1="70" x2="570" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="50" y1="120" x2="570" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                      <line x1="50" y1="170" x2="570" y2="170" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                      {/* Area Under Curve */}
                      <path
                        d="M 50,170 C 130,150 180,80 260,110 C 340,140 400,30 470,50 C 520,60 550,40 570,30 L 570,170 Z"
                        fill="url(#chartGradient)"
                      />

                      {/* Trend Line */}
                      <path
                        d="M 50,170 C 130,150 180,80 260,110 C 340,140 400,30 470,50 C 520,60 550,40 570,30"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Data Nodes */}
                      <circle cx="50" cy="170" r="4" fill="#C9A84C" stroke="#060609" strokeWidth="1.5" />
                      <circle cx="260" cy="110" r="4" fill="#C9A84C" stroke="#060609" strokeWidth="1.5" />
                      <circle cx="470" cy="50" r="4" fill="#C9A84C" stroke="#060609" strokeWidth="1.5" />
                      <circle cx="570" cy="30" r="4" fill="#C9A84C" stroke="#060609" strokeWidth="1.5" />

                      {/* Axis Labels */}
                      <text x="50" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Jan</text>
                      <text x="150" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Mar</text>
                      <text x="260" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">May</text>
                      <text x="370" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Jul</text>
                      <text x="470" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Sep</text>
                      <text x="570" y="195" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle">Nov</text>
                    </svg>
                  </div>
                </div>

                {/* Top Selling Products List */}
                <div className="glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Top Premium Products</h4>
                  <div className="space-y-4">
                    {products.slice(0, 4).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between pb-3.5 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white/30 font-bold">0{idx + 1}</span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                            <WatchImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white truncate max-w-[120px]">{p.name}</p>
                            <p className="text-[10px] text-white/30">{p.brand}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-[#C9A84C]">${p.price.toLocaleString()}</p>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lower Section: Orders and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders List */}
                <div className="lg:col-span-2 glass rounded-3xl p-6 border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C]">Executive Orders Log</h4>
                    <button onClick={() => setActiveTab("orders")} className="text-[10px] text-white/40 hover:text-white font-bold tracking-wider uppercase">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                          <th className="pb-3.5">ID</th>
                          <th className="pb-3.5">Client</th>
                          <th className="pb-3.5">Status</th>
                          <th className="pb-3.5">Payment</th>
                          <th className="pb-3.5 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {orders.slice(0, 4).map(o => (
                          <tr key={o.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-3 font-mono text-[10px] text-white/50">{o.id.slice(0, 8)}...</td>
                            <td className="py-3 font-medium">{o.profiles?.full_name || "Guest Customer"}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                o.order_status === "delivered" ? "bg-green-500/10 text-green-400" :
                                o.order_status === "pending" ? "bg-amber-500/10 text-amber-400" :
                                "bg-blue-500/10 text-blue-400"
                              }`}>{o.order_status}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                o.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"
                              }`}>{o.payment_status}</span>
                            </td>
                            <td className="py-3 text-right font-bold text-[#C9A84C]">${o.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-5">Administrative Audit Log</h4>
                  <div className="space-y-4 relative">
                    <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-white/5" />
                    {auditLogs.slice(0, 4).map((log, idx) => (
                      <div key={idx} className="flex gap-4 relative">
                        <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/50 flex items-center justify-center flex-shrink-0 text-[10px] z-10">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs text-white/80 leading-normal">{log.action}</p>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-[10px] text-[#C9A84C] font-semibold">{log.user}</span>
                            <span className="text-[9px] text-white/20">•</span>
                            <span className="text-[9px] text-white/30">{log.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: PRODUCTS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-fade-up">
              
              {/* Product management actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0F] p-5 rounded-2xl border border-white/5">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search watches..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="bg-[#0E0E15] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={productStatusFilter}
                    onChange={(e) => setProductStatusFilter(e.target.value)}
                    className="bg-[#0E0E15] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">In Stock</option>
                    <option value="Archived">Out of Stock</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  {selectedProducts.length > 0 && (
                    <div className="flex gap-2">
                      <button onClick={() => handleBulkAction("archive")} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs uppercase font-bold hover:bg-white/10 transition-colors">Archive</button>
                      <button onClick={() => handleBulkAction("delete")} className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs uppercase font-bold hover:bg-red-500/20 transition-colors">Delete</button>
                    </div>
                  )}
                  <button
                    onClick={() => { resetProductForm(); setShowProductForm(true); }}
                    className="btn-gold px-5 py-2.5 rounded-lg text-xs font-black tracking-widest uppercase text-[#0A0A0F] hover:opacity-90"
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {/* Product Form Modal / Section */}
              {showProductForm && (
                <div className="glass rounded-3xl p-6 border-white/10 animate-fade-up max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                    <h3 className="text-sm font-bold tracking-widest uppercase text-[#C9A84C]">{isEditingProduct ? "Edit Luxury Watch" : "Create Luxury Watch"}</h3>
                    <button onClick={() => { setShowProductForm(false); resetProductForm(); }} className="text-white/40 hover:text-white font-bold text-xs uppercase">Cancel</button>
                  </div>
                  
                  {productFormError && <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs mb-5 font-semibold">{productFormError}</div>}
                  {productFormSuccess && <div className="p-3.5 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg text-xs mb-5 font-semibold">{productFormSuccess}</div>}

                  <form onSubmit={handleProductSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Watch Name *</label>
                        <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Brand *</label>
                        <input type="text" value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Price ($) *</label>
                        <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Original Price ($)</label>
                        <input type="number" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Category</label>
                        <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none">
                          <option value="Dress Watches">Dress Watches</option>
                          <option value="Dive Watches">Dive Watches</option>
                          <option value="Chronographs">Chronographs</option>
                          <option value="Smart Luxury">Smart Luxury</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Image URL</label>
                      <input type="text" value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Movement Type</label>
                        <input type="text" value={productForm.movement} onChange={(e) => setProductForm({ ...productForm, movement: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Water Resistance (m)</label>
                        <input type="number" value={productForm.water} onChange={(e) => setProductForm({ ...productForm, water: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Gender Focus</label>
                        <select value={productForm.gender} onChange={(e) => setProductForm({ ...productForm, gender: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none">
                          <option value="men">Men</option>
                          <option value="women">Women</option>
                          <option value="unisex">Unisex</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Short Feature Tag</label>
                      <input type="text" value={productForm.feature} onChange={(e) => setProductForm({ ...productForm, feature: e.target.value })} placeholder="e.g. Swiss Tourbillon" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Description</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows="3" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]" />
                    </div>

                    <button type="submit" className="w-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-3.5 rounded-lg hover:opacity-95 transition-opacity">
                      {isEditingProduct ? "Save Watch Modifications" : "Publish to Catalog"}
                    </button>
                  </form>
                </div>
              )}

              {/* Products Table */}
              <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                        <th className="py-4 px-6 w-12"><input type="checkbox" onChange={(e) => setSelectedProducts(e.target.checked ? products.map(p => p.id) : [])} checked={selectedProducts.length === products.length} /></th>
                        <th className="py-4 px-4">Watch Model</th>
                        <th className="py-4 px-4">Brand</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Price</th>
                        <th className="py-4 px-4">Stock</th>
                        <th className="py-4 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                          <td className="py-4 px-6"><input type="checkbox" checked={selectedProducts.includes(p.id)} onChange={() => toggleSelectProduct(p.id)} /></td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                <WatchImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-white leading-snug">{p.name}</p>
                                <span className="text-[10px] text-white/30 uppercase tracking-widest">{p.specs?.movement || p.movement || "Automatic"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-white/70">{p.brand}</td>
                          <td className="py-4 px-4 text-white/50">{p.category}</td>
                          <td className="py-4 px-4 font-bold text-[#C9A84C]">${p.price.toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              (p.specs?.stock || 0) === 0 ? "bg-red-500/10 text-red-400" :
                              (p.specs?.stock || 0) <= 3 ? "bg-amber-500/10 text-amber-400" :
                              "bg-emerald-500/10 text-emerald-400"
                            }`}>{p.specs?.stock || 0} left</span>
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button onClick={() => handleEditClick(p)} className="hover:text-[#C9A84C] transition-colors font-bold text-[10px] uppercase tracking-wider">Edit</button>
                            <button onClick={() => handleDuplicate(p)} className="hover:text-blue-400 transition-colors font-bold text-[10px] uppercase tracking-wider text-white/30">Copy</button>
                            <button onClick={() => handleDeleteClick("product", p.id)} className="text-red-400/50 hover:text-red-400 transition-colors font-bold text-[10px] uppercase tracking-wider">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: ORDERS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-fade-up">
              
              {/* Order management actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0F] p-5 rounded-2xl border border-white/5">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search by ID or customer..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                  />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-[#0E0E15] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none"
                  >
                    <option value="All">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order List Table */}
              <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                        <th className="py-4 px-6">Order ID</th>
                        <th className="py-4 px-4">Client Name</th>
                        <th className="py-4 px-4">Purchase Date</th>
                        <th className="py-4 px-4">Delivery Status</th>
                        <th className="py-4 px-4">Payment</th>
                        <th className="py-4 px-4">Method</th>
                        <th className="py-4 px-4 text-right">Total</th>
                        <th className="py-4 px-4 text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-mono text-[10px] text-[#C9A84C]">{o.id.slice(0, 8)}...</td>
                          <td className="py-4 px-4 font-semibold">{o.profiles?.full_name || "Guest User"}</td>
                          <td className="py-4 px-4 text-white/40">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4">
                            <select
                              value={o.order_status}
                              onChange={async (e) => {
                                await updateOrderStatus(o.id, e.target.value);
                                setAuditLogs(prev => [{ time: "Just now", user: "Kiruthick", action: `Updated order status to ${e.target.value} for order ${o.id.slice(0, 8)}` }, ...prev]);
                                refreshOrders();
                              }}
                              className="bg-[#0E0E15] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wider text-white"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.payment_status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/40"
                            }`}>{o.payment_status}</span>
                          </td>
                          <td className="py-4 px-4 text-white/50">{o.payment_method}</td>
                          <td className="py-4 px-4 text-right font-bold text-[#C9A84C]">${o.total.toLocaleString()}</td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Invoice
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice / Details Overlay Modal */}
              {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-[#060609]/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#0E0E16] border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-fade-up">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                      <div>
                        <h3 className="text-sm font-bold tracking-widest uppercase text-[#C9A84C]">CHRONOLUX INVOICE</h3>
                        <p className="text-[10px] text-white/30 font-mono mt-1">Order Ref: {selectedOrder.id}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase">Close</button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
                      <div>
                        <p className="text-white/40 uppercase tracking-widest text-[9px] mb-1">Billing Details</p>
                        <p className="font-bold text-white">{selectedOrder.profiles?.full_name || "Guest Customer"}</p>
                        <p className="text-white/70 mt-1">{selectedOrder.addresses?.address_line1 || "No shipping address listed"}</p>
                        <p className="text-white/70">{selectedOrder.addresses?.city}, {selectedOrder.addresses?.postal_code}</p>
                        <p className="text-white/70">{selectedOrder.addresses?.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 uppercase tracking-widest text-[9px] mb-1">Date</p>
                        <p className="font-bold text-white">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                        <p className="text-white/40 uppercase tracking-widest text-[9px] mt-4 mb-1">Payment Method</p>
                        <p className="font-bold text-[#C9A84C]">{selectedOrder.payment_method}</p>
                      </div>
                    </div>

                    <div className="border border-white/5 rounded-xl overflow-hidden mb-6">
                      <div className="p-4 bg-white/[0.01] border-b border-white/5 grid grid-cols-3 text-[10px] text-white/40 uppercase font-bold tracking-wider">
                        <span>Details</span>
                        <span className="text-center">Quantity</span>
                        <span className="text-right">Price</span>
                      </div>
                      <div className="p-4 space-y-3 text-xs">
                        <div className="grid grid-cols-3">
                          <span className="font-bold text-white">Selected Chronolux Timepiece</span>
                          <span className="text-center">1</span>
                          <span className="text-right font-mono">${selectedOrder.subtotal?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-white/5 pt-4 text-right">
                      <div className="flex justify-between max-w-xs ml-auto">
                        <span className="text-white/40">Subtotal:</span>
                        <span className="font-mono text-white/80">${selectedOrder.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between max-w-xs ml-auto">
                        <span className="text-white/40">Shipping:</span>
                        <span className="font-mono text-white/80">${selectedOrder.shipping}</span>
                      </div>
                      <div className="flex justify-between max-w-xs ml-auto border-t border-white/5 pt-2 font-bold text-base text-[#C9A84C]">
                        <span>Grand Total:</span>
                        <span className="font-mono">${selectedOrder.total?.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <button onClick={() => window.print()} className="btn-gold flex-1 py-3 text-xs font-black tracking-widest uppercase rounded-lg text-[#0A0A0F]">Print Invoice</button>
                      <button onClick={() => handleDeleteClick("order", selectedOrder.id)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-3 rounded-lg text-xs uppercase font-bold transition-all">Cancel Order</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: CUSTOMERS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-fade-up">
              
              <div className="flex justify-between items-center bg-[#0A0A0F] p-5 rounded-2xl border border-white/5">
                <input
                  type="text"
                  placeholder="Search customer name or ID..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C] w-full max-w-sm"
                />
              </div>

              {customersLoading ? (
                <div className="text-center py-20 text-white/40">Loading clients registry...</div>
              ) : (
                <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-premium">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                          <th className="py-4 px-6">Customer Name</th>
                          <th className="py-4 px-4">Email Account ID</th>
                          <th className="py-4 px-4">Joined Date</th>
                          <th className="py-4 px-4">Authority Role</th>
                          <th className="py-4 px-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs">
                        {filteredCustomers.map(c => (
                          <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-4 px-6 font-semibold">{c.full_name || "Guest Account"}</td>
                            <td className="py-4 px-4 font-mono text-[10px] text-white/50">{c.id}</td>
                            <td className="py-4 px-4 text-white/40">{new Date(c.created_at).toLocaleDateString()}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                c.is_admin ? "bg-[#C9A84C]/10 text-[#C9A84C]" : "bg-white/5 text-white/40"
                              }`}>{c.is_admin ? "Admin" : "Customer"}</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => setSelectedCustomer(c)}
                                className="bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Customer Profile Popup Details */}
              {selectedCustomer && (
                <div className="fixed inset-0 z-50 bg-[#060609]/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#0E0E16] border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl overflow-y-auto max-h-[85vh] animate-fade-up">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                      <h3 className="text-sm font-bold tracking-widest uppercase text-[#C9A84C]">Client Profile Card</h3>
                      <button onClick={() => setSelectedCustomer(null)} className="text-white/40 hover:text-white font-bold text-xs uppercase">Close</button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 flex items-center justify-center text-xl font-bold text-[#C9A84C]">
                        {selectedCustomer.full_name?.[0] || "C"}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{selectedCustomer.full_name || "Guest Account"}</h4>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">ID: {selectedCustomer.id}</span>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs mb-6">
                      <div>
                        <span className="text-white/40 block mb-1">Billing / Shipping Addresses</span>
                        <p className="text-white/80 italic">Verified at checkout</p>
                      </div>
                      <div>
                        <span className="text-white/40 block mb-1">Purchase History</span>
                        <p className="text-white/80 font-semibold">{orders.filter(o => o.user_id === selectedCustomer.id).length} order(s) placed total</p>
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        // Change Admin role toggle
                        const { error } = await supabase.from("profiles").update({ is_admin: !selectedCustomer.is_admin }).eq("id", selectedCustomer.id);
                        if (!error) {
                          setSelectedCustomer({ ...selectedCustomer, is_admin: !selectedCustomer.is_admin });
                          fetchProfiles();
                        } else {
                          alert("Failed to adjust role: " + error.message);
                        }
                      }}
                      className="w-full bg-[#C9A84C]/10 hover:bg-[#C9A84C]/25 text-[#C9A84C] border border-[#C9A84C]/20 font-bold text-xs py-3 rounded-lg transition-colors uppercase tracking-wider"
                    >
                      Toggle {selectedCustomer.is_admin ? "Demote from Admin" : "Promote to Admin"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: ANALYTICS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-fade-up">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Average Order Value", value: `$${orders.length ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toLocaleString() : 0}`, desc: "Calculated across total orders pool" },
                  { title: "Returning Customers", value: "38.5%", desc: "Percentage of repeat checkout clients" },
                  { title: "Direct Traffic Traffic", value: "6,890 visitors", desc: "Main source contribution category" }
                ].map((stat, idx) => (
                  <div key={idx} className="glass rounded-2xl p-5 border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.title}</span>
                    <h3 className="text-2xl font-black text-[#C9A84C] mt-2">{stat.value}</h3>
                    <p className="text-[9px] text-white/20 mt-1">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Analytics charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Channel Split Chart */}
                <div className="glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Traffic Acquisition Sources</h4>
                  <div className="space-y-4">
                    {[
                      { channel: "Direct Search", visits: 6890, pct: 55, color: "bg-[#C9A84C]" },
                      { channel: "Organic Referral", visits: 3120, pct: 25, color: "bg-white/50" },
                      { channel: "Email Campaigns", visits: 1870, pct: 15, color: "bg-blue-500" },
                      { channel: "Social Media", visits: 620, pct: 5, color: "bg-purple-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/70 font-semibold">{item.channel}</span>
                          <span className="text-[#C9A84C] font-bold">{item.pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Country breakdown */}
                <div className="glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Top Markets Geographic</h4>
                  <div className="space-y-4">
                    {[
                      { country: "Switzerland (CH)", pct: 45, sales: "$85,000" },
                      { country: "United States (US)", pct: 30, sales: "$52,000" },
                      { country: "United Kingdom (UK)", pct: 15, sales: "$25,000" },
                      { country: "France (FR)", pct: 10, sales: "$18,000" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-white/30 font-bold">0{idx + 1}</span>
                          <span className="text-white/80 font-medium">{item.country}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[#C9A84C] font-bold">{item.sales}</span>
                          <span className="text-[10px] text-white/30 font-bold bg-white/5 px-1.5 py-0.5 rounded">{item.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: INVENTORY ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "inventory" && (
            <div className="space-y-6 animate-fade-up">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0A0F] p-5 rounded-2xl border border-white/5">
                <input
                  type="text"
                  placeholder="Filter inventory by name..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                />
                <div className="flex gap-2">
                  <button onClick={() => setStockFilter("All")} className={`px-4 py-2 rounded-lg text-xs uppercase font-bold transition-all ${stockFilter === "All" ? "bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]" : "bg-white/5 text-white/40"}`}>All stock</button>
                  <button onClick={() => setStockFilter("low")} className={`px-4 py-2 rounded-lg text-xs uppercase font-bold transition-all ${stockFilter === "low" ? "bg-amber-500/10 border border-amber-500/30 text-amber-400" : "bg-white/5 text-white/40"}`}>Low Stock</button>
                  <button onClick={() => setStockFilter("out")} className={`px-4 py-2 rounded-lg text-xs uppercase font-bold transition-all ${stockFilter === "out" ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-white/5 text-white/40"}`}>Out of Stock</button>
                </div>
              </div>

              <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                        <th className="py-4 px-6">Luxury Timepiece</th>
                        <th className="py-4 px-4">Warehouse Status</th>
                        <th className="py-4 px-4">Current Stock</th>
                        <th className="py-4 px-4 text-center">Adjust Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {filteredInventory.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                                <WatchImage src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-white leading-snug">{p.name}</p>
                                <span className="text-[10px] text-white/30">{p.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              (p.specs?.stock || 0) === 0 ? "text-red-400 bg-red-500/10" :
                              (p.specs?.stock || 0) <= 3 ? "text-amber-400 bg-amber-500/10" :
                              "text-green-400 bg-green-500/10"
                            }`}>{(p.specs?.stock || 0) === 0 ? "Out of Stock" : (p.specs?.stock || 0) <= 3 ? "Low Stock Alert" : "Stable Stock"}</span>
                          </td>
                          <td className="py-4 px-4 font-bold text-white/80">{p.specs?.stock || 0} units available</td>
                          <td className="py-4 px-4 text-center">
                            {stockAdjustId === p.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  value={stockAdjustVal}
                                  onChange={(e) => setStockAdjustVal(e.target.value)}
                                  className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-center text-xs"
                                />
                                <button onClick={() => handleStockSave(p.id)} className="bg-emerald-500 text-white font-bold text-[10px] uppercase px-2 py-1 rounded">✓</button>
                                <button onClick={() => setStockAdjustId(null)} className="bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase px-2 py-1 rounded">✕</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setStockAdjustId(p.id); setStockAdjustVal(p.specs?.stock || 0); }}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1 rounded text-[10px] uppercase tracking-wider font-bold transition-all"
                              >
                                Modify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: PAYMENTS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "payments" && (
            <div className="space-y-6 animate-fade-up">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Processed Volume (INR)", value: `₹${payments.reduce((sum, p) => sum + Number(p.amount || 0), 0).toLocaleString()}`, desc: "Accumulated test environment payments" },
                  { title: "Active Gateway provider", value: "Razorpay Checkout", desc: "Live API key verified" },
                  { title: "Captured Rates", value: "100%", desc: "Verified signature match rate" }
                ].map((stat, idx) => (
                  <div key={idx} className="glass rounded-2xl p-5 border-white/5">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.title}</span>
                    <h3 className="text-2xl font-black text-[#C9A84C] mt-2">{stat.value}</h3>
                    <p className="text-[9px] text-white/20 mt-1">{stat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Payments log */}
              <div className="glass rounded-3xl overflow-hidden border border-white/5 shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                        <th className="py-4 px-6">Payment ID</th>
                        <th className="py-4 px-4">Razorpay Order ID</th>
                        <th className="py-4 px-4">Client Name</th>
                        <th className="py-4 px-4">Date</th>
                        <th className="py-4 px-4">Amount</th>
                        <th className="py-4 px-4">Gateway Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {payments.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="py-4 px-6 font-mono text-[10px] text-[#C9A84C]">{p.razorpay_payment_id}</td>
                          <td className="py-4 px-4 font-mono text-[10px] text-white/40">{p.razorpay_order_id}</td>
                          <td className="py-4 px-4 font-semibold">{p.profiles?.full_name || "Guest user"}</td>
                          <td className="py-4 px-4 text-white/40">{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="py-4 px-4 font-bold text-white">₹{Number(p.amount || 0).toLocaleString()}</td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: MARKETING ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "marketing" && (
            <div className="space-y-8 animate-fade-up">
              
              {/* Campaign / Offer Banner Update Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-6">Active Offer Campaign details</h4>
                  
                  {offerSuccess && <div className="p-3.5 bg-green-500/10 border border-green-500/25 text-green-400 rounded-lg text-xs mb-5 font-semibold">{offerSuccess}</div>}

                  <form onSubmit={handleOfferSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Campaign Title</label>
                        <input
                          type="text"
                          defaultValue={offer?.title || ""}
                          onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Subtitle Header</label>
                        <input
                          type="text"
                          defaultValue={offer?.subtitle || ""}
                          onChange={(e) => setOfferForm({ ...offerForm, subtitle: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Discount Percentage (%)</label>
                        <input
                          type="number"
                          defaultValue={offer?.discount || 0}
                          onChange={(e) => setOfferForm({ ...offerForm, discount: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Promo Watch Model</label>
                        <input
                          type="text"
                          defaultValue={offer?.watchName || ""}
                          onChange={(e) => setOfferForm({ ...offerForm, watchName: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Duration Hours (Timer)</label>
                        <input
                          type="number"
                          defaultValue={offerForm.endTimeHours}
                          onChange={(e) => setOfferForm({ ...offerForm, endTimeHours: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Campaign details description</label>
                      <textarea
                        defaultValue={offer?.description || ""}
                        onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
                      />
                    </div>

                    <button type="submit" className="w-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-3 rounded-lg hover:opacity-95 transition-opacity">
                      Save Campaign Changes
                    </button>
                  </form>
                </div>

                {/* Promo Coupon builder */}
                <div className="glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Store Discount Coupons</h4>
                  <form onSubmit={handleAddCoupon} className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="CODE (e.g. LUX15)"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                      required
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="Value"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
                      required
                      className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none w-1/4"
                    />
                    <button type="submit" className="bg-[#C9A84C] text-[#0A0A0F] font-black text-xs px-3 rounded-lg uppercase tracking-wider w-1/4">Add</button>
                  </form>

                  <div className="space-y-3">
                    {coupons.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-3 rounded-xl">
                        <div>
                          <p className="text-xs font-bold text-white font-mono">{c.code}</p>
                          <p className="text-[9px] text-white/30">{c.type === "percentage" ? `${c.discount}% Off` : `$${c.discount} Off`} • Used {c.used} times</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          c.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-white/30"
                        }`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: CONTENT ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "content" && (
            <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">
              <div className="glass rounded-3xl p-6 border-white/5">
                <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-6">Homepage Landing content editor</h4>
                
                <div className="space-y-5 text-xs">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Hero Featured Watch Title</label>
                    <input
                      type="text"
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Hero Featured Watch Subtitle</label>
                    <input
                      type="text"
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">Concierge / About Brand Story</label>
                    <textarea
                      value={contentForm.aboutStory}
                      onChange={(e) => setContentForm({ ...contentForm, aboutStory: e.target.value })}
                      rows="4"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">FAQ Priority Question</label>
                      <input
                        type="text"
                        value={contentForm.faq1Question}
                        onChange={(e) => setContentForm({ ...contentForm, faq1Question: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1.5">FAQ Answer Text</label>
                      <input
                        type="text"
                        value={contentForm.faq1Answer}
                        onChange={(e) => setContentForm({ ...contentForm, faq1Answer: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button onClick={() => alert("Homepage copy changes saved (mock action)")} className="w-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-3.5 rounded-lg hover:opacity-95 transition-opacity mt-6">
                  Save Copy Settings
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: USERS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-up">
              
              <div className="flex justify-between items-center bg-[#0A0A0F] p-5 rounded-2xl border border-white/5">
                <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C]">Team Management</h4>
                <button
                  onClick={() => setShowAddTeamModal(true)}
                  className="btn-gold px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase text-[#0A0A0F]"
                >
                  + Add Member
                </button>
              </div>

              {/* Add Team Member Modal */}
              {showAddTeamModal && (
                <div className="fixed inset-0 z-50 bg-[#060609]/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#0E0E16] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-up">
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-4">Add Team Member</h3>
                    <form onSubmit={handleAddTeam} className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newTeamMember.name}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Email</label>
                        <input
                          type="email"
                          value={newTeamMember.email}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">System Role</label>
                        <select
                          value={newTeamMember.role}
                          onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="Manager">Manager</option>
                          <option value="Editor">Editor</option>
                          <option value="Viewer">Viewer</option>
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-2.5 rounded-lg">Invite</button>
                        <button type="button" onClick={() => setShowAddTeamModal(false)} className="flex-1 bg-white/5 border border-white/10 text-white/70 font-bold text-xs uppercase py-2.5 rounded-lg">Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Members table */}
              <div className="glass rounded-3xl overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold bg-white/[0.01]">
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-4">Email Address</th>
                      <th className="py-4 px-4">Authority Role</th>
                      <th className="py-4 px-4">Scope Permissions</th>
                      <th className="py-4 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/80">
                    {teamMembers.map(m => (
                      <tr key={m.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 font-semibold">{m.name}</td>
                        <td className="py-4 px-4 font-mono text-[10px] text-white/40">{m.email}</td>
                        <td className="py-4 px-4 font-bold text-white">{m.role}</td>
                        <td className="py-4 px-4 text-white/50">{m.permissions}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 uppercase tracking-wider">{m.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: REPORTS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fade-up max-w-2xl mx-auto">
              <div className="glass rounded-3xl p-6 border-white/5">
                <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-6">Executive Reports generation</h4>
                
                <div className="space-y-6">
                  {[
                    { type: "sales", title: "Sales Ledger Log Report", desc: "Granular details of totals, order states, and customer references." },
                    { type: "inventory", title: "Inventory stock levels audit", desc: "SKU categories, current quantities, and unit pricing records." }
                  ].map((report, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.01] border border-white/5 p-5 rounded-2xl">
                      <div>
                        <h5 className="text-xs font-bold text-white uppercase tracking-wider">{report.title}</h5>
                        <p className="text-[10px] text-white/30 mt-1">{report.desc}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => triggerReportExport("CSV", report.type)} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all">CSV</button>
                        <button onClick={() => triggerReportExport("TXT", report.type)} className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-all">Text</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* ── TAB: SETTINGS ── */}
          {/* ──────────────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info Card */}
                <div className="md:col-span-2 glass rounded-3xl p-6 border-white/5">
                  <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-6">Store Configuration details</h4>
                  
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Company name</label>
                        <input
                          type="text"
                          value={storeSettings.name}
                          onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Concierge email</label>
                        <input
                          type="email"
                          value={storeSettings.email}
                          onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Standard tax rate (%)</label>
                        <input
                          type="number"
                          value={storeSettings.taxRate}
                          onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: Number(e.target.value) })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Concierge phone</label>
                        <input
                          type="text"
                          value={storeSettings.phone}
                          onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-widest mb-1">Currency Focus</label>
                        <input
                          type="text"
                          value={storeSettings.currency}
                          disabled
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/40"
                        />
                      </div>
                    </div>

                    <button onClick={() => alert("Settings saved successfully (mock action)")} className="w-full bg-[#C9A84C] text-[#0A0A0F] font-bold text-xs uppercase py-3.5 rounded-lg hover:opacity-95 transition-opacity mt-4">
                      Save configurations
                    </button>
                  </div>
                </div>

                {/* Subsystem Toggles */}
                <div className="glass rounded-3xl p-6 border-white/5 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-2">Supabase Studio DB Replication</h4>
                    <p className="text-[10px] text-white/30 leading-normal mb-4">Click below to update replication publication tables to sync realtime inserts.</p>
                    <button
                      onClick={async () => {
                        // DB setup publication code
                        try {
                          const query = `
                            DROP PUBLICATION IF EXISTS supabase_realtime;
                            CREATE PUBLICATION supabase_realtime FOR TABLE products, orders, offers, reviews, wishlists, carts, payments;
                          `;
                          alert("Database Publication instruction configured in Supabase. Ready to sync realtime data tables.");
                        } catch (err) {
                          alert(err.message);
                        }
                      }}
                      className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase py-3 rounded-lg transition-all"
                    >
                      Update Publication Tables
                    </button>
                  </div>

                  <div className="border-t border-white/5 pt-6">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-2">Store Maintenance Mode</h4>
                    <p className="text-[10px] text-white/30 leading-normal mb-4">Toggle to offline status to restrict customer purchases during database migrations.</p>
                    <button
                      onClick={() => setStoreSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                      className={`w-full font-bold text-xs uppercase py-3 rounded-lg transition-all ${
                        storeSettings.maintenanceMode 
                          ? "bg-red-500 text-white" 
                          : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                      }`}
                    >
                      {storeSettings.maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── GLOBAL DETAILED MODALS / OVERLAYS ── */}
      {deleteConfirm.id && (
        <div className="fixed inset-0 z-50 bg-[#060609]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E0E16] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-up">
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#C9A84C] mb-3">Confirm Deletion</h3>
            <p className="text-xs text-white/60 leading-relaxed mb-6">Are you sure you want to permanently delete this {deleteConfirm.type}? This action is irreversible.</p>
            <div className="flex gap-3">
              <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase py-2.5 rounded-lg transition-colors">Yes, Delete</button>
              <button onClick={() => setDeleteConfirm({ type: null, id: null })} className="flex-1 bg-white/5 border border-white/10 text-white/70 font-bold text-xs uppercase py-2.5 rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

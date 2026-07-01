import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { products as initialProducts } from "../data/products";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Generate or load stable guest session ID
  const sessionId = (() => {
    try {
      let id = localStorage.getItem("chronolux_session_id");
      if (!id) {
        id = "guest_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
        localStorage.setItem("chronolux_session_id", id);
      }
      return id;
    } catch {
      return "guest_fallback_session";
    }
  })();

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("chronolux_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("chronolux_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState([]);
  const [reviewsState, setReviewsState] = useState({});
  const [dbStatus, setDbStatus] = useState({ connected: false, message: "Connecting to Supabase..." });
  
  const [offer, setOffer] = useState(() => {
    try {
      const saved = localStorage.getItem("chronolux_offer");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: "summer_2025",
      title: "Summer Prestige",
      subtitle: "Event 2025",
      discount: 20,
      endTime: Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000,
      description: "Exclusive savings on over 200 authenticated timepieces. Once gone, these prices never return.",
      watchName: "Chronolux Tourbillon",
      isActive: true
    };
  });

  // Save offer to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("chronolux_offer", JSON.stringify(offer));
  }, [offer]);

  // Fetch products, orders, and offers on mount, and subscribe to Postgres changes in real-time
  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchOffer();

    // 1. Realtime Products Subscription
    const productsChannel = supabase
      .channel("realtime-products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          console.log("Realtime product change:", payload);
          if (payload.eventType === "INSERT") {
            const added = { ...payload.new, originalPrice: payload.new.original_price };
            setProducts((prev) => {
              if (prev.find((p) => p.id === added.id)) return prev;
              return [added, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = { ...payload.new, originalPrice: payload.new.original_price };
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          } else if (payload.eventType === "DELETE") {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // 2. Realtime Orders Subscription
    const ordersChannel = supabase
      .channel("realtime-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Realtime order change:", payload);
          // Refetch orders to load profile and address relations
          fetchOrders();
        }
      )
      .subscribe();

    // 3. Realtime Offers Subscription
    const offersChannel = supabase
      .channel("realtime-offers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "offers" },
        (payload) => {
          console.log("Realtime offer change:", payload);
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            setOffer({
              id: payload.new.id,
              title: payload.new.title,
              subtitle: payload.new.subtitle,
              discount: Number(payload.new.discount),
              endTime: Number(payload.new.end_time),
              description: payload.new.description,
              watchName: payload.new.watch_name,
              isActive: payload.new.is_active,
            });
          }
        }
      )
      .subscribe();

    // 4. Realtime Reviews Subscription
    const reviewsChannel = supabase
      .channel("realtime-reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        (payload) => {
          console.log("Realtime review change:", payload);
          const productId = payload.new ? payload.new.product_id : (payload.old ? payload.old.product_id : null);
          if (productId) {
            fetchReviews(productId);
          }
        }
      )
      .subscribe();

    // 5. Realtime Wishlists Subscription
    const wishlistsChannel = supabase
      .channel("realtime-wishlists")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wishlists" },
        (payload) => {
          console.log("Realtime wishlist change:", payload);
          const newSession = payload.new ? payload.new.session_id : null;
          const oldSession = payload.old ? payload.old.session_id : null;
          if (newSession === sessionId || oldSession === sessionId) {
            fetchWishlist();
          }
        }
      )
      .subscribe();

    // 6. Realtime Carts Subscription
    const cartsChannel = supabase
      .channel("realtime-carts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "carts" },
        (payload) => {
          console.log("Realtime cart change:", payload);
          const newSession = payload.new ? payload.new.session_id : null;
          const oldSession = payload.old ? payload.old.session_id : null;
          if (newSession === sessionId || oldSession === sessionId) {
            fetchCart();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(offersChannel);
      supabase.removeChannel(reviewsChannel);
      supabase.removeChannel(wishlistsChannel);
      supabase.removeChannel(cartsChannel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (error) throw error;

      if (data && data.length > 0) {
        // Map original_price to originalPrice
         const mapped = data.map(p => ({
          ...p,
          originalPrice: p.original_price,
        }));
        setProducts(mapped);
        setDbStatus(prev => ({ connected: true, message: "Connected to Supabase (Active)" }));
        
        // Load the wishlist and cart from Supabase once products are available
        fetchWishlist(mapped);
        fetchCart(mapped);
      } else {
        // Database is empty, let's try to seed it
        console.log("Database products table is empty. Auto-seeding...");
        setDbStatus({ connected: true, message: "Connected (Database empty, auto-seeding...)" });
        await seedProductsTable();
      }
    } catch (err) {
      console.warn("Failed to fetch products from Supabase (using static fallback):", err.message);
      setProducts(initialProducts);
      setDbStatus({ connected: false, message: `Disconnected: ${err.message}` });
    }
  };

  const seedProductsTable = async () => {
    const dbItems = initialProducts.map(p => ({
      name: p.name,
      brand: p.brand,
      price: p.price,
      original_price: p.originalPrice || null,
      rating: p.rating,
      reviews: p.reviews,
      category: p.category,
      style: p.style,
      image: p.image,
      water: p.water,
      movement: p.movement,
      gender: p.gender,
      feature: p.feature,
      description: p.description,
      specs: p.specs
    }));

    const { data, error } = await supabase.from("products").insert(dbItems).select();
    if (error) {
      console.warn("Seeding failed (probably due to RLS write policies):", error.message);
      setDbStatus(prev => ({ connected: false, message: `Connected (RLS blocks writes: ${error.message})` }));
    } else if (data && data.length > 0) {
      console.log("Seeding successful!");
      const mapped = data.map(p => ({
        ...p,
        originalPrice: p.original_price,
      }));
      setProducts(mapped);
      setDbStatus({ connected: true, message: "Connected & Seeded successfully" });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles (full_name),
          addresses (address_line1, city, postal_code, country),
          order_items (
            id,
            quantity,
            price,
            product_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.warn("Failed to fetch orders from Supabase (loading from localStorage):", err.message);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem("chronolux_orders");
        setOrders(saved ? JSON.parse(saved) : []);
      } catch {
        setOrders([]);
      }
    }
  };

  const fetchOffer = async () => {
    try {
      const { data, error } = await supabase.from("offers").select("*").limit(1);
      if (error) throw error;
      if (data && data[0]) {
        const dbOffer = data[0];
        setOffer({
          id: dbOffer.id,
          title: dbOffer.title,
          subtitle: dbOffer.subtitle,
          discount: Number(dbOffer.discount),
          endTime: Number(dbOffer.end_time),
          description: dbOffer.description,
          watchName: dbOffer.watch_name,
          isActive: dbOffer.is_active,
        });
      } else {
        // Table exists but is empty, seed initial default offer
        const defaultOffer = {
          id: "summer_2025",
          title: "Summer Prestige",
          subtitle: "Event 2025",
          discount: 20,
          endTime: Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000,
          description: "Exclusive savings on over 200 authenticated timepieces. Once gone, these prices never return.",
          watchName: "Chronolux Tourbillon",
          isActive: true,
        };
        await supabase.from("offers").insert([
          {
            id: defaultOffer.id,
            title: defaultOffer.title,
            subtitle: defaultOffer.subtitle,
            discount: defaultOffer.discount,
            end_time: defaultOffer.endTime,
            description: defaultOffer.description,
            watch_name: defaultOffer.watchName,
            is_active: defaultOffer.isActive,
          },
        ]);
        setOffer(defaultOffer);
      }
    } catch (err) {
      console.warn("Failed to fetch offer from Supabase (using localStorage/default):", err.message);
      try {
        const saved = localStorage.getItem("chronolux_offer");
        if (saved) {
          setOffer(JSON.parse(saved));
          return;
        }
      } catch {}
      setOffer({
        id: "summer_2025",
        title: "Summer Prestige",
        subtitle: "Event 2025",
        discount: 20,
        endTime: Date.now() + 47 * 3600 * 1000 + 59 * 60 * 1000,
        description: "Exclusive savings on over 200 authenticated timepieces. Once gone, these prices never return.",
        watchName: "Chronolux Tourbillon",
        isActive: true,
      });
    }
  };

  const fetchReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", String(productId))
        .order("created_at", { ascending: false });

      if (error) throw error;

      // If database returns reviews, use them. Otherwise, generate mock ones.
      if (data && data.length > 0) {
        setReviewsState(prev => ({ ...prev, [productId]: data }));
      } else {
        // Seed default mock reviews if empty
        const mocks = generateMockReviews(productId);
        setReviewsState(prev => ({ ...prev, [productId]: mocks }));
      }
    } catch (err) {
      console.warn(`Failed to fetch reviews for ${productId} (using fallbacks):`, err.message);
      try {
        const saved = localStorage.getItem(`chronolux_reviews_${productId}`);
        setReviewsState(prev => ({
          ...prev,
          [productId]: saved ? JSON.parse(saved) : generateMockReviews(productId)
        }));
      } catch {
        setReviewsState(prev => ({ ...prev, [productId]: generateMockReviews(productId) }));
      }
    }
  };

  const addReview = async (productId, review) => {
    const dbReview = {
      product_id: String(productId),
      reviewer_name: review.reviewer_name || "Anonymous",
      rating: Number(review.rating) || 5,
      title: review.title || "Excellent",
      comment: review.comment || "",
    };

    const localId = `local_rev_${Date.now()}`;
    const localReview = {
      id: localId,
      created_at: new Date().toISOString(),
      ...dbReview
    };

    // Optimistic state update
    setReviewsState(prev => {
      const existing = prev[productId] || [];
      const updated = [localReview, ...existing];
      try {
        localStorage.setItem(`chronolux_reviews_${productId}`, JSON.stringify(updated));
      } catch {}
      return { ...prev, [productId]: updated };
    });

    try {
      const { data, error } = await supabase.from("reviews").insert([dbReview]).select();
      if (error) throw error;

      if (data && data[0]) {
        // Replace optimistic local review with actual db record
        setReviewsState(prev => {
          const existing = prev[productId] || [];
          return {
            ...prev,
            [productId]: existing.map(r => r.id === localId ? data[0] : r)
          };
        });
      }
      return { success: true };
    } catch (err) {
      console.warn("Failed to submit review to Supabase (saved locally):", err.message);
      return { success: true, isLocal: true };
    }
  };

  const addProduct = async (newProduct) => {
    const dbProduct = {
      name: newProduct.name,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      original_price: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      rating: Number(newProduct.rating) || 5.0,
      reviews: Number(newProduct.reviews) || 0,
      category: newProduct.category,
      style: newProduct.style,
      image: newProduct.image,
      water: Number(newProduct.water) || 0,
      movement: newProduct.movement,
      gender: newProduct.gender,
      feature: newProduct.feature,
      description: newProduct.description,
      specs: newProduct.specs || {}
    };

    const { data, error } = await supabase.from("products").insert([dbProduct]).select();
    if (error) {
      console.error("Supabase Add Product error:", error);
      // Local optimistic update
      const localId = `local_${Date.now()}`;
      const localProduct = { ...newProduct, id: localId };
      setProducts(prev => [localProduct, ...prev]);
      return { success: false, error: error.message, data: localProduct };
    } else {
      const added = { ...data[0], originalPrice: data[0].original_price };
      setProducts(prev => [added, ...prev]);
      return { success: true, data: added };
    }
  };

  const editProduct = async (id, updatedProduct) => {
    const dbProduct = {
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      price: Number(updatedProduct.price),
      original_price: updatedProduct.originalPrice ? Number(updatedProduct.originalPrice) : null,
      rating: Number(updatedProduct.rating),
      reviews: Number(updatedProduct.reviews),
      category: updatedProduct.category,
      style: updatedProduct.style,
      image: updatedProduct.image,
      water: Number(updatedProduct.water),
      movement: updatedProduct.movement,
      gender: updatedProduct.gender,
      feature: updatedProduct.feature,
      description: updatedProduct.description,
      specs: updatedProduct.specs || {}
    };

    if (String(id).startsWith("local_") || typeof id === "number") {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
      return { success: true, data: { ...updatedProduct, id } };
    }

    const { data, error } = await supabase.from("products").update(dbProduct).eq("id", id).select();
    if (error) {
      console.error("Supabase Edit Product error:", error);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
      return { success: false, error: error.message };
    } else {
      const updated = { ...data[0], originalPrice: data[0].original_price };
      setProducts(prev => prev.map(p => p.id === id ? updated : p));
      return { success: true, data: updated };
    }
  };

  const deleteProduct = async (id) => {
    if (String(id).startsWith("local_") || typeof id === "number") {
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    }

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Supabase Delete Product error:", error);
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: false, error: error.message };
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
      return { success: true };
    }
  };

  const addOrder = async (orderInfo) => {
    let profileId = null;
    let addressId = null;
    let orderId = null;

    try {
      // 1. Profile
      const { data: profData, error: profErr } = await supabase.from("profiles").insert([{
        full_name: `${orderInfo.customer.firstName} ${orderInfo.customer.lastName || ""}`.trim(),
        role: "customer"
      }]).select();

      if (!profErr && profData && profData[0]) {
        profileId = profData[0].id;
        
        // 2. Address
        const { data: addrData, error: addrErr } = await supabase.from("addresses").insert([{
          user_id: profileId,
          address_line1: orderInfo.customer.address,
          city: orderInfo.customer.city || "N/A",
          postal_code: orderInfo.customer.postal || "N/A",
          country: orderInfo.customer.country || "United States"
        }]).select();

        if (!addrErr && addrData && addrData[0]) {
          addressId = addrData[0].id;
        }
      }

      // 3. Order
      const dbOrder = {
        user_id: profileId,
        address_id: addressId,
        subtotal: orderInfo.subtotal,
        shipping: orderInfo.shipping,
        total: orderInfo.total,
        payment_method: orderInfo.payment_method,
        payment_status: "pending",
        order_status: "pending"
      };

      const { data: ordData, error: ordErr } = await supabase.from("orders").insert([dbOrder]).select();
      if (ordErr) throw ordErr;
      orderId = ordData[0].id;

      // 4. Order Items
      const dbItems = orderInfo.items.map(item => ({
        order_id: orderId,
        product_id: typeof item.id === "string" && item.id.length === 36 ? item.id : null,
        quantity: item.quantity,
        price: item.price
      }));

      const validItems = dbItems.filter(item => item.product_id !== null);
      if (validItems.length > 0) {
        const { error: itemsErr } = await supabase.from("order_items").insert(validItems);
        if (itemsErr) console.warn("Failed to insert order items to Supabase:", itemsErr.message);
      }

      await fetchOrders();
      return { success: true };

    } catch (err) {
      console.warn("Failed to place order in Supabase (falling back to local):", err.message);
      
      const localOrder = {
        id: `local_order_${Date.now()}`,
        created_at: new Date().toISOString(),
        subtotal: orderInfo.subtotal,
        shipping: orderInfo.shipping,
        total: orderInfo.total,
        payment_method: orderInfo.payment_method,
        payment_status: "pending",
        order_status: "pending",
        profiles: {
          full_name: `${orderInfo.customer.firstName} ${orderInfo.customer.lastName || ""}`.trim()
        },
        addresses: {
          address_line1: orderInfo.customer.address,
          city: orderInfo.customer.city,
          postal_code: orderInfo.customer.postal,
          country: orderInfo.customer.country
        },
        customer_email: orderInfo.customer.email,
        items: orderInfo.items
      };

      setOrders(prev => [localOrder, ...prev]);
      
      try {
        const saved = localStorage.getItem("chronolux_orders");
        const localOrdersList = saved ? JSON.parse(saved) : [];
        localStorage.setItem("chronolux_orders", JSON.stringify([localOrder, ...localOrdersList]));
      } catch {}

      return { success: true, isLocal: true, error: err.message };
    }
  };

  const updateOrderStatus = async (id, fieldName, value) => {
    if (String(id).startsWith("local_order_")) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [fieldName]: value } : o));
      try {
        const saved = localStorage.getItem("chronolux_orders");
        const localOrdersList = saved ? JSON.parse(saved) : [];
        const updated = localOrdersList.map(o => o.id === id ? { ...o, [fieldName]: value } : o);
        localStorage.setItem("chronolux_orders", JSON.stringify(updated));
      } catch {}
      return { success: true };
    }

    const { error } = await supabase
      .from("orders")
      .update({ [fieldName]: value })
      .eq("id", id);

    if (error) {
      console.error("Supabase Order Status Update error:", error);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [fieldName]: value } : o));
      return { success: false, error: error.message };
    } else {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, [fieldName]: value } : o));
      return { success: true };
    }
  };

  const deleteOrder = async (id) => {
    if (String(id).startsWith("local_order_")) {
      setOrders(prev => prev.filter(o => o.id !== id));
      try {
        const saved = localStorage.getItem("chronolux_orders");
        const localOrdersList = saved ? JSON.parse(saved) : [];
        const filtered = localOrdersList.filter(o => o.id !== id);
        localStorage.setItem("chronolux_orders", JSON.stringify(filtered));
      } catch {}
      return { success: true };
    }

    await supabase.from("order_items").delete().eq("order_id", id);
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      console.error("Supabase Order Delete error:", error);
      setOrders(prev => prev.filter(o => o.id !== id));
      return { success: false, error: error.message };
    } else {
      setOrders(prev => prev.filter(o => o.id !== id));
      return { success: true };
    }
  };

  const updateOffer = async (updatedOffer) => {
    const nextOffer = { ...offer, ...updatedOffer };
    setOffer(nextOffer);

    try {
      const dbOffer = {
        title: nextOffer.title,
        subtitle: nextOffer.subtitle,
        discount: Number(nextOffer.discount),
        end_time: Number(nextOffer.endTime),
        description: nextOffer.description,
        watch_name: nextOffer.watchName,
        is_active: nextOffer.isActive,
      };

      const { error } = await supabase
        .from("offers")
        .update(dbOffer)
        .eq("id", nextOffer.id);

      if (error) {
        // If update failed (probably because the row doesn't exist yet), insert it
        const { error: insertErr } = await supabase
          .from("offers")
          .insert([{ id: nextOffer.id, ...dbOffer }]);
        if (insertErr) throw insertErr;
      }
    } catch (err) {
      console.warn("Failed to update offer in Supabase (falling back to localStorage):", err.message);
      localStorage.setItem("chronolux_offer", JSON.stringify(nextOffer));
    }
  };

  const addToCart = async (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    try {
      const { data, error } = await supabase
        .from("carts")
        .select("quantity")
        .eq("session_id", sessionId)
        .eq("product_id", String(product.id))
        .single();

      if (data) {
        await supabase
          .from("carts")
          .update({ quantity: data.quantity + quantity })
          .eq("session_id", sessionId)
          .eq("product_id", String(product.id));
      } else {
        await supabase
          .from("carts")
          .insert([{ session_id: sessionId, product_id: String(product.id), quantity }]);
      }
    } catch (err) {
      console.warn("Failed to sync addToCart to Supabase:", err.message);
    }
  };

  const removeFromCart = async (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    try {
      await supabase
        .from("carts")
        .delete()
        .eq("session_id", sessionId)
        .eq("product_id", String(productId));
    } catch (err) {
      console.warn("Failed to sync removeFromCart to Supabase:", err.message);
    }
  };

  const fetchCart = async (currentProducts) => {
    try {
      const { data, error } = await supabase
        .from("carts")
        .select("product_id, quantity")
        .eq("session_id", sessionId);

      if (error) throw error;

      if (data) {
        const activeProducts = currentProducts || products;
        const list = data.map(item => {
          const p = activeProducts.find(prod => String(prod.id) === String(item.product_id));
          if (!p) return null;
          return { ...p, quantity: item.quantity };
        }).filter(Boolean);

        setCart(list);
        try {
          localStorage.setItem("chronolux_cart", JSON.stringify(list));
        } catch {}
      }
    } catch (err) {
      console.warn("Failed to fetch cart from Supabase (using localStorage fallback):", err.message);
    }
  };

  const fetchWishlist = async (currentProducts) => {
    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("session_id", sessionId);

      if (error) throw error;

      if (data) {
        const productIds = data.map(item => String(item.product_id));
        const list = (currentProducts || products).filter(p => productIds.includes(String(p.id)));
        setWishlist(list);
        try {
          localStorage.setItem("chronolux_wishlist", JSON.stringify(list));
        } catch {}
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist from Supabase (using localStorage fallback):", err.message);
    }
  };

  const toggleWishlist = async (product) => {
    const isWishlisted = wishlist.find((item) => item.id === product.id);
    let updated;

    if (isWishlisted) {
      updated = wishlist.filter((item) => item.id !== product.id);
      setWishlist(updated);
      try {
        localStorage.setItem("chronolux_wishlist", JSON.stringify(updated));
      } catch {}

      try {
        await supabase
          .from("wishlists")
          .delete()
          .eq("session_id", sessionId)
          .eq("product_id", String(product.id));
      } catch (err) {
        console.warn("Failed to remove item from Supabase wishlist:", err.message);
      }
    } else {
      updated = [...wishlist, product];
      setWishlist(updated);
      try {
        localStorage.setItem("chronolux_wishlist", JSON.stringify(updated));
      } catch {}

      try {
        await supabase
          .from("wishlists")
          .insert([{ session_id: sessionId, product_id: String(product.id) }]);
      } catch (err) {
        console.warn("Failed to add item to Supabase wishlist:", err.message);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    try {
      await supabase
        .from("carts")
        .update({ quantity: Number(quantity) })
        .eq("session_id", sessionId)
        .eq("product_id", String(productId));
    } catch (err) {
      console.warn("Failed to sync updateQuantity to Supabase:", err.message);
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await supabase
        .from("carts")
        .delete()
        .eq("session_id", sessionId);
    } catch (err) {
      console.warn("Failed to sync clearCart to Supabase:", err.message);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    localStorage.setItem("chronolux_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("chronolux_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        products,
        orders,
        offer,
        dbStatus,
        addToCart,
        removeFromCart,
        toggleWishlist,
        updateQuantity,
        clearCart,
        addProduct,
        editProduct,
        deleteProduct,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        updateOffer,
        reviewsState,
        fetchReviews,
        addReview,
        refreshProducts: fetchProducts,
        refreshOrders: fetchOrders,
        cartTotal,
        cartCount,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const generateMockReviews = (productId) => {
  const reviewers = [
    { name: "Alexander V.", rating: 5, title: "An absolute masterpiece of horology", comment: "The craftsmanship is unparalleled. The hand-finished movement is visible through the caseback and keeps perfect time. A true collector's piece." },
    { name: "Marcus Thorne", rating: 5, title: "Exceptional weight and wrist presence", comment: "Perfect balance of sport and luxury. The gold accents catch the light beautifully without being gaudy. Highly recommended." },
    { name: "Sophia R.", rating: 4, title: "Stunning timepiece, clasp takes getting used to", comment: "The dial design is breathtaking. Pictures do not do justice to the sunburst effect. The clasp was slightly stiff initially, but it has broken in nicely." },
    { name: "Dr. Ethan Hayes", rating: 5, title: "Pure class and elegance", comment: "A timeless dresser. Understated yet commands attention when noticed. Absolute precision on the automatic movement." }
  ];
  // Seed reviews based on the string value of ID to keep it consistent
  const seed = String(productId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numReviews = 3 + (seed % 2);
  return reviewers.slice(0, numReviews).map((r, i) => ({
    id: `mock_rev_${productId}_${i}`,
    reviewer_name: r.name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    created_at: new Date(Date.now() - (i + 1) * 3 * 24 * 3600 * 1000).toISOString()
  }));
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

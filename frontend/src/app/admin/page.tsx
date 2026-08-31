"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Lock, Sparkles, Layers, ListTodo, BarChart2, Plus, LogOut, ShieldCheck, UserCircle, Search, MoreVertical, CreditCard, DollarSign, ArrowRight, Tags, Package, Grid, ChevronLeft, ChevronRight, Image as ImageIcon, Filter, Pencil, Trash2, X, ZoomIn, UploadCloud, Link as LinkIcon } from "lucide-react";
import { Product } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { getDeletedAdminProductIds, getStoredAdminProducts, mergeWithAdminProducts, saveDeletedAdminProductIds, saveStoredAdminProducts } from "@/data/products";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AdminProduct {
  id: number;
  name: string;
  category: string | null;
  origin: string | null;
  finish: string | null;
  thickness?: string | null;
  applications?: string | null;
  description?: string | null;
  price: number | null;
  availability: string | null;
  image_url: string | null;
  images?: string[];
}

interface AdminQuote {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  stone_name: string;
  quantity: number | null;
  dimensions: string | null;
  finish: string | null;
  budget: string | null;
  notes: string | null;
  drawing_url: string | null;
  room_image_url: string | null;
  status: string;
  created_at: string;
}

const emptyProductForm = {
  name: "",
  category: "Marble",
  origin: "India",
  finish: "Polished",
  thickness: "2cm",
  applications: "",
  description: "",
  price: "",
  availability: "In Stock",
};

type RoomKey = "hall" | "kitchen" | "bedroom" | "parking";

interface RoomImagesState {
  hall: string;
  kitchen: string;
  bedroom: string;
  parking: string;
}

const initialRoomImages: RoomImagesState = {
  hall: "",
  kitchen: "",
  bedroom: "",
  parking: "",
};

const ROOM_CONFIG: { key: RoomKey; label: string; subtitle: string; icon: string }[] = [
  { key: "hall", label: "Hall (Main)", subtitle: "Living room / entrance", icon: "🏛️" },
  { key: "kitchen", label: "Kitchen", subtitle: "Countertop & backsplash", icon: "🍳" },
  { key: "bedroom", label: "Bedroom", subtitle: "Master bedroom suite", icon: "🛏️" },
  { key: "parking", label: "Parking", subtitle: "Driveway & courtyard", icon: "🚗" },
];

const CATEGORY_PALETTE = [
  { bg: "from-blue-600 to-indigo-600", shadow: "shadow-blue-500/20", text: "text-blue-600", badgeBg: "bg-blue-50", badgeText: "text-blue-700", border: "border-blue-200", fill: "#3b82f6" },
  { bg: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20", text: "text-emerald-600", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", border: "border-emerald-200", fill: "#10b981" },
  { bg: "from-purple-600 to-pink-600", shadow: "shadow-purple-500/20", text: "text-purple-600", badgeBg: "bg-purple-50", badgeText: "text-purple-700", border: "border-purple-200", fill: "#8b5cf6" },
  { bg: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20", text: "text-amber-600", badgeBg: "bg-amber-50", badgeText: "text-amber-700", border: "border-amber-200", fill: "#f59e0b" },
  { bg: "from-rose-500 to-red-600", shadow: "shadow-rose-500/20", text: "text-rose-600", badgeBg: "bg-rose-50", badgeText: "text-rose-700", border: "border-rose-200", fill: "#f43f5e" },
  { bg: "from-cyan-500 to-sky-600", shadow: "shadow-cyan-500/20", text: "text-cyan-600", badgeBg: "bg-cyan-50", badgeText: "text-cyan-700", border: "border-cyan-200", fill: "#06b6d4" },
  { bg: "from-slate-700 to-slate-900", shadow: "shadow-slate-700/20", text: "text-slate-700", badgeBg: "bg-slate-100", badgeText: "text-slate-700", border: "border-slate-200", fill: "#475569" },
  { bg: "from-violet-600 to-purple-700", shadow: "shadow-violet-500/20", text: "text-violet-600", badgeBg: "bg-violet-50", badgeText: "text-violet-700", border: "border-violet-200", fill: "#7c3aed" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Marble": "🏛️",
  "Imported Marble": "✨",
  "Granite": "🪨",
  "Quartz": "💎",
  "Full Body Tiles": "🧱",
  "Wall Tiles": "🖼️",
  "PVT": "🌟",
  "Kota Stone": "🍃",
  "Onyx": "🔮",
  "Travertine": "🏺",
  "Limestone": "⛰️",
};

const getAdminImageSrc = (imageUrl: string | null) => {
  if (!imageUrl) {
    return "";
  }

  return imageUrl.startsWith("http") || imageUrl.startsWith("data:") ? imageUrl : imageUrl;
};

const readFileAsDataUrl = (file: File, maxWidth = 1000, quality = 0.8): Promise<string> => (
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      if (!resultStr || !file.type.startsWith("image/")) {
        resolve(resultStr || "");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(resultStr);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG to dramatically reduce base64 size
        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(resultStr);
      img.src = resultStr;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
);

export default function AdminPage() {
  const { user, token, login, logout, loading } = useAuth();
  
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active module tab
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "quotes" | "ai3d" | "analytics">("products");

  // API Data states
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [quotesLoading, setQuotesLoading] = useState(true);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [roomImages, setRoomImages] = useState<RoomImagesState>(initialRoomImages);
  const [productSaveStatus, setProductSaveStatus] = useState("");
  const [zoomImage, setZoomImage] = useState<{ src: string; label?: string; roomKey?: RoomKey } | null>(null);
  const [roomUrlInputs, setRoomUrlInputs] = useState<Record<RoomKey, string>>({
    hall: "",
    kitchen: "",
    bedroom: "",
    parking: "",
  });
  const [showRoomUrlInput, setShowRoomUrlInput] = useState<Record<RoomKey, boolean>>({
    hall: false,
    kitchen: false,
    bedroom: false,
    parking: false,
  });

  // Products filtering & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // AI 3D Reconstruction inputs
  const [aiImageFile, setAiImageFile] = useState<File | null>(null);
  const [aiImagePreview, setAiImagePreview] = useState<string | null>(null);
  const [modelProvider, setModelProvider] = useState("Meshy AI");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [generatedGlb, setGeneratedGlb] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setAuthSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login(data.access_token);
      } else {
        const err = await res.json();
        setLoginError(err.detail || "Authentication failed. Verify credentials.");
      }
    } catch (err) {
      console.warn("Backend auth failed. Simulating local login bypass...", err);
      if (email === "admin@aureliamarmi.com" && password === "aurelia2026!") {
        login("mock-jwt-token-aurelia-luxury");
      } else {
        setLoginError("Invalid credentials. Use admin@aureliamarmi.com / aurelia2026!");
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchQuotes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/quotes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setQuotes(data);
        }
      } catch (err) {
        console.error("Error loading quotes:", err);
      } finally {
        setQuotesLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setProducts(mergeWithAdminProducts(data));
        } else {
          setProducts(mergeWithAdminProducts([]));
        }
      } catch {
        setProducts(mergeWithAdminProducts([]));
      } finally {
        setProductsLoading(false);
      }
    };

    fetchQuotes();
    fetchProducts();
  }, [token]);

  // Derived state for products
  const uniqueCategories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  }, [products]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category?.trim() || "Uncategorized";
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const entries = Object.entries(counts).map(([name, count], index) => {
      const color = CATEGORY_PALETTE[index % CATEGORY_PALETTE.length];
      const icon = CATEGORY_ICONS[name] || "📦";
      const percentage = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
      return {
        name,
        count,
        percentage,
        icon,
        color,
      };
    });

    return entries.sort((a, b) => b.count - a.count);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.origin && p.origin.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleRoomImageUpload = async (roomKey: RoomKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setRoomImages((prev) => ({ ...prev, [roomKey]: dataUrl }));
    e.target.value = "";
  };

  const handleRoomUrlAdd = (roomKey: RoomKey) => {
    const val = roomUrlInputs[roomKey]?.trim();
    if (val) {
      setRoomImages((prev) => ({ ...prev, [roomKey]: val }));
      setRoomUrlInputs((prev) => ({ ...prev, [roomKey]: "" }));
      setShowRoomUrlInput((prev) => ({ ...prev, [roomKey]: false }));
    }
  };

  const handleRemoveRoomImage = (roomKey: RoomKey, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setRoomImages((prev) => ({ ...prev, [roomKey]: "" }));
    if (zoomImage?.roomKey === roomKey) {
      setZoomImage(null);
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    const previews = await Promise.all(files.slice(0, 4).map((file) => readFileAsDataUrl(file)));
    const keys: RoomKey[] = ["hall", "kitchen", "bedroom", "parking"];
    setRoomImages((prev) => {
      const updated = { ...prev };
      previews.forEach((p, idx) => {
        if (keys[idx]) {
          updated[keys[idx]] = p;
        }
      });
      return updated;
    });
    e.target.value = "";
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = Number(productForm.price);
    const validImages = [roomImages.hall, roomImages.kitchen, roomImages.bedroom, roomImages.parking];
    const mainImageUrl = roomImages.hall || validImages.find(Boolean) || "/static/real/marble-white-carrara.jpg";

    const nextProduct: Product = {
      id: editingProductId ?? Date.now(),
      name: productForm.name.trim(),
      category: productForm.category.trim(),
      origin: productForm.origin.trim(),
      finish: productForm.finish.trim(),
      thickness: productForm.thickness.trim(),
      applications: productForm.applications.trim(),
      description: productForm.description.trim(),
      price: productForm.price.trim() && Number.isFinite(parsedPrice) ? parsedPrice : null,
      availability: productForm.availability,
      image_url: mainImageUrl,
      images: [
        roomImages.hall || mainImageUrl,
        roomImages.kitchen || mainImageUrl,
        roomImages.bedroom || mainImageUrl,
        roomImages.parking || mainImageUrl,
      ],
      roughness: 0.2,
      metalness: 0.05,
    };

    const storedProducts = getStoredAdminProducts();
    const nextStoredProducts = [
      nextProduct,
      ...storedProducts.filter((product) => (
        product.id !== nextProduct.id && product.name.toLowerCase() !== nextProduct.name.toLowerCase()
      )),
    ];

    saveStoredAdminProducts(nextStoredProducts);
    saveDeletedAdminProductIds(getDeletedAdminProductIds().filter((productId) => productId !== nextProduct.id));
    setProducts((prev) => [
      nextProduct,
      ...prev.filter((product) => (
        product.id !== nextProduct.id && product.name?.toLowerCase() !== nextProduct.name.toLowerCase()
      )),
    ]);

    // If online with backend API token, sync to server
    if (token && !token.startsWith("mock-")) {
      const endpoint = editingProductId ? `${API_URL}/api/products/${editingProductId}` : `${API_URL}/api/products`;
      const method = editingProductId ? "PUT" : "POST";
      fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nextProduct.name,
          category: nextProduct.category,
          origin: nextProduct.origin,
          finish: nextProduct.finish,
          thickness: nextProduct.thickness,
          applications: nextProduct.applications,
          description: nextProduct.description,
          price: nextProduct.price,
          availability: nextProduct.availability,
          image_url: nextProduct.image_url,
          images: nextProduct.images
        })
      }).catch((e) => console.warn("Backend sync skipped:", e));
    }

    setProductForm(emptyProductForm);
    setRoomImages(initialRoomImages);
    setEditingProductId(null);
    setShowProductForm(false);
    setProductSaveStatus(editingProductId ? "Product and room application images updated." : "Product and room application images saved to catalog.");
  };

  const handleEditProduct = (product: AdminProduct) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      category: product.category || "Marble",
      origin: product.origin || "India",
      finish: product.finish || "Polished",
      thickness: product.thickness || "2cm",
      applications: product.applications || "",
      description: product.description || "",
      price: product.price ? String(product.price) : "",
      availability: product.availability || "In Stock",
    });
    const imgs = product.images?.length ? product.images : product.image_url ? [product.image_url] : [];
    setRoomImages({
      hall: imgs[0] || product.image_url || "",
      kitchen: imgs[1] || "",
      bedroom: imgs[2] || "",
      parking: imgs[3] || "",
    });
    setShowProductForm(true);
    setProductSaveStatus("");
  };

  const handleDeleteProduct = (productId: number) => {
    const storedProducts = getStoredAdminProducts().filter((product) => product.id !== productId);
    saveStoredAdminProducts(storedProducts);
    saveDeletedAdminProductIds([...getDeletedAdminProductIds(), productId]);
    setProducts((prev) => prev.filter((product) => product.id !== productId));

    if (token && !token.startsWith("mock-")) {
      fetch(`${API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      }).catch((e) => console.warn("Backend delete skipped:", e));
    }

    if (editingProductId === productId) {
      setEditingProductId(null);
      setProductForm(emptyProductForm);
      setRoomImages(initialRoomImages);
      setShowProductForm(false);
    }
    setProductSaveStatus("Product removed from this admin list.");
  };

  const handleUpdateQuoteStatus = async (quoteId: number, statusStr: string) => {
    try {
      const form = new FormData();
      form.append("status_update", statusStr);
      const res = await fetch(`${API_URL}/api/quotes/${quoteId}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.ok) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === quoteId ? { ...q, status: statusStr } : q))
        );
      }
    } catch (err) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: statusStr } : q))
      );
    }
  };

  const handleAiReconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiImageFile) return;
    setAiProcessing(true);
    setGeneratedGlb(null);

    try {
      const payload = new FormData();
      payload.append("stone_image", aiImageFile);
      payload.append("model_provider", modelProvider);

      const res = await fetch(`${API_URL}/api/ai-generate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedGlb(data.glb_model_url.startsWith("/static") ? `${API_URL}${data.glb_model_url}` : data.glb_model_url);
      }
    } catch (err) {
      setTimeout(() => {
        setGeneratedGlb("/static/seed/textures/carrara_gold_diff.jpg");
        setAiProcessing(false);
      }, 2500);
    } finally {
      if (!generatedGlb) {
        setTimeout(() => setAiProcessing(false), 2600);
      }
    }
  };

  const handleAiImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAiImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAiImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAiImagePreview(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-50">
        <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Material Admin</h2>
            <p className="text-blue-100 text-sm mt-1">Sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aureliamarmi.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-slate-700"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-medium text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={authSubmitting}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-70 shadow-md"
            >
              {authSubmitting ? "Authenticating..." : "Sign In"}
            </button>
            
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">admin@aureliamarmi.com / aurelia2026!</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Define sidebar navigation items
  const navItems = [
    { id: "analytics", label: "Dashboard", icon: BarChart2 },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "quotes", label: "Quote Requests", icon: ListTodo },
    { id: "ai3d", label: "AI Reconstruct", icon: Sparkles },
  ] as const;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Sidebar - Dark Material Design */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20 flex-shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">Admin Pro</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Pages</div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20 font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4">
          <div className="bg-slate-800 rounded-xl p-4 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-blue-500 rounded-full opacity-10 blur-xl"></div>
            <ShieldCheck className="w-6 h-6 text-blue-400 mb-2" />
            <h4 className="text-sm font-semibold text-white">Pro Status</h4>
            <p className="text-xs text-slate-400 mt-1">All systems online</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white/60 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center text-sm text-slate-500">
            <span className="opacity-70">Pages</span>
            <span className="mx-2">/</span>
            <span className="font-semibold text-slate-900 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Type here..." 
                className="pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-blue-100 rounded-lg text-sm transition-all outline-none text-slate-700 w-48"
              />
            </div>
            
            <button className="text-slate-500 hover:text-slate-800 transition-colors">
              <UserCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={logout}
              className="text-slate-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          
          {/* TAB 1: CATEGORY-WISE ANALYTICS & DASHBOARD */}
          {activeTab === "analytics" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Category-Wise Product Widgets */}
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Category-Wise Product Overview</h3>
                    <p className="text-xs text-slate-500">Live total number of products across each material category</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
                      Total: {products.length} Products
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold">
                      {categoryStats.length} Categories
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {/* Master Total Card */}
                  <div 
                    onClick={() => {
                      setSelectedCategory("All");
                      setActiveTab("products");
                    }}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200/80 p-5 relative flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="absolute -top-3.5 left-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl w-11 h-11 flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:scale-105 transition-transform">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="text-right pt-1 pb-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</p>
                      <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{products.length}</h4>
                    </div>
                    <div className="border-t border-slate-100 mt-3 pt-2.5 flex items-center justify-between text-xs text-slate-500">
                      <span>Across {categoryStats.length} categories</span>
                      <span className="font-semibold text-blue-600 group-hover:underline">View All &rarr;</span>
                    </div>
                  </div>

                  {/* Individual Dynamic Category Cards */}
                  {categoryStats.map((cat) => (
                    <div 
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setActiveTab("products");
                      }}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200/80 p-5 relative flex flex-col justify-between cursor-pointer group"
                    >
                      <div className={`absolute -top-3.5 left-4 bg-gradient-to-r ${cat.color.bg} text-white rounded-xl w-11 h-11 flex items-center justify-center shadow-lg ${cat.color.shadow} group-hover:scale-105 transition-transform text-lg`}>
                        {cat.icon}
                      </div>
                      <div className="text-right pt-1 pb-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 truncate max-w-[150px] ml-auto" title={cat.name}>
                          {cat.name}
                        </p>
                        <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{cat.count}</h4>
                      </div>
                      <div className="border-t border-slate-100 mt-3 pt-2.5 flex items-center justify-between text-xs">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${cat.color.badgeBg} ${cat.color.badgeText}`}>
                          {cat.percentage}% of catalog
                        </span>
                        <span className="font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                          Filter &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Category-Wise Graphs Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                
                {/* Main Category Bar Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative pt-12 pb-4 px-5">
                  <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 p-4 text-white z-10 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-base">Total Products by Category</h4>
                      <p className="text-xs text-blue-100 flex items-center mt-0.5">
                        <BarChart2 className="w-3.5 h-3.5 mr-1" /> Category-wise inventory comparison
                      </p>
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md font-semibold">
                      {products.length} Total Slabs / Tiles
                    </span>
                  </div>

                  <div className="h-80 mt-6">
                    {categoryStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryStats} margin={{ top: 20, right: 20, left: -10, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                            interval={0}
                            angle={-25}
                            textAnchor="end"
                            height={50}
                          />
                          <YAxis 
                            stroke="#64748b" 
                            fontSize={11} 
                            tickLine={false} 
                            axisLine={false}
                            allowDecimals={false}
                          />
                          <Tooltip 
                            cursor={{ fill: "#f8fafc" }} 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10 text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 font-bold text-sm">
                                      <span>{data.icon}</span>
                                      <span>{data.name}</span>
                                    </div>
                                    <p className="text-slate-300">
                                      Total Products: <span className="font-bold text-emerald-400">{data.count}</span>
                                    </p>
                                    <p className="text-slate-400 text-[11px]">
                                      Share: <span className="font-semibold text-blue-300">{data.percentage}%</span> of catalog
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
                            {categoryStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No product category data available
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Inventory Share & Ranking Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative pt-12 pb-4 px-5">
                  <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg shadow-slate-800/20 p-4 text-white z-10">
                    <h4 className="font-semibold text-base">Category Share</h4>
                    <p className="text-xs text-slate-300 flex items-center mt-0.5">
                      <Tags className="w-3.5 h-3.5 mr-1" /> Inventory distribution breakdown
                    </p>
                  </div>

                  <div className="mt-6 space-y-3.5 max-h-80 overflow-y-auto pr-1">
                    {categoryStats.map((cat, idx) => (
                      <div 
                        key={cat.name} 
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setActiveTab("products");
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 cursor-pointer group"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 text-[11px] flex items-center justify-center font-bold text-slate-500">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{cat.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{cat.count} items</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${cat.color.badgeBg} ${cat.color.badgeText}`}>
                              {cat.percentage}%
                            </span>
                          </div>
                        </div>
                        {/* Visual Share Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${cat.color.bg}`}
                            style={{ width: `${Math.max(cat.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {categoryStats.length === 0 && (
                      <p className="text-center text-slate-400 text-xs py-8">No categories found.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 p-5 text-white flex justify-between items-center z-10">
                  <div>
                    <h4 className="font-semibold text-lg">Products Overview</h4>
                    <p className="text-xs text-blue-100 mt-1">Manage slab catalog and pricing</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm(emptyProductForm);
                      setRoomImages(initialRoomImages);
                      setShowProductForm((value) => !value);
                      setProductSaveStatus("");
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
                
                <div className="p-6 pt-20">
                  {productSaveStatus && (
                    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      {productSaveStatus}
                    </div>
                  )}

                  {showProductForm && (
                    <form onSubmit={handleProductSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                      <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</label>
                              <input
                                required
                                value={productForm.name}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="Gray Marble Staircase"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                              <select
                                value={productForm.category}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                              >
                                {["Marble", "Imported Marble", "Granite", "Quartz", "Full Body Tiles", "Wall Tiles", "PVT", "Kota Stone"].map((category) => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Origin</label>
                              <input
                                value={productForm.origin}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, origin: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="India"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Finish</label>
                              <input
                                value={productForm.finish}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, finish: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="Polished"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thickness / Size</label>
                              <input
                                value={productForm.thickness}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, thickness: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="2cm"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</label>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={productForm.price}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="210"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availability</label>
                              <select
                                value={productForm.availability}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, availability: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                              >
                                <option value="In Stock">In Stock</option>
                                <option value="Limited">Limited</option>
                                <option value="Out of Stock">Out of Stock</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Applications</label>
                              <input
                                value={productForm.applications}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, applications: e.target.value }))}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                placeholder="Hall, Kitchen, Bedroom, Parking"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                              <textarea
                                required
                                value={productForm.description}
                                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
                                placeholder="Short product description for the detail page"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button
                              type="submit"
                              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                            >
                              {editingProductId ? "Update Product" : "Save Product"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowProductForm(false);
                                setEditingProductId(null);
                                setProductForm(emptyProductForm);
                                setRoomImages(initialRoomImages);
                              }}
                              className="px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-sm font-semibold text-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        {/* Dedicated 4-Room Grid (Hall, Kitchen, Bedroom, Parking) */}
                        <div className="space-y-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                            <div>
                              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Room Application Views</label>
                              <p className="text-[11px] text-slate-500">Hall, Kitchen, Bedroom & Parking visualizers</p>
                            </div>
                            <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-blue-200 shadow-xs">
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload All 4 Rooms</span>
                              <input type="file" accept="image/*" multiple onChange={handleBatchUpload} className="hidden" />
                            </label>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {ROOM_CONFIG.map(({ key, label, subtitle, icon }) => {
                              const src = roomImages[key];
                              const isUrlOpen = showRoomUrlInput[key];
                              const urlVal = roomUrlInputs[key];

                              return (
                                <div key={key} className="bg-slate-50/70 rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col space-y-2 relative group/card">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm">{icon}</span>
                                      <div>
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{label}</span>
                                        <p className="text-[10px] text-slate-400 leading-none">{subtitle}</p>
                                      </div>
                                    </div>
                                    {src && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleRemoveRoomImage(key, e)}
                                        title={`Remove ${label} image`}
                                        className="p-1 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-colors border border-red-200 hover:border-red-500 shadow-xs"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>

                                  {src ? (
                                    <div
                                      onClick={() => setZoomImage({ src, label, roomKey: key })}
                                      className="group relative aspect-video bg-slate-900 rounded-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-500 transition-all shadow-inner"
                                    >
                                      <img src={src} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                        <div className="bg-white/95 text-slate-900 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-md flex items-center gap-1">
                                          <ZoomIn className="w-3 h-3" />
                                          <span>View Bigger</span>
                                        </div>
                                      </div>
                                      <label 
                                        onClick={(e) => e.stopPropagation()} 
                                        className="absolute bottom-1.5 right-1.5 bg-slate-900/85 hover:bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md cursor-pointer transition-colors shadow border border-white/10"
                                      >
                                        Change
                                        <input type="file" accept="image/*" onChange={(e) => handleRoomImageUpload(key, e)} className="hidden" />
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5">
                                      <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer text-slate-400 hover:text-blue-600 transition-all p-2 text-center group">
                                        <UploadCloud className="w-5 h-5 mb-0.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        <span className="text-[11px] font-semibold text-slate-600 group-hover:text-blue-600">+ Add {label}</span>
                                        <input type="file" accept="image/*" onChange={(e) => handleRoomImageUpload(key, e)} className="hidden" />
                                      </label>

                                      {isUrlOpen ? (
                                        <div className="flex gap-1 pt-0.5">
                                          <input
                                            type="text"
                                            placeholder="Image URL..."
                                            value={urlVal}
                                            onChange={(e) => setRoomUrlInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleRoomUrlAdd(key); } }}
                                            className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-md text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleRoomUrlAdd(key)}
                                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-md shadow-xs transition-colors"
                                          >
                                            Add
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setShowRoomUrlInput(prev => ({ ...prev, [key]: false }))}
                                            className="px-1.5 py-1 text-slate-400 hover:text-slate-600 text-[11px]"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => setShowRoomUrlInput(prev => ({ ...prev, [key]: true }))}
                                          className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full py-0.5 font-medium hover:underline"
                                        >
                                          <LinkIcon className="w-2.5 h-2.5" />
                                          <span>or add by URL</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Filters and Search */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm transition-all outline-none text-slate-700"
                      />
                    </div>
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      <Filter className="w-4 h-4 text-slate-400" />
                      <select 
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full sm:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      >
                        {uniqueCategories.map(cat => (
                          <option key={cat as string} value={cat as string}>{cat as string}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    {productsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((n) => (
                          <div key={n} className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                        ))}
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
                          <tr>
                            <th className="pb-3 px-4 w-16">Image</th>
                            <th className="pb-3 px-4">Name</th>
                            <th className="pb-3 px-4">Category</th>
                            <th className="pb-3 px-4">Origin</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {paginatedProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-4">
                                {product.image_url ? (
                                  <img src={getAdminImageSrc(product.image_url)} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                    <ImageIcon className="w-4 h-4" />
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-4 font-semibold text-slate-800">{product.name}</td>
                              <td className="py-4 px-4">{product.category || "Uncategorized"}</td>
                              <td className="py-4 px-4">{product.origin || "-"}</td>
                              <td className="py-4 px-4">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                  product.availability === "In Stock" ? "bg-emerald-100 text-emerald-700" :
                                  product.availability === "Limited" ? "bg-amber-100 text-amber-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  {product.availability || "Unknown"}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditProduct(product)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                    title="Edit product"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                    title="Delete product"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {paginatedProducts.length === 0 && (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-500">No products match your filters.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                  
                  {/* Pagination Controls */}
                  {!productsLoading && filteredProducts.length > 0 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of <span className="font-semibold text-slate-700">{filteredProducts.length}</span> entries
                      </p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="flex items-center px-3 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg border border-slate-200">
                          {currentPage} / {totalPages}
                        </span>
                        <button 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20 p-5 text-white flex justify-between items-center z-10">
                  <div>
                    <h4 className="font-semibold text-lg">Categories Management</h4>
                    <p className="text-xs text-purple-100 mt-1">View and manage product categories</p>
                  </div>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>
                
                <div className="p-6 pt-24 overflow-x-auto">
                  {productsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-12 bg-slate-100 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm text-slate-600">
                      <thead className="text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="pb-3 px-4">Category Name</th>
                          <th className="pb-3 px-4 text-right">Total Products</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map((categoryName) => {
                          const count = products.filter(p => p.category === categoryName).length;
                          return (
                            <tr key={categoryName as string} className="hover:bg-slate-50 transition-colors">
                              <td className="py-4 px-4 font-semibold text-slate-800 flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                  <Tags className="w-4 h-4" />
                                </div>
                                <span>{categoryName}</span>
                              </td>
                              <td className="py-4 px-4 text-right font-medium text-slate-600">{count}</td>
                            </tr>
                          );
                        })}
                        {Array.from(new Set(products.map(p => p.category).filter(Boolean))).length === 0 && (
                          <tr>
                            <td colSpan={2} className="py-8 text-center text-slate-500">No categories found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUOTES */}
          {activeTab === "quotes" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg shadow-slate-800/20 p-5 text-white z-10">
                  <h4 className="font-semibold text-lg">Client Quote Requests</h4>
                  <p className="text-xs text-slate-300 mt-1">Review and process incoming design inquiries</p>
                </div>
                
                <div className="p-6 pt-24 space-y-4">
                  {quotesLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((n) => (
                        <div key={n} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : quotes.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl">
                      No quotes requests currently logged in the system.
                    </div>
                  ) : (
                    quotes.map((q) => (
                      <div key={q.id} className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-slate-50/50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-slate-800 text-base">{q.client_name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{q.client_email} • {q.client_phone || "No Phone"}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            q.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {q.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 bg-white p-4 rounded-lg border border-slate-100">
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Stone Requested</span>
                            <span className="font-medium text-slate-800">{q.stone_name}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Finish</span>
                            <span>{q.finish || "Polished"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Dimensions</span>
                            <span>{q.dimensions || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">Budget</span>
                            <span className="text-emerald-600 font-medium">{q.budget || "N/A"}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-3">
                          {q.status === "Pending" && (
                            <button
                              onClick={() => handleUpdateQuoteStatus(q.id, "Reviewed")}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                            >
                              Mark as Reviewed
                            </button>
                          )}
                          {q.drawing_url && (
                            <a
                              href={`${API_URL}${q.drawing_url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                            >
                              View Blueprint
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI 3D */}
          {activeTab === "ai3d" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 p-5 text-white z-10">
                  <h4 className="font-semibold text-lg">AI Mesh Pipeline</h4>
                  <p className="text-xs text-emerald-100 mt-1">Convert 2D stone images to 3D GLB models</p>
                </div>
                
                <div className="p-6 pt-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <form onSubmit={handleAiReconstruct} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Source Image</label>
                      <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-500/50 bg-slate-50 rounded-xl p-8 text-center cursor-pointer transition-colors group">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleAiImageChange}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {aiImagePreview ? (
                          <img src={aiImagePreview} className="max-h-40 mx-auto object-contain rounded shadow-sm" />
                        ) : (
                          <div className="space-y-2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <Plus className="w-8 h-8 mx-auto" />
                            <p className="text-sm font-medium">Click to upload flat stone photo</p>
                            <p className="text-xs opacity-70">PNG, JPG up to 15MB</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Model Engine</label>
                      <select
                        value={modelProvider}
                        onChange={(e) => setModelProvider(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-slate-700 shadow-sm"
                      >
                        <option value="Meshy AI">Meshy AI (Slab Reconstruction)</option>
                        <option value="Tripo AI">Tripo AI (Textured Meshes)</option>
                        <option value="Luma AI">Luma Genie (Rapid GLB)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={aiProcessing || !aiImageFile}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md flex justify-center items-center space-x-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{aiProcessing ? "Processing neural mesh..." : "Generate 3D Model"}</span>
                    </button>
                  </form>

                  <div className="bg-slate-900 rounded-2xl shadow-inner border border-slate-800 flex items-center justify-center min-h-[300px] relative overflow-hidden">
                    {aiProcessing && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 text-white">
                        <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
                        <p className="text-sm font-semibold tracking-wider">COMPILING MESH</p>
                        <p className="text-xs text-slate-400 mt-1">Generating UV maps...</p>
                      </div>
                    )}
                    
                    {generatedGlb ? (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <p className="text-white font-medium">Model Compiled Successfully</p>
                        <p className="text-slate-400 text-xs mt-1">GLB asset is ready for showroom use.</p>
                      </div>
                    ) : (
                      <div className="text-center text-slate-600">
                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">3D Viewer Sandbox</p>
                        <p className="text-xs mt-1">Awaiting generation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer inside the content area */}
          <footer className="mt-auto pt-8 pb-4 text-center text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Material Admin • Made with Shadcn UI & Tailwind CSS
          </footer>

        </main>
      </div>

      {/* Image Zoom / Lightbox Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setZoomImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider rounded-md">
                  {zoomImage.label || "Room View"}
                </span>
                <span className="text-sm font-medium text-slate-300 truncate max-w-md">
                  {productForm.name || "Product Image Preview"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {zoomImage.roomKey && (
                  <button
                    type="button"
                    onClick={() => {
                      if (zoomImage.roomKey) {
                        handleRemoveRoomImage(zoomImage.roomKey);
                      }
                      setZoomImage(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove {zoomImage.label || "Image"}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setZoomImage(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Image */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-black/40">
              <img
                src={zoomImage.src}
                alt={zoomImage.label || "Zoomed preview"}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-lg border border-white/5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

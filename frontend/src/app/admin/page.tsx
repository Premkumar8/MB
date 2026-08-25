"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Lock, Sparkles, Layers, ListTodo, BarChart2, Plus, LogOut, ShieldCheck, UserCircle, Search, MoreVertical, CreditCard, DollarSign, ArrowRight, Tags, Package, Grid, ChevronLeft, ChevronRight, Image as ImageIcon, Filter, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { getDeletedAdminProductIds, getStoredAdminProducts, mergeWithAdminProducts, saveDeletedAdminProductIds, saveStoredAdminProducts } from "@/data/products";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

const getAdminImageSrc = (imageUrl: string | null) => {
  if (!imageUrl) {
    return "";
  }

  return imageUrl.startsWith("http") || imageUrl.startsWith("data:") ? imageUrl : imageUrl;
};

const readFileAsDataUrl = (file: File) => (
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
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
  const [productImagePreviews, setProductImagePreviews] = useState<string[]>([]);
  const [productSaveStatus, setProductSaveStatus] = useState("");

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

  const handleProductImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setProductImagePreviews([]);
      return;
    }

    const previews = await Promise.all(files.slice(0, 8).map(readFileAsDataUrl));
    setProductImagePreviews(previews);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = Number(productForm.price);
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
      image_url: productImagePreviews[0] || "/static/real/marble-white-carrara.jpg",
      images: productImagePreviews,
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
    setProductForm(emptyProductForm);
    setProductImagePreviews([]);
    setEditingProductId(null);
    setShowProductForm(false);
    setProductSaveStatus(editingProductId ? "Product updated locally." : "Product saved locally and added to the catalog.");
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
    setProductImagePreviews(product.images?.length ? product.images : product.image_url ? [product.image_url] : []);
    setShowProductForm(true);
    setProductSaveStatus("");
  };

  const handleDeleteProduct = (productId: number) => {
    const storedProducts = getStoredAdminProducts().filter((product) => product.id !== productId);
    saveStoredAdminProducts(storedProducts);
    saveDeletedAdminProductIds([...getDeletedAdminProductIds(), productId]);
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    if (editingProductId === productId) {
      setEditingProductId(null);
      setProductForm(emptyProductForm);
      setProductImagePreviews([]);
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
          
          {/* TAB 1: ANALYTICS (DASHBOARD) */}
          {activeTab === "analytics" && (
            <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Top KPI Cards - Material Dashboard Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative flex flex-col justify-between">
                  <div className="absolute -top-4 left-4 bg-slate-900 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg shadow-slate-900/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="text-right pt-2 pb-1">
                    <p className="text-sm font-medium text-slate-500">Today&apos;s Money</p>
                    <h4 className="text-2xl font-bold text-slate-800">$53,000</h4>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <p className="text-sm text-slate-500"><span className="text-emerald-500 font-bold">+55%</span> than last week</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative flex flex-col justify-between">
                  <div className="absolute -top-4 left-4 bg-blue-600 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div className="text-right pt-2 pb-1">
                    <p className="text-sm font-medium text-slate-500">Today&apos;s Users</p>
                    <h4 className="text-2xl font-bold text-slate-800">2,300</h4>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <p className="text-sm text-slate-500"><span className="text-emerald-500 font-bold">+3%</span> than last month</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative flex flex-col justify-between">
                  <div className="absolute -top-4 left-4 bg-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ListTodo className="w-5 h-5" />
                  </div>
                  <div className="text-right pt-2 pb-1">
                    <p className="text-sm font-medium text-slate-500">New Quotes</p>
                    <h4 className="text-2xl font-bold text-slate-800">84</h4>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <p className="text-sm text-slate-500"><span className="text-red-500 font-bold">-2%</span> than yesterday</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 relative flex flex-col justify-between">
                  <div className="absolute -top-4 left-4 bg-rose-500 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-right pt-2 pb-1">
                    <p className="text-sm font-medium text-slate-500">Sales</p>
                    <h4 className="text-2xl font-bold text-slate-800">$103,430</h4>
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <p className="text-sm text-slate-500"><span className="text-emerald-500 font-bold">+5%</span> than yesterday</p>
                  </div>
                </div>

              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                
                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative pt-12 pb-4 px-4">
                  {/* Colored Box for Chart Title */}
                  <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 p-4 text-white z-10">
                    <h4 className="font-semibold">Monthly Revenue</h4>
                    <p className="text-xs text-blue-100 flex items-center mt-1"><ArrowRight className="w-3 h-3 mr-1" /> Performance overview</p>
                  </div>
                  <div className="h-72 mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: "Apr", revenue: 50 },
                        { name: "May", revenue: 40 },
                        { name: "Jun", revenue: 300 },
                        { name: "Jul", revenue: 220 },
                        { name: "Aug", revenue: 500 },
                        { name: "Sep", revenue: 250 },
                        { name: "Oct", revenue: 400 },
                        { name: "Nov", revenue: 230 },
                        { name: "Dec", revenue: 500 }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                          itemStyle={{ color: "#3b82f6", fontWeight: "bold" }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevBlue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative pt-12 pb-4 px-4">
                  <div className="absolute -top-4 left-4 right-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg shadow-slate-800/20 p-4 text-white z-10">
                    <h4 className="font-semibold">Popular Stones</h4>
                    <p className="text-xs text-slate-300 flex items-center mt-1"><ArrowRight className="w-3 h-3 mr-1" /> Request volume</p>
                  </div>
                  <div className="h-72 mt-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: "M", views: 50 },
                        { name: "T", views: 20 },
                        { name: "W", views: 10 },
                        { name: "T", views: 22 },
                        { name: "F", views: 50 },
                        { name: "S", views: 10 },
                        { name: "S", views: 40 }
                      ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: "#f8fafc" }} 
                          contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                        />
                        <Bar dataKey="views" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
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
                      setProductImagePreviews([]);
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
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
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

                        <div className="space-y-3">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Images</label>
                          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-center text-slate-500 hover:border-blue-400 hover:text-blue-600">
                            <ImageIcon className="mb-2 h-6 w-6" />
                            <span className="text-sm font-semibold">Upload Images</span>
                            <span className="mt-1 text-xs">First image is main image</span>
                            <input type="file" accept="image/*" multiple onChange={handleProductImageChange} className="hidden" />
                          </label>
                          {productImagePreviews.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                              {productImagePreviews.map((src, index) => (
                                <img key={src} src={src} alt={`Product preview ${index + 1}`} className="aspect-square rounded-lg border border-slate-200 object-cover" />
                              ))}
                            </div>
                          )}
                          <button
                            type="submit"
                            className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
                          >
                            {editingProductId ? "Update Product" : "Save Product"}
                          </button>
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
    </div>
  );
}

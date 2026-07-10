"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Search, Heart, RefreshCw, Layers, MapPin, Check, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { useApp, Product } from "@/context/AppContext";

// Load 3D slab viewer dynamically - Removed as requested to keep 3D Showroom as the only 3D section.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CollectionsPage() {
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    compareList,
    addToCompare,
    removeFromCompare,
    isInCompareList,
    addToSampleCart,
    isInSampleCart,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedOrigin, setSelectedOrigin] = useState("All");
  const [selectedFinish, setSelectedFinish] = useState("All");
  const [selectedThickness, setSelectedThickness] = useState("All");

  // Active 3D preview item
  const [active3dProduct, setActive3dProduct] = useState<Product | null>(null);
  // Show Comparison Modal
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Resilient Static Fallback Products (in case backend isn't started yet)
  const fallbackProducts: Product[] = [
    {
      id: 1,
      name: "Carrara Gold",
      category: "Marble",
      origin: "Italy",
      finish: "Polished",
      thickness: "2cm",
      applications: "Countertops, Wall Cladding, Bathrooms",
      description: "Quarried from the Apuan Alps in Carrara, Italy, this legendary marble features a striking white background with prominent gold and gray veins, offering a warm and timeless elegance.",
      price: 185.00,
      availability: "In Stock",
      image_url: "/static/seed/carrara_gold.jpg",
      glb_url: "/static/seed/carrara_gold.glb",
      texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
      roughness: 0.15,
      metalness: 0.05,
    },
    {
      id: 2,
      name: "Nero Marquina",
      category: "Marble",
      origin: "Spain",
      finish: "Polished",
      thickness: "2cm",
      applications: "Flooring, Accent Walls, Fireplaces",
      description: "A high-quality black stone marble extracted from the region of Markina, Northern Spain. The deep black color contrasts sharply with white calcite veins, embodying true architectural drama.",
      price: 140.00,
      availability: "In Stock",
      image_url: "/static/seed/nero_marquina.jpg",
      glb_url: "/static/seed/nero_marquina.glb",
      texture_url: "/static/seed/textures/nero_marquina_diff.jpg",
      roughness: 0.12,
      metalness: 0.1,
    },
    {
      id: 3,
      name: "Emerald Onyx",
      category: "Onyx",
      origin: "Iran",
      finish: "Polished",
      thickness: "2cm",
      applications: "Backlit Walls, Countertops, Decorative Panels",
      description: "A highly translucent green stone with mesmerizing bands of mint, emerald, and golden bronze. When backlit, it emits a warm, ethereal luminescence perfect for high-end boutique designs.",
      price: 320.00,
      availability: "Limited",
      image_url: "/static/seed/emerald_onyx.jpg",
      glb_url: "/static/seed/emerald_onyx.glb",
      texture_url: "/static/seed/textures/emerald_onyx_diff.jpg",
      roughness: 0.08,
      metalness: 0.15,
    },
    {
      id: 4,
      name: "Calacatta Viola",
      category: "Marble",
      origin: "Italy",
      finish: "Honed",
      thickness: "3cm",
      applications: "Kitchen Islands, Credenzas, Vanity Tops",
      description: "One of the oldest quarried marbles, Calacatta Viola features bold, rich purple-burgundy veins flowing through a creamy white canvas. Highly sought after by modern luxury designers.",
      price: 245.00,
      availability: "In Stock",
      image_url: "/static/seed/calacatta_viola.jpg",
      glb_url: "/static/seed/calacatta_viola.glb",
      texture_url: "/static/seed/textures/calacatta_viola_diff.jpg",
      roughness: 0.3,
      metalness: 0.05,
    },
    {
      id: 5,
      name: "Taj Mahal",
      category: "Quartzite",
      origin: "Brazil",
      finish: "Leathered",
      thickness: "3cm",
      applications: "Kitchen Countertops, Outdoor Kitchens, Floors",
      description: "Offering the look of marble with the structural strength of granite, Taj Mahal Quartzite is quarried in Brazil and exhibits soft white background tones with delicate gold-brown veining.",
      price: 210.00,
      availability: "In Stock",
      image_url: "/static/seed/taj_mahal.jpg",
      glb_url: "/static/seed/taj_mahal.glb",
      texture_url: "/static/seed/textures/taj_mahal_diff.jpg",
      roughness: 0.45,
      metalness: 0.02,
    },
  ];

  useEffect(() => {
    const fetchStones = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          // Map local paths to absolute backend URL if needed
          const processed = data.map((item: any) => ({
            ...item,
            image_url: item.image_url.startsWith("/static") ? `${API_URL}${item.image_url}` : item.image_url,
            texture_url: item.texture_url && item.texture_url.startsWith("/static") ? `${API_URL}${item.texture_url}` : item.texture_url,
          }));
          setProducts(processed.length > 0 ? processed : fallbackProducts);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Backend fetch error, loading fallback catalog:", err);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchStones();
  }, []);

  // Filter computation
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesOrigin = selectedOrigin === "All" || p.origin.toLowerCase() === selectedOrigin.toLowerCase();
    const matchesFinish = selectedFinish === "All" || p.finish.toLowerCase() === selectedFinish.toLowerCase();
    const matchesThickness = selectedThickness === "All" || p.thickness.toLowerCase() === selectedThickness.toLowerCase();

    return matchesSearch && matchesCategory && matchesOrigin && matchesFinish && matchesThickness;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-bold">
          Digital Slab Yard
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide">
          Exotic Natural Stone <span className="font-bold text-gold-gradient">Collections</span>
        </h1>
        <p className="text-xs text-black/50 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
          Filter, compare, and request samples of our custom lots. Open our interactive WebGL canvases to inspect PBR material reflections under custom point lights.
        </p>
      </div>

      {/* Advanced Filter Deck */}
      <div className="glass-premium p-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-black/40 dark:text-white/30" />
          <input
            type="text"
            placeholder="Search stone name or origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-black/10 dark:border-white/10 pl-9 pr-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white"
          />
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-transparent border border-black/10 dark:border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white"
        >
          <option value="All">Category: All</option>
          <option value="Marble">Marble</option>
          <option value="Onyx">Onyx</option>
          <option value="Quartzite">Quartzite</option>
        </select>

        {/* Origin Filter */}
        <select
          value={selectedOrigin}
          onChange={(e) => setSelectedOrigin(e.target.value)}
          className="bg-transparent border border-black/10 dark:border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white"
        >
          <option value="All">Origin: All</option>
          <option value="Italy">Italy</option>
          <option value="Spain">Spain</option>
          <option value="Brazil">Brazil</option>
          <option value="Iran">Iran</option>
        </select>

        {/* Finish Filter */}
        <select
          value={selectedFinish}
          onChange={(e) => setSelectedFinish(e.target.value)}
          className="bg-transparent border border-black/10 dark:border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white"
        >
          <option value="All">Finish: All</option>
          <option value="Polished">Polished</option>
          <option value="Honed">Honed</option>
          <option value="Leathered">Leathered</option>
        </select>

        {/* Thickness Filter */}
        <select
          value={selectedThickness}
          onChange={(e) => setSelectedThickness(e.target.value)}
          className="bg-transparent border border-black/10 dark:border-white/10 px-4 py-3 text-xs focus:outline-none focus:border-gold-500/60 rounded-none text-black dark:text-white"
        >
          <option value="All">Thickness: All</option>
          <option value="2cm">2cm</option>
          <option value="3cm">3cm</option>
        </select>
      </div>

      {/* Grid listing */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 shimmer-bg border border-white/5"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProducts.map((stone) => {
            const isFav = isInWishlist(stone.id);
            const isComp = isInCompareList(stone.id);
            const inSample = isInSampleCart(stone.id);

            return (
              <div
                key={stone.id}
                className="group relative border border-black/5 dark:border-white/5 bg-[#fafafa] dark:bg-[#0c0c0e] hover:border-gold-500/30 transition-all duration-500 flex flex-col"
              >
                {/* Photo frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-black/5 dark:border-white/5 bg-[#ecebeb]">
                  <img
                    src={stone.image_url}
                    alt={stone.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    {/* Wishlist Button */}
                    <button
                      onClick={() => (isFav ? removeFromWishlist(stone.id) : addToWishlist(stone))}
                      className="p-2 glass-premium-dark text-white hover:text-gold-500 transition-colors"
                      title="Bookmark Slab"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-gold-500 text-gold-500" : ""}`} />
                    </button>
                    {/* Compare Button */}
                    <button
                      onClick={() => (isComp ? removeFromCompare(stone.id) : addToCompare(stone))}
                      className={`p-2 glass-premium-dark text-white hover:text-gold-500 transition-colors ${
                        isComp ? "text-gold-500 bg-gold-500/20" : ""
                      }`}
                      title="Compare specs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Specs Copy */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-black/50 dark:text-white/40">
                      <span>{stone.category} • {stone.origin}</span>
                      <span className="font-semibold text-gold-500">{stone.thickness} • {stone.finish}</span>
                    </div>
                    <h3 className="font-serif text-lg text-black dark:text-white group-hover:text-gold-500 transition-colors">
                      {stone.name}
                    </h3>
                    <p className="text-[11px] text-black/60 dark:text-white/60 leading-relaxed line-clamp-2">
                      {stone.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActive3dProduct(stone)}
                        className="grow py-2 text-[10px] tracking-widest uppercase font-semibold border border-black/10 dark:border-white/10 hover:border-gold-500 text-black dark:text-white transition-all text-center"
                      >
                        Inspect Slab
                      </button>
                      <button
                        onClick={() => addToSampleCart(stone)}
                        className="px-3.5 py-2 text-[10px] tracking-widest uppercase font-semibold bg-gold-500/10 hover:bg-gold-500 hover:text-black border border-gold-500/30 text-gold-500 transition-all text-center"
                      >
                        {inSample ? <Check className="w-3.5 h-3.5 mx-auto" /> : <Plus className="w-3.5 h-3.5 mx-auto" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==========================================
          DYNAMIC LIGHTING INSPECTOR (MODAL DIALOG)
         ========================================== */}
      {active3dProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 page-fade-in">
          <div className="bg-[#0b0b0c] border border-gold-500/20 max-w-4xl w-full h-[600px] flex flex-col relative text-white rounded-none">
            {/* Header info */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/80">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-gold-500">{active3dProduct.category}</span>
                <h3 className="font-serif text-xl tracking-wide">{active3dProduct.name} Inspector</h3>
              </div>
              <button
                onClick={() => setActive3dProduct(null)}
                className="text-white/60 hover:text-white px-3 py-1 border border-white/10 text-xs tracking-wider uppercase hover:border-white transition-colors"
              >
                Close
              </button>
            </div>

            {/* Main Interactive Image Area */}
            <div className="flex-grow relative bg-black flex items-center justify-center overflow-hidden p-4">
              <img
                src={active3dProduct.image_url}
                alt={active3dProduct.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Spec Footer */}
            <div className="p-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-black/80 text-[10px] uppercase tracking-wider text-white/50">
              <div>
                <span>Origin</span>
                <p className="text-xs text-white font-semibold mt-0.5">{active3dProduct.origin}</p>
              </div>
              <div>
                <span>Finish</span>
                <p className="text-xs text-white font-semibold mt-0.5">{active3dProduct.finish}</p>
              </div>
              <div>
                <span>Thickness</span>
                <p className="text-xs text-white font-semibold mt-0.5">{active3dProduct.thickness}</p>
              </div>
              <div>
                <span>Applications</span>
                <p className="text-xs text-white font-semibold mt-0.5 truncate">{active3dProduct.applications}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          STICKY COMPARISON DRAWER BAR
         ========================================== */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 left-4 z-40 glass-premium-dark p-4 flex items-center space-x-6 border border-gold-500/20 shadow-2xl">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-4 h-4 text-gold-500 animate-spin-slow" />
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-white">Compare Deck</h4>
              <p className="text-[9px] text-white/50">{compareList.length} / 3 slabs selected</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {compareList.map((item) => (
              <div key={item.id} className="relative w-10 h-10 border border-white/10 group">
                <img src={item.image_url} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowCompareModal(true)}
            className="bg-gold-500 text-black px-4 py-2 text-[9px] uppercase tracking-widest font-bold hover:bg-white transition-colors"
          >
            Compare Now
          </button>
        </div>
      )}

      {/* ==========================================
          SIDE-BY-SIDE COMPARE MODAL
         ========================================== */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 page-fade-in">
          <div className="bg-gradient-to-br from-[#0c0c0e] to-[#121215] border border-gold-500/30 max-w-5xl w-full h-[650px] flex flex-col text-white rounded-none shadow-[0_0_80px_rgba(212,175,55,0.08)]">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/30">
              <div>
                <span className="text-[9px] text-gold-500 uppercase tracking-[0.25em] font-bold block mb-1">
                  Atelier Curator Deck
                </span>
                <h3 className="font-serif text-2xl text-white tracking-wide">Stone Comparison Dashboard</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-white/60 hover:text-gold-500 px-4 py-2 border border-white/10 hover:border-gold-500/40 text-[10px] tracking-widest uppercase transition-all duration-300 bg-white/5 hover:bg-gold-500/5"
              >
                Exit Dashboard
              </button>
            </div>

            {/* Spec Matrix Carousel Wrapper */}
            <div className="flex-grow overflow-x-auto p-8 flex space-x-6 scrollbar-thin scrollbar-thumb-gold scroll-smooth">
              {compareList.map((stone) => (
                <div 
                  key={stone.id} 
                  className="w-[300px] shrink-0 border border-white/10 bg-gradient-to-b from-[#18181b]/90 to-[#0e0e10]/95 p-6 flex flex-col justify-between hover:border-gold-500/40 hover:shadow-[0_10px_40px_rgba(212,175,55,0.12)] transition-all duration-500 transform hover:-translate-y-1 group/card"
                >
                  <div className="space-y-5">
                    <div>
                      <span className="text-[9px] text-gold-500/80 uppercase tracking-widest font-semibold">{stone.category}</span>
                      <h4 className="font-serif text-lg font-bold mt-1 text-white group-hover/card:text-gold-500 transition-colors duration-300">{stone.name}</h4>
                    </div>

                    <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/10">
                      <img 
                        src={stone.image_url} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="space-y-2 text-[10px] uppercase tracking-wider text-white/50">
                      <div className="flex justify-between py-2 border-b border-white/5 hover:text-white transition-colors">
                        <span>Origin</span>
                        <span className="font-semibold text-white">{stone.origin}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5 hover:text-white transition-colors">
                        <span>Finish</span>
                        <span className="font-semibold text-white">{stone.finish}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5 hover:text-white transition-colors">
                        <span>Thickness</span>
                        <span className="font-semibold text-white">{stone.thickness}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5 hover:text-white transition-colors">
                        <span>Price Indicator</span>
                        <span className="font-bold text-gold-500 tracking-wide">${stone.price} / sqft</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5 hover:text-white transition-colors">
                        <span>Availability</span>
                        <span className={`font-semibold ${stone.availability === 'In Stock' ? 'text-green-400' : 'text-yellow-500'}`}>{stone.availability}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCompare(stone.id)}
                    className="w-full py-2.5 mt-6 bg-red-950/10 hover:bg-red-650 border border-red-500/20 hover:border-red-500/60 text-red-400 hover:text-white text-[9px] uppercase tracking-widest font-semibold transition-all duration-300"
                  >
                    Remove Lot
                  </button>
                </div>
              ))}

              {compareList.length < 3 && (
                <div className="w-[300px] shrink-0 border border-dashed border-white/10 bg-[#0c0c0e]/40 flex flex-col items-center justify-center p-6 text-center space-y-3 transition-colors hover:border-gold-500/20">
                  <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/20">
                    <Layers className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">Select Another Stone Lot</p>
                    <p className="text-[8px] text-white/25 mt-1">Add up to 3 stones to compare details</p>
                  </div>
                  <button
                    onClick={() => setShowCompareModal(false)}
                    className="text-[9px] uppercase tracking-widest font-bold text-gold-500 hover:text-white hover:underline transition-colors mt-2"
                  >
                    Browse Yard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

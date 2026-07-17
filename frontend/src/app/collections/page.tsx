"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Search, Heart, RefreshCw, Layers, MapPin, Check, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { useApp, Product } from "@/context/AppContext";
import { fallbackProducts } from "@/data/products";

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
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* ==========================================
            LEFT SIDEBAR FILTERS
           ========================================== */}
        <div className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
            <h2 className="text-xl font-bold font-serif">Filters</h2>
            <Layers className="w-5 h-5 text-black/40 dark:text-white/40" />
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-black/40 dark:text-white/30" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/5 dark:bg-white/5 pl-9 pr-4 py-2.5 text-xs focus:outline-none rounded-none text-black dark:text-white"
              />
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-gold-500 rounded-none text-black dark:text-white"
              >
                <option value="All">All Categories</option>
                <option value="Marble">Marble</option>
                <option value="Imported Marble">Imported Marble</option>
                <option value="Full Body Tiles">Full Body Tiles</option>
                <option value="Wall Tiles">Wall Tiles</option>
                <option value="PVT">PVT</option>
              </select>
            </div>

            {/* Finish / Design */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Finish / Design</h3>
              <select
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-gold-500 rounded-none text-black dark:text-white"
              >
                <option value="All">All Finishes</option>
                <option value="Polished">Polished</option>
                <option value="Full Polished">Full Polished</option>
                <option value="Honed">Honed</option>
                <option value="Matte">Matte</option>
              </select>
            </div>

            {/* Origin (Mapping to Rooms / Origin depending on data) */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Origin</h3>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-gold-500 rounded-none text-black dark:text-white"
              >
                <option value="All">All Origins</option>
                <option value="India">India</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="Brazil">Brazil</option>
              </select>
            </div>

            {/* Thickness / Size */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Thickness / Size</h3>
              <select
                value={selectedThickness}
                onChange={(e) => setSelectedThickness(e.target.value)}
                className="w-full bg-transparent border border-black/10 dark:border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-gold-500 rounded-none text-black dark:text-white"
              >
                <option value="All">All Sizes</option>
                <option value="800 X 3000 mm">800 X 3000 mm</option>
                <option value="1200 X 1800 mm">1200 X 1800 mm</option>
                <option value="2cm">2cm</option>
                <option value="3cm">3cm</option>
              </select>
            </div>
            
            {/* Dummy Filters for Aesthetic (Matching screenshot) */}
            {['Application', 'Rooms', 'Pattern', 'Colour', 'Innovation', 'Series'].map((filter) => (
               <div key={filter} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 cursor-pointer hover:text-gold-500 transition-colors">
                 <span className="text-sm">{filter}</span>
                 <Plus className="w-4 h-4 text-black/40 dark:text-white/40" />
               </div>
            ))}

          </div>
        </div>

        {/* ==========================================
            RIGHT PRODUCT GRID
           ========================================== */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center bg-[#f9f9f9] dark:bg-[#0c0c0e] p-4 border border-black/5 dark:border-white/5 rounded-2xl">
            <h1 className="font-serif text-3xl font-light">
              <span className="font-bold text-gold-gradient">Collections</span>
            </h1>
            <div className="text-xs text-black/50 dark:text-white/40 mt-2 sm:mt-0">
              Showing {filteredProducts.length} Products
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 shimmer-bg rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((stone) => {
                const isFav = isInWishlist(stone.id);
                return (
                  <div
                    key={stone.id}
                    className="group relative bg-white dark:bg-[#121212] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5 dark:border-white/5 flex flex-col"
                  >
                    {/* Photo area */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#ecebeb]">
                      <img
                        src={stone.image_url}
                        alt={stone.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {/* Floating Heart */}
                      <button
                        onClick={(e) => { e.preventDefault(); isFav ? removeFromWishlist(stone.id) : addToWishlist(stone); }}
                        className="absolute top-4 right-4 p-2.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-gold-500 transition-colors z-10"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Size Pill */}
                        <div className="inline-block px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full text-[10px] text-black/60 dark:text-white/60 font-medium">
                          {stone.thickness}
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-lg text-black dark:text-white line-clamp-1 group-hover:text-gold-500 transition-colors">
                            {stone.name}
                          </h3>
                          <p className="text-sm text-black/50 dark:text-white/50 mt-1">{stone.category}</p>
                        </div>
                      </div>

                      {/* Explore Button */}
                      <Link href={`/products/${stone.id}`} className="mt-6 block">
                        <button className="w-full py-3.5 bg-[#1a1a1a] dark:bg-[#1a1a1a] hover:bg-gold-500 dark:hover:bg-gold-500 text-white rounded-2xl text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                          <Search className="w-4 h-4 text-gold-500 group-hover:text-white" />
                          <span>Explore Now</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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

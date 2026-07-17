"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { fallbackProducts } from "@/data/products";
import { Product } from "@/context/AppContext";
import { ArrowLeft, ShoppingCart, Plus, Minus, Shield, Sparkles } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (id) {
      const found = fallbackProducts.find(p => p.id === Number(id));
      if (found) {
        setProduct(found);
        setMainImage(found.images?.[0] || found.image_url);
      }
    }
  }, [id]);

  const increase = () => setQuantity(prev => prev + 1);
  const decrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <SmoothScroll>
        <NavBar />
        <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] dark:bg-[#080809] pt-24">
          <p className="text-black dark:text-white font-serif text-2xl">Product not found.</p>
        </div>
      </SmoothScroll>
    );
  }

  let suggestedProducts = fallbackProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (suggestedProducts.length < 4) {
    const more = fallbackProducts
      .filter(p => p.id !== product.id && !suggestedProducts.some(sp => sp.id === p.id))
      .slice(0, 4 - suggestedProducts.length);
    suggestedProducts = [...suggestedProducts, ...more];
  }

  return (
    <SmoothScroll>
      <div className="bg-[#fcfcfc] dark:bg-[#080809] min-h-screen text-black dark:text-white selection:bg-gold-500/30">
        <NavBar />
        
        <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-black/60 dark:text-white/60 hover:text-gold-500 mb-8 transition-colors text-sm uppercase tracking-widest font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-square bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden relative">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${mainImage === img ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black dark:text-white mb-4">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">{product.category}</span>
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">{product.finish}</span>
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">Wall & Floor</span>
                </div>
                <div className="font-sans text-3xl font-bold text-gold-500">
                  ₹{product.price} <span className="text-sm font-normal text-black/50 dark:text-white/50">/ sq.ft</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-black/10 dark:border-white/10 py-6">
                <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                  {product.description}
                </p>
              </div>

              {/* Works Well For */}
              <div className="pt-6">
                <h3 className="text-sm font-sans text-black/60 dark:text-white/60 mb-4">Works Well For</h3>
                <div className="flex flex-wrap gap-2">
                  {["Bedroom", "Living Room", "Table Top", "Lobby", "Reception", "Mall", "Restaurant", "Hotel", "Kitchen Platform", "Offices", "Showrooms", "Airports", "Stations", "Movie Hall", "Commercial Kitchen", "Shops", "Hospital", "Educational Institutes"].map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-black/5 dark:bg-white/10 rounded-sm text-xs text-black/80 dark:text-white/80 whitespace-nowrap">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="pt-8">
                <h3 className="font-sans text-2xl text-black/80 dark:text-white/80 mb-6">Technical Details</h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Size</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">800 X 3000 mm</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Finish</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.finish}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Application</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.applications}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Pattern</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">Plain</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Thickness</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.thickness}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Tiles Per Carton</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">1</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Coverage (sq ft)</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">25.8</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Coverage (sq mt)</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">2.4</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">SAP Code</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium uppercase">T61F252000018101</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 mt-auto">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-black/20 dark:border-white/20 rounded-sm bg-transparent w-32 h-14">
                    <button onClick={decrease} className="px-4 h-full text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-sans font-bold text-base w-full text-center">{quantity}</span>
                    <button onClick={increase} className="px-4 h-full text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className={`flex-1 h-14 flex items-center justify-center space-x-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-all duration-300 ${added ? 'bg-green-600 text-white' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white'}`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                  </button>
                </div>
                
                <button className="w-full h-14 flex items-center justify-center space-x-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-sm text-sm uppercase tracking-widest font-bold">
                  <span>Find a Store</span>
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Products Section */}
          {suggestedProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-black/10 dark:border-white/10">
              <div className="text-center mb-12 space-y-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">Discover More</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-black dark:text-white">
                  You May Also <span className="text-gold-gradient font-light italic">Like</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {suggestedProducts.map((sp) => (
                  <Link key={sp.id} href={`/products/${sp.id}`} className="group block bg-white dark:bg-[#111] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-[#ecebeb] dark:bg-[#1a1a1a]">
                      <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-sm border border-black/10 dark:border-white/10 shadow-sm z-10">
                        <span className="font-sans font-bold text-xs text-black dark:text-white">₹{sp.price}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-[9px] uppercase tracking-wider text-black/50 dark:text-white/50 mb-1">{sp.category}</div>
                      <h3 className="font-serif text-base text-black dark:text-white group-hover:text-gold-500 transition-colors leading-snug">{sp.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
        
        <Footer />
        <WhatsAppWidget />
      </div>
    </SmoothScroll>
  );
}

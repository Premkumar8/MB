"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { fallbackProducts } from "@/data/products";
import { Product } from "@/context/AppContext";

export default function FeaturedProducts() {
  const products = fallbackProducts.filter(p => p.category === "Full Body Tiles").reverse().slice(0, 8);

  return (
    <section className="bg-white dark:bg-[#080809] py-24 relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">New Arrivals</span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-black dark:text-white">
            Full Body <span className="text-gold-gradient font-light italic">Tiles</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/collections">
            <button className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-gold-500 hover:text-white dark:hover:bg-gold-500 transition-colors duration-300">
              Explore All Collections
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const increase = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity(prev => prev + 1);
  };
  const decrease = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative bg-white dark:bg-[#111] rounded-lg shadow-sm border border-black/5 dark:border-white/5 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-white/5">
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10 dark:border-white/10 shadow-sm z-10">
          <span className="font-sans font-bold text-sm text-black dark:text-white">₹{product.price} <span className="text-[10px] font-normal text-black/50 dark:text-white/50">/ sq.ft</span></span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-[#111]">
        <div className="mb-6">
          <h3 className="font-serif text-lg text-black dark:text-white font-medium leading-snug group-hover:text-gold-500 transition-colors">{product.name}</h3>
        </div>
        
        <div className="space-y-4 mt-auto" onClick={(e) => e.preventDefault()}>
          <div className="flex items-center justify-between border border-black/10 dark:border-white/10 rounded-md p-1 bg-black/5 dark:bg-white/5">
            <button onClick={decrease} className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-sans font-semibold text-sm w-8 text-center text-black dark:text-white">{quantity}</span>
            <button onClick={increase} className="p-2 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md text-sm font-semibold transition-all duration-300 ${added ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white'}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { fallbackProducts, mergeWithFallbackProducts } from "@/data/products";
import { Product } from "@/context/AppContext";
import { useApp } from "@/context/AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(
    fallbackProducts.filter(p => p.category === "Full Body Tiles").reverse().slice(0, 8)
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          const processed = data.map((item: any) => ({
            ...item,
            image_url: item.image_url.startsWith("/static") ? `${API_URL}${item.image_url}` : item.image_url,
          }));
          const merged = mergeWithFallbackProducts(processed);
          const filtered = merged.filter((p: Product) => p.category === "Full Body Tiles").reverse().slice(0, 8);
          if (filtered.length > 0) {
            setProducts(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching featured products from DB:", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="bg-white dark:bg-[#080809] py-24 relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 space-y-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-500 font-bold">New Arrivals</span>
          <h2 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-black dark:text-white">
            Full Body <span className="text-brand-gradient">Tiles</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/collections">
            <button className="bg-black dark:bg-white text-white dark:text-black px-10 py-4 text-sm tracking-[0.2em] uppercase hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-colors duration-300">
              Explore All Collections
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useApp();
  const isFav = wishlist.some((item) => item.id === product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    isFav ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  return (
    <Link href={`/products/${product.id}`} className="group relative bg-white dark:bg-[#111] rounded-lg shadow-sm border border-black/5 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:border-brand-500/30 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-black/5 dark:bg-white/5">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <button
          onClick={toggleWishlist}
          className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full border border-black/10 dark:border-white/10 text-black/60 dark:text-white/70 hover:text-brand-500 hover:border-brand-500 transition-colors z-10"
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-brand-500 text-brand-500" : ""}`} />
        </button>

        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-black/10 dark:border-white/10 shadow-sm z-10">
          <span className="font-sans font-bold text-sm text-black dark:text-white">₹{product.price} <span className="text-[10px] font-normal text-black/50 dark:text-white/50">/ sq.ft</span></span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between bg-white dark:bg-[#111]">
        <div className="mb-5">
          <span className="text-[9px] uppercase tracking-[0.2em] text-brand-500 font-bold">{product.category}</span>
          <h3 className="font-sans text-lg text-black dark:text-white font-semibold leading-snug mt-1 group-hover:text-brand-500 transition-colors">{product.name}</h3>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/10">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-black/50 dark:text-white/40">
            {product.availability || "In Stock"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-black dark:text-white group-hover:text-brand-500 transition-colors">
            View Details
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
}

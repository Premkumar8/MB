"use client";

import React from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, HelpCircle, Mail, MapPin } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, sampleCart, addToSampleCart, removeFromSampleCart, isInSampleCart } = useApp();

  const handleRequestBatchQuote = () => {
    const listNames = wishlist.map((item) => item.name).join(", ");
    window.location.href = `/quote?stone=${encodeURIComponent(listNames)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 page-fade-in">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-bold">
          Curated selection
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide">
          My Saved <span className="font-bold text-gold-gradient">Slabs</span>
        </h1>
        <p className="text-xs text-black/50 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
          Inspect your bookmarked natural stone lots. Request physical hand-samples, or request custom dimensions pricing quotes directly.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-premium p-16 text-center space-y-6 max-w-lg mx-auto">
          <Heart className="w-12 h-12 text-black/20 dark:text-white/20 mx-auto" />
          <div className="space-y-2">
            <h3 className="font-serif text-xl">Wishlist Is Empty</h3>
            <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
              Explore our collections yard to bookmark blocks, Onyx slabs, and granite materials.
            </p>
          </div>
          <Link href="/collections" className="btn-gold-solid inline-block text-xs">
            Browse Slabs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wishlist item listings */}
          <div className="lg:col-span-8 space-y-4">
            {wishlist.map((stone) => {
              const inSample = isInSampleCart(stone.id);
              return (
                <div
                  key={stone.id}
                  className="border border-black/5 dark:border-white/5 bg-[#fafafa] dark:bg-[#0c0c0e] p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative hover:border-gold-500/20 transition-all duration-300"
                >
                  <img src={stone.image_url} className="w-24 h-24 object-cover border border-white/10 shrink-0" />
                  
                  <div className="grow space-y-1.5 text-center sm:text-left">
                    <span className="text-[9px] uppercase tracking-widest text-gold-500">{stone.category} • {stone.origin}</span>
                    <h3 className="font-serif text-lg font-bold">{stone.name}</h3>
                    <p className="text-[10px] text-black/60 dark:text-white/60">{stone.thickness} thickness • {stone.finish} finish</p>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => (inSample ? removeFromSampleCart(stone.id) : addToSampleCart(stone))}
                      className="px-4 py-2 border border-black/10 dark:border-white/10 text-black dark:text-white text-[10px] uppercase tracking-widest font-semibold hover:border-gold-500 transition-colors"
                    >
                      {inSample ? "Remove Sample" : "Order Sample"}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(stone.id)}
                      className="p-3 text-red-500 border border-red-500/10 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all"
                      title="Remove from board"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action card */}
          <div className="lg:col-span-4 glass-premium p-6 space-y-6">
            <h4 className="font-serif text-lg border-b border-black/5 dark:border-white/5 pb-3">Selection Summary</h4>
            
            <div className="space-y-2 text-xs text-black/60 dark:text-white/60">
              <div className="flex justify-between">
                <span>Bookmarked Lots</span>
                <span className="font-semibold text-black dark:text-white">{wishlist.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Sample Requests</span>
                <span className="font-semibold text-black dark:text-white">
                  {wishlist.filter((w) => isInSampleCart(w.id)).length} items
                </span>
              </div>
            </div>

            <button
              onClick={handleRequestBatchQuote}
              className="w-full btn-gold-solid text-center flex items-center justify-center space-x-2"
            >
              <span>Request Batch Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="border-t border-black/5 dark:border-white/5 pt-4 space-y-2 text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Physical samples shipped worldwide</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <span>Curator assistance included</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

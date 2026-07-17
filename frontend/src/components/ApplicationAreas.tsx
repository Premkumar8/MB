"use client";

import React, { useState } from "react";
import { 
  Home, 
  GraduationCap, 
  Hotel, 
  ArrowRightLeft, 
  Waves, 
  Bath, 
  ChefHat, 
  LifeBuoy, 
  Building2, 
  Plane, 
  Users, 
  Store 
} from "lucide-react";
import { fallbackProducts } from "@/data/products";
import { ProductCard } from "@/components/FeaturedProducts";

const applications = [
  { name: "Residential Areas", icon: Home },
  { name: "Educational Institutions", icon: GraduationCap },
  { name: "Hotels & Restaurants", icon: Hotel },
  { name: "Hallways & Corridors", icon: ArrowRightLeft },
  { name: "Spa & Wellness", icon: Waves },
  { name: "Bathrooms", icon: Bath },
  { name: "Kitchens", icon: ChefHat },
  { name: "Poolside Areas", icon: LifeBuoy },
  { name: "Commercial Areas", icon: Building2 },
  { name: "Airports", icon: Plane },
  { name: "Public Places", icon: Users },
  { name: "Shops & Malls", icon: Store },
];

export default function ApplicationAreas() {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const filteredProducts = activeApp 
    ? fallbackProducts.filter(p => {
        const apps = p.applications.toLowerCase();
        const search = activeApp.toLowerCase().replace(" areas", "").replace(" &", "");
        // Simple heuristic match
        const keywords = search.split(" ").filter(k => k.length > 2);
        return keywords.some(k => apps.includes(k));
      })
    : [];

  return (
    <section className="bg-white dark:bg-[#080809] py-24 relative z-10 border-t border-black/5 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-4 max-w-2xl">
            <h2 className="font-serif text-4xl sm:text-5xl text-black dark:text-white font-bold tracking-tight">
              Robust Application Areas
            </h2>
            <p className="text-black/60 dark:text-white/60 text-sm sm:text-base leading-relaxed font-medium">
              Tiles engineered for diverse applications, each application supported by the right balance of strength, finish, and function.
            </p>
          </div>
          <button className="px-6 py-3 bg-[#111] dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white transition-colors whitespace-nowrap">
            Applications Areas
          </button>
        </div>

        {/* Icons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
          {applications.map((app) => {
            const Icon = app.icon;
            const isActive = activeApp === app.name;
            return (
              <div 
                key={app.name} 
                onClick={() => setActiveApp(isActive ? null : app.name)}
                className={`flex flex-col items-center justify-center space-y-4 cursor-pointer group p-4 rounded-xl transition-all duration-300 ${isActive ? 'bg-black/5 dark:bg-white/10 shadow-inner' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
              >
                <div className={`p-4 rounded-full transition-colors duration-300 ${isActive ? 'bg-gold-500 text-white' : 'bg-transparent text-black dark:text-white group-hover:text-gold-500'}`}>
                  <Icon strokeWidth={1.5} className="w-10 h-10" />
                </div>
                <span className={`text-xs font-semibold text-center transition-colors duration-300 ${isActive ? 'text-gold-500' : 'text-black/80 dark:text-white/80 group-hover:text-gold-500'}`}>
                  {app.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Related Products Display */}
        {activeApp && (
          <div className="pt-12 border-t border-black/10 dark:border-white/10 animate-fade-in">
            <div className="mb-8 flex items-center space-x-3">
              <div className="w-2 h-8 bg-gold-500"></div>
              <h3 className="font-serif text-2xl text-black dark:text-white">
                Products for <span className="text-gold-500">{activeApp}</span>
              </h3>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-black/5 dark:bg-white/5 rounded-lg p-12 text-center">
                <p className="text-black/60 dark:text-white/60 font-medium">No specific products mapped for this application yet. Browse our full collection!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

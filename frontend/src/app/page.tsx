"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Compass, Shield, Sparkles, Award, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Three.js slab viewer to prevent Next.js SSR hydration mismatches
// Removed MarbleSlab3D to keep 3D showroom as the only 3D section as requested.

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeHeroStone, setActiveHeroStone] = useState({
    name: "Carrara Gold",
    texture: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.15,
    metalness: 0.05,
    titleFirst: "Masterpieces Sculpted",
    titleSecond: "By Mother Nature",
    description: "For centuries, the finest structures have relied on our Italian marbles. Quarried from the Apuan Alps in Carrara, Italy, Carrara Gold features a striking white background with warm gold and gray veins.",
    gradientClass: "text-gold-gradient"
  });

  const heroStones = [
    {
      name: "Carrara Gold",
      texture: "/static/seed/textures/carrara_gold_diff.jpg",
      roughness: 0.15,
      metalness: 0.05,
      titleFirst: "Masterpieces Sculpted",
      titleSecond: "By Mother Nature",
      description: "For centuries, the finest structures have relied on our Italian marbles. Quarried from the Apuan Alps in Carrara, Italy, Carrara Gold features a striking white background with warm gold and gray veins.",
      gradientClass: "text-gold-gradient"
    },
    {
      name: "Nero Marquina",
      texture: "/static/seed/textures/nero_marquina_diff.jpg",
      roughness: 0.1,
      metalness: 0.15,
      titleFirst: "Architectural Drama",
      titleSecond: "Sculpted in Spain",
      description: "A high-quality black stone marble extracted from the region of Markina, Northern Spain. The deep black color contrasts sharply with white calcite veins, embodying true architectural elegance.",
      gradientClass: "text-silver-gradient"
    },
    {
      name: "Emerald Onyx",
      texture: "/static/seed/textures/emerald_onyx_diff.jpg",
      roughness: 0.05,
      metalness: 0.2,
      titleFirst: "Ethereal Glow",
      titleSecond: "Luminescence from Iran",
      description: "A highly translucent green onyx stone with mesmerizing bands of mint and golden bronze. When backlit, it emits a warm luminescence perfect for high-end boutique interior designs.",
      gradientClass: "text-emerald-gradient"
    },
  ];

  // Mouse coordinate tracker for luxury follow-light gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-play interval for hero stone carousel, resetting when activeHeroStone changes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroStone((prev) => {
        const currentIndex = heroStones.findIndex((stone) => stone.name === prev.name);
        const nextIndex = (currentIndex + 1) % heroStones.length;
        return heroStones[nextIndex];
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [activeHeroStone]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden mouse-light-glow min-h-screen page-fade-in"
      style={{
        // Define css properties for raw coordinate mouse glow mapping
        ["--x" as any]: `${mousePos.x}px`,
        ["--y" as any]: `${mousePos.y}px`,
      }}
    >
      {/* Dynamic Ambient Background Particle Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-white dark:to-[#070708] pointer-events-none z-0"></div>

      {/* ==========================================
          HERO SECTION
         ========================================== */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-80px)]">
        
        {/* Hero Copy */}
        <div className="lg:col-span-6 space-y-8 z-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-2 text-gold-500"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="text-xs tracking-[0.3em] uppercase font-extrabold">
                Luxury Quarry Excavations
              </span>
            </motion.div>
            
            {/* Title with cross-fade animation - wrapper expanded to prevent wrap clipping */}
            <div className="h-[150px] sm:h-[180px] lg:h-[220px] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeHeroStone.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] absolute inset-x-0 top-0"
                >
                  <span className={`${activeHeroStone.gradientClass} font-extrabold`}>{activeHeroStone.titleFirst}</span> <br />
                  <span className={`${activeHeroStone.gradientClass} font-light`}>{activeHeroStone.titleSecond}</span>
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Description with cross-fade animation - wrapper expanded to fit text size */}
            <div className="h-[120px] sm:h-[100px] lg:h-[90px] relative overflow-hidden mt-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeHeroStone.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm sm:text-base lg:text-lg text-black/75 dark:text-white/75 leading-relaxed max-w-xl absolute inset-x-0 top-0"
                >
                  {activeHeroStone.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Interactive Hero Stone Selector */}
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-black/55 dark:text-white/55 font-extrabold block">
              Active Slab Lot Configurator:
            </span>
            <div className="flex space-x-3.5">
              {heroStones.map((stone) => (
                <button
                  key={stone.name}
                  onClick={() => setActiveHeroStone(stone)}
                  className={`text-xs sm:text-sm tracking-widest uppercase font-bold px-6 py-3 border-2 transition-all duration-300 rounded-none relative overflow-hidden cursor-pointer ${
                    activeHeroStone.name === stone.name
                      ? "border-gold-500 text-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      : "border-black/20 dark:border-white/20 text-black/70 dark:text-white/70 hover:border-gold-500/60"
                  }`}
                >
                  {stone.name}
                  {activeHeroStone.name === stone.name && (
                    <motion.div
                      layoutId="hero-timer"
                      className="absolute bottom-0 left-0 h-[3.5px] bg-gold-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <Link href="/collections" className="btn-gold-solid text-center">
              Explore Collections
            </Link>
            <Link href="/quote" className="btn-gold-glow text-center">
              Request Quote
            </Link>
            <Link href="/showroom" className="btn-luxury-outline text-center flex items-center justify-center space-x-2">
              <Play className="w-3.5 h-3.5 text-gold-500" />
              <span>Watch Showroom</span>
            </Link>
          </div>
        </div>

        {/* Hero Image Box with Carousel Cross-fade */}
        <div className="lg:col-span-6 h-[400px] lg:h-[520px] relative z-10 border border-gold-500/10 shadow-[0_30px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] bg-white dark:bg-[#0b0b0c] flex items-center justify-center overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={activeHeroStone.name}
              src={activeHeroStone.texture.replace("/textures/", "/").replace("_diff.jpg", ".jpg")}
              alt={activeHeroStone.name}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Subtle logo vector watermark */}
          <div className="absolute top-4 right-4 text-black/15 dark:text-white/5 font-serif text-3xl tracking-[0.2em] select-none pointer-events-none uppercase z-20">
            AURELIA
          </div>
        </div>

      </section>

      {/* ==========================================
          METRICS & BRAND VALUES SECTION
         ========================================== */}
      <section className="bg-black/5 dark:bg-white/2 py-20 border-t border-b border-black/5 dark:border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="font-serif text-3xl lg:text-4xl text-gold-500 font-bold">18</h3>
            <p className="text-[10px] tracking-widest text-black/50 dark:text-white/40 uppercase">
              Exclusive Italian Quarries
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl lg:text-4xl text-gold-500 font-bold">100%</h3>
            <p className="text-[10px] tracking-widest text-black/50 dark:text-white/40 uppercase">
              Digitized PBR Slabs
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl lg:text-4xl text-gold-500 font-bold">4.9s</h3>
            <p className="text-[10px] tracking-widest text-black/50 dark:text-white/40 uppercase">
              AI Surface Replacement
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-3xl lg:text-4xl text-gold-500 font-bold">24h</h3>
            <p className="text-[10px] tracking-widest text-black/50 dark:text-white/40 uppercase">
              Curator Quote Turnaround
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURE SHOWCASE (AI & 3D INTERACTION)
         ========================================== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 space-y-28 relative z-10">
        
        {/* Row 1: Virtual Showroom Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-6">
            <div className="flex items-center space-x-2 text-gold-500">
              <Compass className="w-4 h-4" />
              <span className="text-[10px] tracking-widest uppercase font-semibold">
                Atmospheric 3D Space
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl leading-snug">
              Immerse in the Atelier <br />
              <span className="text-gold-gradient font-light">Showroom Experience</span>
            </h2>
            <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
              Step inside a fully virtual luxury stone pavilion. Inspect massive marble blocks, observe realistic reflections, and select specific vein contours from anywhere in the world.
            </p>
            <div className="pt-2">
              <Link
                href="/showroom"
                className="inline-flex items-center space-x-2 border-b border-gold-500 pb-1 text-xs uppercase tracking-widest font-semibold hover:text-gold-500 transition-colors"
              >
                <span>Enter 3D Showroom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-6 lg:order-1 relative aspect-video bg-[#0a0a0c] border border-white/5 shadow-2xl overflow-hidden group">
            {/* Showroom static preview */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('/static/seed/emerald_onyx.jpg')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-black/30 flex items-center justify-center">
              <Link
                href="/showroom"
                className="w-16 h-16 rounded-full bg-gold-500/20 hover:bg-gold-500 text-white hover:text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] border border-gold-500"
              >
                <Play className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: AI Room Visualizer Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center space-x-2 text-gold-500">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] tracking-widest uppercase font-semibold">
                AI Room Substitution
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl leading-snug">
              Visualize Custom Surfaces <br />
              <span className="text-gold-gradient font-light">With AI Precision</span>
            </h2>
            <p className="text-xs text-black/60 dark:text-white/60 leading-relaxed">
              Upload simple photographs of your kitchen or vanity spaces. Our deep-learning compositing engine segments counter spaces, replacing raw drywall and tiles with high-end, light-reflective marble configurations.
            </p>
            <div className="pt-2">
              <Link
                href="/visualizer"
                className="inline-flex items-center space-x-2 border-b border-gold-500 pb-1 text-xs uppercase tracking-widest font-semibold hover:text-gold-500 transition-colors"
              >
                <span>Try AI Visualizer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-video bg-[#fafafa] dark:bg-[#121214] border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden flex items-center justify-center">
            {/* Split Screen Simulator animation visualization */}
            <div className="w-full h-full flex relative">
              <div
                className="w-1/2 h-full bg-cover bg-center filter grayscale opacity-45"
                style={{ backgroundImage: `url('/static/seed/carrara_gold.jpg')` }}
              >
                <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-2 py-1 text-[9px] uppercase tracking-wider text-white">Before</span>
              </div>
              <div className="absolute left-1/2 inset-y-0 w-[2px] bg-gold-500 z-10"></div>
              <div
                className="w-1/2 h-full bg-cover bg-center"
                style={{ backgroundImage: `url('/static/seed/carrara_gold.jpg')` }}
              >
                <span className="absolute bottom-4 right-4 bg-gold-500 px-2 py-1 text-[9px] uppercase tracking-wider text-black font-semibold">After (Carrara Gold)</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ==========================================
          ACCREDITATIONS & TIMELINE BANNER
         ========================================== */}
      <section className="bg-black text-white py-20 border-t border-b border-gold-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex items-center space-x-4 border-r border-white/5 pr-4">
            <Award className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">Compass Design Prize</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Recognized for digital 3D innovation in luxury construction.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-r border-white/5 pr-4">
            <Shield className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">Carbon Neutral Quarrying</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Committed to restorative environmental quarrying practices.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Sparkles className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">White-Glove Shipping</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Custom crate structures engineered for zero-crack delivery.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

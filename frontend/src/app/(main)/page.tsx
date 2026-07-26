"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Shield, Sparkles, Award, Play, Pause, Volume2, VolumeX, LayoutGrid, Mountain, Gem, Layers, Hexagon, Cog, Heart, Star, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedProducts from "@/components/FeaturedProducts";
import ApplicationAreas from "@/components/ApplicationAreas";

const showcaseVideos = [
  {
    name: "Craftsmanship In Motion",
    src: "/videos/craftsmanship-walkthrough.mp4",
    desc: "A walkthrough of our granite and marble cladding work, installed end-to-end by our own team on site.",
  },
  {
    name: "Visit Our Showroom",
    src: "/videos/showroom-storefront.mp4",
    desc: "Step outside our Coimbatore showroom — home to India's leading tile and marble brands under one roof.",
  },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeVideo, setActiveVideo] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [videoMuted, setVideoMuted] = useState(true);

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setVideoPlaying(!videoPlaying);
  };
  const [activeHeroStone, setActiveHeroStone] = useState({
    name: "Kitchen Tiles",
    texture: "/static/real/hero-kitchen-tiles.jpg",
    titleFirst: "Sharma Marble",
    titleSecond: "Trading Company",
    description: "Leading supplier of Ceramic Tiles, Granites, Italian marbles for kitchens, homes and businesses since 1986.",
    gradientClass: "text-gold-gradient"
  });

  const heroStones = [
    {
      name: "Kitchen Tiles",
      texture: "/static/real/hero-kitchen-tiles.jpg",
      titleFirst: "Sharma Marble",
      titleSecond: "Trading Company",
      description: "Leading supplier of Ceramic Tiles, Granites, Italian marbles for kitchens, homes and businesses since 1986.",
      gradientClass: "text-gold-gradient"
    },
    {
      name: "Italian Marbles",
      texture: "/static/real/hero-marble-staircase.jpg",
      titleFirst: "Premium Selection",
      titleSecond: "Italian Marbles",
      description: "Delivering high quality aesthetic and durable materials to enhance the beauty and functionality of architectural spaces.",
      gradientClass: "text-silver-gradient"
    },
    {
      name: "Office Spaces",
      texture: "/static/real/project-tncd-building-exterior.jpg",
      titleFirst: "Engineered For",
      titleSecond: "Every Space",
      description: "From corporate lobbies to commercial interiors, our technical slabs bring refined strength and visual depth to every space.",
      gradientClass: "text-emerald-gradient"
    },
  ];

  const achievements = [
    { value: "40+", label: "Years of Experience", icon: Award },
    { value: "100%", label: "Client Satisfaction", icon: Heart },
    { value: "Top", label: "Quality Products", icon: Star },
    { value: "1st", label: "In Customer Service", icon: Trophy },
  ];

  const dealersIn = [
    { name: "Tiles", icon: LayoutGrid },
    { name: "Granites", icon: Mountain },
    { name: "Indian Marbles", icon: Gem },
    { name: "Italian Marbles", icon: Sparkles },
    { name: "Natural Stones (Kota, Tandur & Elevation Stones)", icon: Layers },
    { name: "Quartz", icon: Hexagon },
    { name: "Engineering Marbles", icon: Cog },
  ];

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
        ["--x" as any]: `${mousePos.x}px`,
        ["--y" as any]: `${mousePos.y}px`,
      }}
    >
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-white dark:to-[#070708] pointer-events-none z-0"></div>

      {/* HERO SECTION */}
      <section id="hero" className="relative w-full h-[calc(100vh-80px)] lg:h-[85vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Background Images */}
        <AnimatePresence initial={false}>
          <motion.div
            key={activeHeroStone.name}
            initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <img
              src={activeHeroStone.texture.replace("/textures/", "/").replace("_diff.jpg", ".jpg")}
              alt={activeHeroStone.name}
              className="w-full h-full object-cover"
            />
            {/* Dramatic Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col justify-center h-full">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-gold-400"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white">
                Excellence Since 1986
              </span>
            </motion.div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={activeHeroStone.name}
                  initial={{ opacity: 0, y: 80, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-5xl sm:text-6xl lg:text-[5.5rem] text-white font-light tracking-tight leading-[1.1]"
                  style={{ textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                >
                  <span className="block mb-2 font-medium text-white">{activeHeroStone.titleFirst}</span>
                  <span className="text-white/70 font-light text-4xl sm:text-5xl lg:text-[4.5rem]">{activeHeroStone.titleSecond}</span>
                </motion.h1>
              </AnimatePresence>
            </div>

            <div className="relative mt-6 border-l-2 border-gold-500 pl-6 h-[100px] sm:h-[80px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeHeroStone.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl font-light absolute inset-x-0 top-0 pl-6"
                >
                  {activeHeroStone.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Bar: CTA (right-aligned) + Slide Switcher */}
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 pb-8 sm:pb-10 pointer-events-auto flex flex-col gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="flex justify-end"
            >
              <Link href="/collections" className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-4 sm:px-12 sm:py-5 text-xs uppercase tracking-[0.2em] font-extrabold rounded-sm transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-gold-500/20">
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Explore Collection</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:text-white group-hover:translate-x-1 transition-all duration-500" />
                <div className="absolute inset-0 h-full w-full bg-gold-500 scale-x-0 group-hover:scale-x-100 origin-right transition-transform duration-500 ease-out"></div>
              </Link>
            </motion.div>

            <div className="flex items-stretch gap-4 sm:gap-8">
              {heroStones.map((stone, index) => {
                const isActive = activeHeroStone.name === stone.name;
                return (
                  <button
                    key={stone.name}
                    onClick={() => setActiveHeroStone(stone)}
                    className="group flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <div className="relative h-[2px] w-full bg-white/20 rounded-full overflow-hidden mb-3">
                      <div className={`absolute inset-0 bg-white/25 transition-opacity duration-300 ${isActive ? "opacity-0" : "opacity-100 group-hover:bg-white/50"}`} />
                      {isActive && (
                        <motion.div
                          key={stone.name + "-progress"}
                          className="absolute inset-y-0 left-0 bg-gold-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 4.5, ease: "linear" }}
                        />
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className={`text-[10px] font-bold shrink-0 transition-colors duration-300 ${isActive ? "text-gold-500" : "text-white/40"}`}>
                        0{index + 1}
                      </span>
                      <span className={`text-[10px] sm:text-xs tracking-[0.15em] uppercase font-bold truncate transition-colors duration-300 ${isActive ? "text-white" : "text-white/45 group-hover:text-white/75"}`}>
                        {stone.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO SHOWCASE */}
      <section className="bg-black relative z-10 overflow-hidden">
        <div className="relative w-full aspect-[4/5] sm:aspect-video lg:aspect-[21/9] lg:max-h-[80vh]">
          <AnimatePresence mode="wait">
            <motion.video
              key={showcaseVideos[activeVideo].src}
              ref={videoRef}
              autoPlay
              muted={videoMuted}
              loop
              playsInline
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              onPlay={() => setVideoPlaying(true)}
              onPause={() => setVideoPlaying(false)}
            >
              <source src={showcaseVideos[activeVideo].src} type="video/mp4" />
            </motion.video>
          </AnimatePresence>

          {/* Readability gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/50 pointer-events-none" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-16">
            <motion.div
              key={`${showcaseVideos[activeVideo].name}-caption`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold bg-black/30 backdrop-blur-sm px-4 py-2 border border-gold-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                Real Projects, Real Craftsmanship
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mt-6 leading-tight">
                {showcaseVideos[activeVideo].name}
              </h2>
              <p className="text-white/70 text-sm sm:text-base mt-4 max-w-md leading-relaxed">
                {showcaseVideos[activeVideo].desc}
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              {/* Video switcher */}
              <div className="flex gap-6 sm:gap-8">
                {showcaseVideos.map((v, i) => {
                  const isActive = activeVideo === i;
                  return (
                    <button
                      key={v.src}
                      onClick={() => setActiveVideo(i)}
                      className="group text-left cursor-pointer"
                    >
                      <div className="relative h-[2px] w-24 sm:w-32 bg-white/20 rounded-full overflow-hidden mb-3">
                        <div
                          className={`absolute inset-0 bg-gold-500 transition-all duration-500 ${
                            isActive ? "w-full" : "w-0 group-hover:w-1/3"
                          }`}
                        />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-[10px] font-bold ${isActive ? "text-gold-500" : "text-white/40"}`}>
                          0{i + 1}
                        </span>
                        <span
                          className={`text-[10px] sm:text-xs tracking-[0.15em] uppercase font-bold transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/45 group-hover:text-white/75"
                          }`}
                        >
                          {v.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Playback controls */}
              <div className="flex gap-3">
                <button
                  onClick={toggleVideoPlay}
                  aria-label={videoPlaying ? "Pause video" : "Play video"}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-white/25 text-white hover:border-gold-500 hover:text-gold-500 bg-black/20 backdrop-blur-sm transition-colors duration-300"
                >
                  {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => setVideoMuted(!videoMuted)}
                  aria-label={videoMuted ? "Unmute video" : "Mute video"}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-white/25 text-white hover:border-gold-500 hover:text-gold-500 bg-black/20 backdrop-blur-sm transition-colors duration-300"
                >
                  {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS SECTION */}
      <section className="bg-white dark:bg-[#080809] py-20 lg:py-24 border-t border-b border-black/5 dark:border-white/5 relative z-10 overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/[0.05] rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative"
        >
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col items-center text-center gap-4 p-6 md:p-8 border border-black/5 dark:border-white/10 hover:border-gold-500/40 bg-black/[0.015] dark:bg-white/[0.02] hover:bg-gold-500/5 transition-colors duration-500 overflow-hidden"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-gold-500/30 text-gold-500 group-hover:bg-gold-500 group-hover:text-black group-hover:shadow-[0_0_25px_rgba(234,179,8,0.4)] transition-all duration-500 group-hover:scale-110">
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="font-sans text-4xl lg:text-6xl text-gold-gradient font-semibold drop-shadow-sm">
                  {item.value}
                </h3>
                <p className="font-sans text-[9px] md:text-xs tracking-[0.2em] md:tracking-[0.25em] text-black/60 dark:text-white/50 uppercase font-bold">
                  {item.label}
                </p>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gold-500 group-hover:w-2/3 transition-all duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* BRANDED PRODUCTS */}
      <section id="showroom" className="w-full py-24 lg:py-32 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 relative z-20">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center space-x-2 text-gold-500">
              <Compass className="w-4 h-4" />
              <span className="text-[10px] tracking-widest uppercase font-bold">Our Brands</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl leading-snug">
              The Exclusive Tiles <br />
              <span className="text-gold-gradient font-light">Showroom For</span>
            </h2>
          </div>
        </div>
        <div className="w-full overflow-visible py-10 mt-4">
          <div className="flex animate-marquee w-[200%] gap-6 md:gap-10 pl-6 md:pl-10">
            {[
              { name: "Lavish Ceramics", category: "Ceramic Tiles", image: "/static/real/tile-floor-bright-white.jpg", desc: "Premium Lavish Ceramics collection." },
              { name: "Parryware", category: "Sanitaryware", image: "/static/real/onyx-emerald-green.jpg", desc: "Complete Parryware sanitaryware range." },
              { name: "Bonzer 7 Tiles", category: "Ceramic Tiles", image: "/static/real/marble-bathroom-calacatta.jpg", desc: "Elegant Bonzer 7 Tiles series." },
              { name: "Orientbell Tiles", category: "Ceramic Tiles", image: "/static/real/marble-black-nero.jpg", desc: "Orientbell Tiles premium selection." },
              { name: "Hindware Italian Collection", category: "Ceramic Tile Division", image: "/static/real/quartzite-travertine-beige.jpg", desc: "Hindware's Italian Collection tiles." },
              { name: "RAK Ceramics", category: "Premium Tile", image: "/static/real/granite-black-veined.jpg", desc: "World class RAK Ceramics." },
              // Duplicate for seamless marquee scroll
              { name: "Lavish Ceramics", category: "Ceramic Tiles", image: "/static/real/tile-floor-bright-white.jpg", desc: "Premium Lavish Ceramics collection." },
              { name: "Parryware", category: "Sanitaryware", image: "/static/real/onyx-emerald-green.jpg", desc: "Complete Parryware sanitaryware range." },
              { name: "Bonzer 7 Tiles", category: "Ceramic Tiles", image: "/static/real/marble-bathroom-calacatta.jpg", desc: "Elegant Bonzer 7 Tiles series." },
              { name: "Orientbell Tiles", category: "Ceramic Tiles", image: "/static/real/marble-black-nero.jpg", desc: "Orientbell Tiles premium selection." },
              { name: "Hindware Italian Collection", category: "Ceramic Tile Division", image: "/static/real/quartzite-travertine-beige.jpg", desc: "Hindware's Italian Collection tiles." },
              { name: "RAK Ceramics", category: "Premium Tile", image: "/static/real/granite-black-veined.jpg", desc: "World class RAK Ceramics." },
            ].map((product, idx) => (
              <div key={idx} className="group relative w-[280px] md:w-[350px] lg:w-[400px] aspect-[4/5] shrink-0 cursor-pointer transition-all duration-500 hover:z-50">
                <div className="absolute inset-0 bg-black/5 transition-all duration-500 ease-out group-hover:scale-110 md:group-hover:scale-125 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 origin-center overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url('${product.image}')` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full transform translate-y-6 md:translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-gold-500 text-[10px] tracking-[0.2em] uppercase font-bold mb-2">{product.category}</p>
                    <h3 className="text-white font-serif text-2xl md:text-3xl mb-4">{product.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: FEATURED PRODUCTS / FULL BODY TILES */}
      <FeaturedProducts />

      {/* NEW SECTION: APPLICATION AREAS */}
      <ApplicationAreas />

      {/* FEATURED PROJECT: TNCD HUB */}
      <section className="bg-[#fcfcfc] dark:bg-[#080809] py-24 lg:py-32 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-2 text-gold-500">
                <Award className="w-4 h-4" />
                <span className="text-[10px] tracking-widest uppercase font-bold">Featured Project</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl leading-snug">
                TNCD Hub, <span className="text-gold-gradient font-light italic">Coimbatore</span>
              </h2>
              <p className="text-black/60 dark:text-white/60 text-sm sm:text-base leading-relaxed max-w-xl">
                A complete stone and marble fit-out for this corporate tower — reception counters, elevator lobbies, and wall cladding, engineered and installed end-to-end by our team.
              </p>
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-6 lg:h-[640px]"
          >
            {[
              { src: "/static/real/project-tncd-building-exterior.jpg", label: "Building Exterior", lead: true },
              { src: "/static/real/project-tncd-reception-counter.jpg", label: "Reception Counter" },
              { src: "/static/real/project-tncd-black-marble-elevator.jpg", label: "Elevator Cladding" },
              { src: "/static/real/project-tncd-elevator-lobby.jpg", label: "Elevator Lobby" },
              { src: "/static/real/project-tncd-signage-wall.jpg", label: "Entrance Signage" },
            ].map((item) => (
              <motion.div
                key={item.src}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className={`relative overflow-hidden group aspect-square ${
                  item.lead ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""
                }`}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-4 left-4 text-white text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-6 lg:px-12 py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          <div className="lg:col-span-7 relative h-[600px] w-full hidden md:block">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="absolute left-0 top-0 w-[65%] h-[500px] z-10">
              <img src="/static/real/hero-marble-hall.jpg" alt="Sharma Marble Heritage" className="w-full h-full object-cover shadow-2xl filter grayscale hover:grayscale-0 transition-all duration-700" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }} className="absolute right-0 bottom-0 w-[60%] h-[350px] z-20 border-8 border-white dark:border-[#070708] shadow-2xl">
              <img src="/static/real/tile-floor-light-herringbone.jpg" alt="Master Craftsmanship" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="absolute left-[65%] top-[15%] -translate-x-1/2 -translate-y-1/2 z-30 w-32 h-32 rounded-full bg-gold-500 text-black flex items-center justify-center p-4 text-center shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              <p className="font-serif text-sm leading-tight">Serving <br/> Since <br/> 1986</p>
            </motion.div>
          </div>
          <div className="md:hidden aspect-[4/5] w-full relative mb-10">
             <img src="/static/real/hero-marble-hall.jpg" alt="Sharma Marble Heritage" className="w-full h-full object-cover shadow-2xl" />
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.3 }} className="lg:col-span-5 space-y-8 lg:pl-10">
            <div className="space-y-4">
              <span className="flex items-center space-x-3 text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">
                <span className="w-8 h-[1px] bg-gold-500"></span>
                <span>Our Heritage</span>
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
                About <br/>
                <span className="text-gold-gradient font-light italic">Us</span>
              </h2>
            </div>
            <div className="space-y-6 text-sm text-black/70 dark:text-white/70 leading-relaxed font-sans">
              <p className="font-serif text-xl md:text-2xl text-black dark:text-white leading-snug">
                "Sharma Marble Trading Company is a leading supplier of Ceramic Tiles, Granites, and Italian marbles for architects, engineers, builders and clients."
              </p>
              <p>
                Established in 1986, we are located at 370, Thadagam Main Road, K.N.G. Pudur, Coimbatore.
              </p>
              <p>
                The company has built a strong reputation for delivering high quality, aesthetic, and durable materials to enhance the beauty and functionality of architectural spaces.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DEALERS IN */}
      <section className="bg-black text-white py-24 lg:py-28 border-t border-b border-gold-500/10 relative z-10 overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />
        {/* Decorative diagonal texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #eab308 0, #eab308 1px, transparent 1px, transparent 40px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 space-y-4"
          >
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">
              <span className="w-8 h-[1px] bg-gold-500/60" />
              What We Offer
              <span className="w-8 h-[1px] bg-gold-500/60" />
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
              Dealers <span className="text-gold-gradient font-light italic">In</span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-wrap justify-center gap-4 md:gap-5"
          >
            {dealersIn.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col items-center justify-center text-center gap-4 w-[155px] sm:w-[175px] p-6 md:p-7 border border-white/10 hover:border-gold-500/50 bg-white/[0.02] hover:bg-gold-500/5 transition-colors duration-500"
                >
                  <span className="absolute top-3 right-4 text-[10px] font-bold text-white/15 group-hover:text-gold-500/60 transition-colors duration-500">
                    0{i + 1}
                  </span>
                  <div className="relative w-14 h-14 flex items-center justify-center rounded-full border border-gold-500/30 text-gold-500 group-hover:bg-gold-500 group-hover:text-black group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all duration-500 group-hover:scale-110">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/85 group-hover:text-white transition-colors duration-300 leading-snug">
                    {item.name}
                  </span>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gold-500 group-hover:w-2/3 transition-all duration-500" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* MISSION, VALUES, WHY CHOOSE US */}
      <section className="bg-[#fcfcfc] dark:bg-[#080809] py-24 border-t border-b border-black/5 dark:border-white/5 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h3 className="font-serif text-3xl">Our Mission</h3>
            <ul className="space-y-4 text-black/70 dark:text-white/70">
              <li className="flex items-start"><ArrowRight className="w-4 h-4 text-gold-500 mt-1 mr-3 shrink-0"/> To provide excellent customer service for every project.</li>
              <li className="flex items-start"><ArrowRight className="w-4 h-4 text-gold-500 mt-1 mr-3 shrink-0"/> Very competitive and lowest price in this industry.</li>
              <li className="flex items-start"><ArrowRight className="w-4 h-4 text-gold-500 mt-1 mr-3 shrink-0"/> No compromise in the quality.</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="font-serif text-3xl">Our Values</h3>
            <ul className="space-y-4 text-black/70 dark:text-white/70">
              <li className="flex items-start">
                <Shield className="w-5 h-5 text-gold-500 mt-0.5 mr-3 shrink-0"/> 
                <div>
                  <strong>Quality:</strong> Commitment to delivering superior products.
                </div>
              </li>
              <li className="flex items-start">
                <Compass className="w-5 h-5 text-gold-500 mt-0.5 mr-3 shrink-0"/> 
                <div>
                  <strong>Customer-centric approach:</strong> Focusing on client satisfaction and long term relationship.
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="font-serif text-3xl">Why Choose Us</h3>
            <ul className="space-y-4 text-black/70 dark:text-white/70">
              <li className="flex items-start"><Sparkles className="w-5 h-5 text-gold-500 mt-0.5 mr-3 shrink-0"/> Experience: Over four decades of expertise in this industry.</li>
              <li className="flex items-start"><Award className="w-5 h-5 text-gold-500 mt-0.5 mr-3 shrink-0"/> Delivering Quality products, good customer service and relationship.</li>
              <li className="flex items-start"><Award className="w-5 h-5 text-gold-500 mt-0.5 mr-3 shrink-0"/> Sister Concern: Sharma Tiles And Granites.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CLIENTS & ARCHITECTS */}
      <section id="testimonials" className="w-full py-32 relative z-10 overflow-hidden bg-black/5 dark:bg-white/5 border-t border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold"
          >
            Client Trust
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-black dark:text-white"
          >
            Our Valuable <br/><span className="text-gold-gradient font-light">Clients & Architects</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-black/60 dark:text-white/50 max-w-2xl mx-auto"
          >
            We proudly collaborate with top builders, developers, and architects across the region to bring vision to reality.
          </motion.p>
        </div>

        {/* Scrolling Clients Marquee */}
        <div className="relative w-full overflow-hidden py-6">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f7f7f7] dark:from-[#0f0f10] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f7f7f7] dark:from-[#0f0f10] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-marquee w-[200%] gap-6 md:gap-8 items-center pl-6 md:pl-8">
            {[
              "DAKSHA PROPERTIES", "GUJAN", "NIKON CONSTRUCTION", "AHWIN CONSTRUCTION", "CASA GRAND", "INFINIUM DEVELOPERS", "DIYA FOUNDATION", "UNITED LIVING SPACE", "TNCD", "INDIA BUILDERS", "A PLUS B", "SUKRA PROPERTIES", "RP CONSTRUCTION", "LANDS AND LANDS", "TIDEL NEO PARK",
              "DAKSHA PROPERTIES", "GUJAN", "NIKON CONSTRUCTION", "AHWIN CONSTRUCTION", "CASA GRAND", "INFINIUM DEVELOPERS", "DIYA FOUNDATION", "UNITED LIVING SPACE", "TNCD", "INDIA BUILDERS", "A PLUS B", "SUKRA PROPERTIES", "RP CONSTRUCTION", "LANDS AND LANDS", "TIDEL NEO PARK"
            ].map((client, idx) => (
              <div 
                key={`client-${idx}`} 
                className="group relative flex-shrink-0 w-56 md:w-64 h-24 md:h-32 flex items-center justify-center bg-white dark:bg-[#151515] shadow-sm border border-black/5 dark:border-white/5 hover:border-gold-500/50 hover:shadow-md transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="font-serif text-sm md:text-lg text-black/70 dark:text-white/70 group-hover:text-gold-500 transition-colors text-center px-4 z-10 font-bold uppercase tracking-widest leading-snug">{client}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrolling Architects Marquee (Reverse) */}
        <div className="relative w-full overflow-hidden py-6">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f7f7f7] dark:from-[#0f0f10] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f7f7f7] dark:from-[#0f0f10] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-marquee-reverse w-[200%] gap-6 md:gap-8 items-center ml-[-100%] pl-6 md:pl-8">
            {[
              "CUBOID ARCHITECTS", "A PLUS B ARCHITECTS", "HARRISON ARCHITECT", "SHIVAM ARCHITECT", "IKSHA ARCHITECTS", "JAYABAL ASSOCIATES", "ARUN AND ASSOCIATES", "DESIGN AND ARCH", "DESIGN CONSORTIUM",
              "CUBOID ARCHITECTS", "A PLUS B ARCHITECTS", "HARRISON ARCHITECT", "SHIVAM ARCHITECT", "IKSHA ARCHITECTS", "JAYABAL ASSOCIATES", "ARUN AND ASSOCIATES", "DESIGN AND ARCH", "DESIGN CONSORTIUM"
            ].map((architect, idx) => (
              <div 
                key={`arch-${idx}`} 
                className="group relative flex-shrink-0 w-56 md:w-64 h-24 md:h-32 flex items-center justify-center bg-white dark:bg-[#151515] shadow-sm border border-black/5 dark:border-white/5 hover:border-gold-500/50 hover:shadow-md transition-all duration-500 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gold-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                <span className="font-serif text-sm md:text-lg text-black/70 dark:text-white/70 group-hover:text-gold-500 transition-colors text-center px-4 z-10 font-bold uppercase tracking-widest leading-snug">{architect}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATIONS & TIMELINE BANNER */}
      <section className="bg-black text-white py-20 border-t border-b border-gold-500/10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center">
          <div className="flex flex-col items-center space-y-4 md:border-r border-white/5 md:pr-4">
            <Award className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">40+ Years</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Rich heritage of supplying premium stone</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 md:border-r border-white/5 md:pr-4">
            <Shield className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">Quality Assured</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Delivering highly aesthetic and durable materials</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <Compass className="w-10 h-10 text-gold-500 shrink-0" />
            <div>
              <h4 className="font-serif text-sm tracking-wide text-white uppercase">Coimbatore Based</h4>
              <p className="text-[10px] text-white/50 mt-0.5">Located at K.N.G. Pudur, Thadagam Main Road</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

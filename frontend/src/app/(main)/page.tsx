"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Shield,
  Sparkles,
  Award,
  Play,
  Pause,
  Volume2,
  VolumeX,
  LayoutGrid,
  Gem,
  Layers,
  Hexagon,
  Cog,
  Heart,
  Star,
  Trophy,
  MapPin,
  Clock,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedProducts from "@/components/FeaturedProducts";
import ApplicationAreas from "@/components/ApplicationAreas";

const MAPS_QUERY = "370,+Thadagam+Main+Road,+K.N.G.Pudur,+Coimbatore+-+641025";

const heroScenes = [
  { label: "Living Spaces", src: "/videos/pixabay-living-room.mp4", phrase: "Living Space Hall", duration: 15800 },
  { label: "Grand Halls", src: "/videos/pixabay-grand-marble-lobby.mp4", phrase: "Grand Marble Halls", duration: 7000 },
  { label: "Bedrooms", src: "/videos/pixabay-bedroom-interior.mp4", phrase: "Comfortable Bedrooms", duration: 23000 },
  { label: "Bathrooms", src: "/videos/pixabay-modern-bathroom-tub.mp4", phrase: "Luxury Bathroom Finishes", duration: 12300 },
  { label: "Home Exteriors", src: "/videos/pixabay-modern-exterior.mp4", phrase: "Striking Home Exteriors", duration: 10200 },
  { label: "Outdoor Spaces", src: "/videos/pixabay-luxury-home-pool.mp4", phrase: "Outdoor & Poolside Stone", duration: 7000 },
];

const categories = [
  { name: "Full Body Tiles", icon: LayoutGrid, image: "/static/real/tile-cream-polished-floor-installation.jpg", secondary: "/static/real/tile-white-grid-texture.jpg", desc: "Vitrified tiles built for heavy-traffic floors." },
  { name: "Wall Tiles", icon: Layers, image: "/static/real/tile-glossy-white-kitchen-wall.jpg", secondary: "/static/real/tile-wall-tan-subway.jpg", desc: "Elegant finishes for walls & backsplashes." },
  { name: "PVT", icon: Hexagon, image: "/static/real/tile-pvt-elevator-lobby.jpg", secondary: "/static/real/tile-pvt-diamond-gloss.jpg", desc: "Polished vitrified tiles, glass-like shine." },
  { name: "Marble", icon: Gem, image: "/static/real/marble-gray-herringbone-floor.jpg", secondary: "/static/real/marble-gray-herringbone-floor-closeup.jpg", desc: "Classic domestic marble slabs." },
  { name: "Imported Marble", icon: Sparkles, image: "/static/real/marble-imported-statuario-kitchen.jpg", secondary: "/static/real/marble-imported-calacatta.jpg", desc: "Italian & European statuario blocks." },
  { name: "Quartzite", icon: Cog, image: "/static/real/quartzite-charcoal-outdoor-walkway.jpg", secondary: "/static/real/quartzite-storm-gray.jpg", desc: "Durable stone with marble-like beauty." },
];

const valueProps = [
  { icon: Compass, title: "Extensive Selection", desc: "Tiles, marbles, granites and natural stone from India's leading brands, all under one roof." },
  { icon: Shield, title: "Exceptional Quality", desc: "No compromise in materials — every slab and tile is checked before it reaches your site." },
  { icon: Award, title: "Trusted Brand Partners", desc: "Authorised dealers for Lavish Ceramics, Parryware, RAK, Orientbell, Hindware and more." },
  { icon: Heart, title: "Customer-First Service", desc: "Competitive pricing and a team that stays with you from selection through installation." },
];

const achievements = [
  { value: "40+", label: "Years of Experience", icon: Award },
  { value: "100%", label: "Client Satisfaction", icon: Heart },
  { value: "Top", label: "Quality Products", icon: Star },
  { value: "1st", label: "In Customer Service", icon: Trophy },
];

const projectReels = [
  { name: "Tile Display Closeup", src: "/videos/tile-display-closeup.mp4", label: "Showroom" },
  { name: "Material Bays", src: "/videos/showroom-material-bays.mp4", label: "Selection" },
  { name: "Bathroom Tile Detail", src: "/videos/bathroom-tile-detail.mp4", label: "Bathrooms" },
  { name: "Counter Detail", src: "/videos/showroom-counter-detail.mp4", label: "Finishes" },
  { name: "Wall Tile Reel", src: "/videos/bn-wall-tile-reel.mp4", label: "Walls" },
  { name: "Showroom Walk Reel", src: "/videos/bn-showroom-walk-reel.mp4", label: "Walkthrough" },
  { name: "Finish Detail Reel", src: "/videos/bn-finish-detail-reel.mp4", label: "Detail" },
  { name: "Quick Material Detail", src: "/videos/bn-quick-material-detail.mp4", label: "Material" },
];

const brandsList = [
  { name: "Lavish Ceramics", category: "Tiles" },
  { name: "Parryware", category: "Sanitaryware" },
  { name: "Bonzer 7 Tiles", category: "Tiles" },
  { name: "Orientbell Tiles", category: "Tiles" },
  { name: "Hindware Italian Collection", category: "Tile Division" },
  { name: "RAK Ceramics", category: "Premium Tiles" },
];
const brands = [...brandsList, ...brandsList];

const clients = [
  "DAKSHA PROPERTIES", "GUJAN", "CASA GRAND", "INFINIUM DEVELOPERS", "DIYA FOUNDATION", "UNITED LIVING SPACE", "TNCD", "INDIA BUILDERS", "A PLUS B", "SUKRA PROPERTIES", "RP CONSTRUCTION", "LANDS AND LANDS", "TIDEL NEO PARK",
];
const architects = [
  "CUBOID ARCHITECTS", "A PLUS B ARCHITECTS", "HARRISON ARCHITECT", "SHIVAM ARCHITECT", "IKSHA ARCHITECTS", "JAYABAL ASSOCIATES", "ARUN AND ASSOCIATES", "DESIGN AND ARCH", "DESIGN CONSORTIUM",
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  const [activeScene, setActiveScene] = useState(0);
  const safeIndex = ((activeScene % heroScenes.length) + heroScenes.length) % heroScenes.length;

  useEffect(() => {
    const duration = heroScenes[safeIndex].duration;
    const timeout = setTimeout(() => {
      setActiveScene((prev) => (prev + 1) % heroScenes.length);
    }, duration);
    return () => clearTimeout(timeout);
  }, [safeIndex]);

  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: categories[0].name, message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", phone: "", email: "", interest: categories[0].name, message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const handleInquire = (categoryName: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, interest: categoryName }));
    document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative w-full overflow-hidden min-h-screen page-fade-in bg-white dark:bg-[#070708]">
      {/* HERO */}
      <section id="hero" className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden bg-black">
        <AnimatePresence mode="sync">
          <motion.video
            key={heroScenes[safeIndex].src}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: [1.06, 1.14, 1.06] }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 6.5, ease: "linear" },
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover [filter:contrast(1.14)_saturate(1.45)_brightness(1.2)]"
          >
            <source src={heroScenes[safeIndex].src} type="video/mp4" />
          </motion.video>
        </AnimatePresence>

        {/* Soft overall darkening for readability, no focused patch behind the text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

        {/* Floating light particles for a premium, mesmerizing feel */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {[
            { left: "12%", size: 5, delay: 0, duration: 9 },
            { left: "24%", size: 3, delay: 1.4, duration: 11 },
            { left: "38%", size: 4, delay: 2.6, duration: 8.5 },
            { left: "55%", size: 3, delay: 0.8, duration: 10 },
            { left: "68%", size: 5, delay: 3.2, duration: 12 },
            { left: "80%", size: 3, delay: 1.8, duration: 9.5 },
            { left: "91%", size: 4, delay: 2.2, duration: 10.5 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 rounded-full bg-brand-200/70 shadow-[0_0_8px_2px_rgba(191,219,254,0.5)]"
              style={{ left: p.left, width: p.size, height: p.size }}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: "-90vh", opacity: [0, 0.9, 0.9, 0] }}
              transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full h-full flex items-center px-6 lg:px-12">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="block font-sans text-[10px] sm:text-xs uppercase tracking-[0.5em] text-black font-semibold mb-4 [text-shadow:0_2px_10px_rgba(255,255,255,0.5)]"
            >
              Coimbatore&apos;s Trusted
            </motion.span>

            <h1
              key={heroScenes[safeIndex].phrase}
              className="font-serif italic text-3xl sm:text-4xl lg:text-5xl text-black leading-[1.15] [text-shadow:0_4px_20px_rgba(255,255,255,0.55)]"
            >
              {heroScenes[safeIndex].phrase.split(" ").map((word, i) => (
                <motion.span
                  key={word + i}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block mr-3 last:mr-0 text-black"
                >
                  {word}
                </motion.span>
              ))}
            </h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-white/40 flex items-start justify-center p-1.5"
          >
            <span className="w-1 h-1.5 rounded-full bg-brand-300" />
          </motion.div>
        </motion.div>

        {/* Rotating scene indicator */}
        <div className="absolute top-28 right-6 lg:right-12 z-10 hidden md:flex flex-col items-end gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={heroScenes[safeIndex].label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/90 [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]"
            >
              {heroScenes[safeIndex].label}
            </motion.span>
          </AnimatePresence>
          <div className="flex items-center gap-2">
            {heroScenes.map((scene, i) => (
              <button
                key={scene.src}
                type="button"
                onClick={() => setActiveScene(i)}
                aria-label={`Show ${scene.label}`}
                className="group py-2"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-300 ${
                    i === activeScene ? "w-8 bg-brand-400" : "w-4 bg-white/40 group-hover:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="relative w-full py-20 lg:py-24 bg-white dark:bg-[#080809] overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-200/40 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-300/30 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          >
            <span className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">
              <span className="w-8 h-[1px] bg-brand-500/60" />
              What We Offer
              <span className="w-8 h-[1px] bg-brand-500/60" />
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight">
              Everything You Need To Build Your <span className="text-brand-gradient">Perfect Home</span>
            </h2>
            <p className="text-sm sm:text-base text-black/55 dark:text-white/55 max-w-xl mx-auto pt-1">
              From full body and wall tiles to Italian marble, onyx and quartzite — a complete range of surfaces sourced from India&apos;s leading brands, shown the way they actually look once installed.
            </p>
            <div className="pt-3">
              <Link href="/collections" className="btn-brand-solid inline-flex items-center gap-2">
                View Our Premium Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-[0_25px_70px_rgba(15,23,42,0.08)]"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.name}
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }}
                  className="grid grid-cols-2 gap-px bg-black/10 dark:bg-white/10"
                >
                  {/* Left: name + secondary detail shot, stacked */}
                  <div className="grid grid-rows-2 gap-px bg-black/10 dark:bg-white/10">
                    <Link
                      href={`/collections?category=${encodeURIComponent(cat.name)}`}
                      className="group relative flex flex-col items-center justify-center text-center gap-2 h-32 sm:h-40 px-3 bg-white dark:bg-[#0f1420] hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors duration-300 overflow-hidden"
                    >
                      <div className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wide text-black dark:text-white leading-snug">
                        {cat.name}
                      </h3>
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-brand-500 group-hover:w-2/3 transition-all duration-300" />
                    </Link>

                    <div className="group relative h-32 sm:h-40 overflow-hidden bg-black">
                      <img
                        src={cat.secondary}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out [filter:grayscale(25%)_saturate(1.1)_contrast(1.03)] group-hover:[filter:grayscale(0%)_saturate(1.15)_contrast(1.05)]"
                      />
                    </div>
                  </div>

                  {/* Right: full-height hero shot */}
                  <div className="group relative h-64 sm:h-80 overflow-hidden bg-black">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out [filter:grayscale(25%)_saturate(1.1)_contrast(1.03)] group-hover:[filter:grayscale(0%)_saturate(1.15)_contrast(1.05)]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={handleInquire(cat.name)}
                        aria-label={`Inquire about ${cat.name}`}
                        className="w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-brand-700 hover:bg-white shadow-lg transition-transform hover:scale-110"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/collections?category=${encodeURIComponent(cat.name)}`}
                        aria-label={`Explore ${cat.name}`}
                        className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white hover:bg-brand-700 shadow-lg transition-transform hover:scale-110"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <div className="mt-10 flex justify-center">
            <Link href="/collections" className="btn-brand-outline inline-flex items-center gap-2 !text-brand-700 dark:!text-brand-300 !border-brand-500/40">
              View All Collections
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="w-full py-20 bg-[#f5f8fc] dark:bg-[#0b0f16] border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {valueProps.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  className="flex flex-col gap-4 bg-white dark:bg-[#0f1420] rounded-xl p-6 border border-black/5 dark:border-white/5"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-bold text-base text-black dark:text-white">{item.title}</h3>
                  <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <FeaturedProducts />

      {/* SHOWROOM VIDEO SPOTLIGHT */}
      <section className="relative w-full bg-brand-900">
        <div className="relative w-full min-h-[520px] lg:min-h-[620px]">
          <video ref={videoRef} autoPlay muted={videoMuted} loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover opacity-70">
            <source src="/videos/showroom-storefront.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/95 via-brand-900/60 to-brand-900/30" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full min-h-[520px] lg:min-h-[620px] flex flex-col justify-center py-16">
            <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-brand-300 font-bold mb-6">
              <span className="w-8 h-px bg-brand-300" /> Come See Us
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-xl leading-tight">
              Step Inside Our Showroom
            </h2>
            <p className="text-white/75 text-sm sm:text-base mt-5 max-w-lg leading-relaxed">
              Browse tiles, marbles and sanitaryware from India&apos;s leading brands, all under one roof at our Coimbatore showroom.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={`https://www.google.com/maps?q=${MAPS_QUERY}`}
                target="_blank"
                rel="noreferrer"
                className="btn-brand-solid inline-flex items-center gap-2"
              >
                Get Directions <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={toggleVideoPlay}
                aria-label={videoPlaying ? "Pause video" : "Play video"}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-white/25 text-white hover:border-brand-400 hover:text-brand-300 bg-black/20 backdrop-blur-sm transition-colors duration-300"
              >
                {videoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => setVideoMuted(!videoMuted)}
                aria-label={videoMuted ? "Unmute video" : "Mute video"}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-white/25 text-white hover:border-brand-400 hover:text-brand-300 bg-black/20 backdrop-blur-sm transition-colors duration-300"
              >
                {videoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT REELS */}
      <section className="bg-[#f5f8fc] dark:bg-[#0b0f16] py-20 lg:py-24 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Project Reels</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-black dark:text-white">
              Surfaces, In Real Spaces
            </h2>
            <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">
              Short motion clips from showroom selections and finished installations.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {projectReels.map((reel) => (
              <motion.div
                key={reel.src}
                variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className="group relative overflow-hidden rounded-xl bg-black min-h-[280px]"
              >
                <video autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                  <source src={reel.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/85 via-brand-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-300">{reel.label}</span>
                  <h3 className="font-sans font-semibold text-white mt-1.5 leading-tight">{reel.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VISIT US + ABOUT TEASER */}
      <section className="bg-white dark:bg-[#080809] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="space-y-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Visit Us</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-black dark:text-white">Find Our Showroom</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-sm text-black/70 dark:text-white/70">370, Thadagam Main Road, K.N.G. Pudur, Coimbatore - 641 025</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <span className="text-sm text-black/70 dark:text-white/70">Mon - Sat: 9:30 AM - 7:30 PM</span>
              </div>
            </div>
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
              <iframe
                title="Sharma Marble Trading Co. Location"
                src={`https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`}
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
          </div>

          <div className="space-y-6 lg:pl-6 lg:border-l lg:border-black/10 dark:lg:border-white/10">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Our Heritage</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-black dark:text-white">About Sharma Marble</h2>
            <p className="text-black/70 dark:text-white/70 text-sm sm:text-base leading-relaxed">
              Established in 1986, Sharma Marble Trading Company is a Wholesale Dealer of Tiles, Granites, and Italian Marbles for architects, engineers, builders and clients — built on a reputation for quality, aesthetics and durability.
            </p>
            <Link href="#about" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors">
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-brand-800 py-16 lg:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {achievements.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full border border-brand-400/40 text-brand-300 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans text-3xl lg:text-4xl font-bold text-white">{item.value}</h3>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-white/60">{item.label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* APPLICATION AREAS */}
      <ApplicationAreas />

      {/* BRAND PARTNERSHIPS */}
      <section className="w-full py-20 lg:py-24 bg-[#f5f8fc] dark:bg-[#0b0f16] border-y border-black/5 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-12 space-y-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Our Brands</span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-black dark:text-white">
            The Exclusive Tiles Showroom For
          </h2>
        </div>
        <div className="relative w-full overflow-hidden py-2">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee w-[200%] gap-5 pl-6 md:pl-10">
            {brands.map((brand, idx) => (
              <div
                key={`${brand.name}-${idx}`}
                className="shrink-0 w-64 md:w-72 flex flex-col items-center justify-center text-center gap-2 bg-white dark:bg-[#0f1420] border border-black/10 dark:border-white/10 hover:border-brand-400 rounded-xl py-8 px-6 transition-colors duration-300"
              >
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-brand-500">{brand.category}</span>
                <span className="font-sans font-bold text-base text-black dark:text-white">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECT: TNCD HUB */}
      <section className="bg-white dark:bg-[#080809] py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 space-y-3 max-w-2xl">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Featured Project</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-black dark:text-white">TNCD Hub, Coimbatore</h2>
            <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">
              A complete stone and marble fit-out for this corporate tower — reception counters, elevator lobbies, and wall cladding, engineered and installed end-to-end by our team.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[600px]"
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
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                className={`relative overflow-hidden rounded-xl group aspect-square ${item.lead ? "sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto" : ""}`}
              >
                <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/75 via-brand-900/0 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white text-xs uppercase tracking-[0.15em] font-bold">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT US */}
      <section id="about" className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 relative h-[560px] w-full hidden md:block">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className="absolute left-0 top-0 w-[65%] h-[460px] rounded-xl overflow-hidden shadow-xl z-10">
              <img src="/static/real/hero-marble-hall.jpg" alt="Sharma Marble Heritage" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.15 }} className="absolute right-0 bottom-0 w-[58%] h-[320px] rounded-xl overflow-hidden z-20 border-8 border-white dark:border-[#070708] shadow-xl">
              <img src="/static/real/tile-floor-light-herringbone.jpg" alt="Master Craftsmanship" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="absolute left-[65%] top-[14%] -translate-x-1/2 -translate-y-1/2 z-30 w-28 h-28 rounded-full bg-brand-500 text-white flex items-center justify-center p-4 text-center shadow-lg">
              <p className="font-sans text-sm font-bold leading-tight">Serving Since 1986</p>
            </motion.div>
          </div>
          <div className="md:hidden aspect-[4/5] w-full relative mb-8 rounded-xl overflow-hidden">
            <img src="/static/real/hero-marble-hall.jpg" alt="Sharma Marble Heritage" className="w-full h-full object-cover" />
          </div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay: 0.2 }} className="lg:col-span-5 space-y-6 lg:pl-8">
            <span className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">
              <span className="w-8 h-px bg-brand-500" /> Our Heritage
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white leading-tight">
              About Us
            </h2>
            <div className="space-y-5 text-sm text-black/70 dark:text-white/70 leading-relaxed">
              <p className="text-lg text-black dark:text-white font-medium leading-snug">
                &ldquo;Sharma Marble Trading Company is a Wholesale Dealer of Tiles, Granites, and Italian Marbles for architects, engineers, builders and clients.&rdquo;
              </p>
              <p>Established in 1986, we are located at 370, Thadagam Main Road, K.N.G. Pudur, Coimbatore.</p>
              <p>The company has built a strong reputation for delivering high quality, aesthetic, and durable materials to enhance the beauty and functionality of architectural spaces.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLIENTS & ARCHITECTS */}
      <section className="w-full py-20 lg:py-24 bg-[#f5f8fc] dark:bg-[#0b0f16] border-y border-black/5 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-12 text-center space-y-4">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Client Trust</span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-black dark:text-white">Our Valuable Clients &amp; Architects</h2>
          <p className="text-sm text-black/60 dark:text-white/50 max-w-2xl mx-auto">
            We proudly collaborate with top builders, developers, and architects across the region to bring vision to reality.
          </p>
        </div>

        <div className="relative w-full overflow-hidden py-3">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee w-[200%] gap-5 items-center pl-6 md:pl-8">
            {[...clients, ...clients].map((client, idx) => (
              <div key={`client-${idx}`} className="shrink-0 w-56 md:w-64 h-24 flex items-center justify-center bg-white dark:bg-[#0f1420] border border-black/10 dark:border-white/10 hover:border-brand-400 rounded-xl transition-colors duration-300">
                <span className="font-sans text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 text-center px-4">{client}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full overflow-hidden py-3">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#f5f8fc] dark:from-[#0b0f16] to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee-reverse w-[200%] gap-5 items-center ml-[-100%] pl-6 md:pl-8">
            {[...architects, ...architects].map((architect, idx) => (
              <div key={`arch-${idx}`} className="shrink-0 w-56 md:w-64 h-24 flex items-center justify-center bg-white dark:bg-[#0f1420] border border-black/10 dark:border-white/10 hover:border-brand-400 rounded-xl transition-colors duration-300">
                <span className="font-sans text-sm font-bold uppercase tracking-widest text-black/70 dark:text-white/70 text-center px-4">{architect}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="inquiry" className="bg-white dark:bg-[#080809] py-20 lg:py-24 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase text-brand-600 font-bold">Get In Touch</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-black dark:text-white">Send Us an Enquiry</h2>
            <p className="text-sm text-black/60 dark:text-white/60">Tell us about your project and we&apos;ll get back to you within one business day.</p>
          </div>

          <div className="max-w-3xl mx-auto bg-[#f5f8fc] dark:bg-[#0f1420] rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-10">
            {sent && (
              <div className="mb-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you — your enquiry has been received. We&apos;ll be in touch shortly.</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">Full Name</label>
                  <input required type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 focus:border-brand-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">Phone Number</label>
                  <input required type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91" className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 focus:border-brand-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">Email Address</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 focus:border-brand-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">Product Interest</label>
                  <select name="interest" value={form.interest} onChange={handleChange} className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 focus:border-brand-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors">
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-semibold text-black/60 dark:text-white/50 mb-2">Your Message</label>
                <textarea required name="message" rows={4} value={form.message} onChange={handleChange} placeholder="Tell us about your project, preferred material, and quantity required..." className="w-full bg-white dark:bg-black/30 border border-black/10 dark:border-white/10 focus:border-brand-500 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors resize-none" />
              </div>
              <button type="submit" className="btn-brand-solid inline-flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Enquiry
              </button>
            </form>
            <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/10 flex flex-wrap gap-6 text-sm text-black/60 dark:text-white/60">
              <a href="mailto:sharma_marbles@yahoo.in" className="flex items-center gap-2 hover:text-brand-600 transition-colors">
                <Mail className="w-4 h-4 text-brand-600" /> sharma_marbles@yahoo.in
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" /> Coimbatore, Tamil Nadu
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

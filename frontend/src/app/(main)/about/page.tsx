"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Play, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Layers, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  Maximize2,
  X,
  Clock,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoTour {
  id: string;
  title: string;
  category: string;
  src: string;
  thumbnail: string;
  duration: string;
}

const SHOWROOM_VIDEOS: VideoTour[] = [
  {
    id: "storefront",
    title: "Coimbatore Showroom Storefront & Entrance",
    category: "Store Tour",
    src: "/videos/showroom-storefront.mp4",
    thumbnail: "/static/real/showroom-exterior-entrance.jpg",
    duration: "0:15",
  },
  {
    id: "material-bays",
    title: "Granite & Marble Display Bays",
    category: "Slab Gallery",
    src: "/videos/showroom-material-bays.mp4",
    thumbnail: "/static/real/granite-display-rack-room.jpg",
    duration: "0:25",
  },
  {
    id: "slab-wall",
    title: "Italian Marble & Slab Wall Showcase",
    category: "Italian Slabs",
    src: "/videos/showroom-slab-wall-tour.mp4",
    thumbnail: "/static/real/marble-imported-statuario-kitchen.jpg",
    duration: "0:20",
  },
  {
    id: "craftsmanship",
    title: "Material Finishing & Craftsmanship Walkthrough",
    category: "Finishing",
    src: "/videos/craftsmanship-walkthrough.mp4",
    thumbnail: "/static/real/granite-staircase-closeup.jpg",
    duration: "0:22",
  },
];

const PHOTO_GALLERY = [
  {
    title: "Italian Statuario Marble Living Room",
    category: "Italian Marble",
    image: "/static/real/marble-imported-statuario-kitchen.jpg",
    desc: "Mirror-finish luxury flooring for living rooms and halls",
  },
  {
    title: "Black Galaxy Granite Kitchen Island",
    category: "Granites",
    image: "/static/real/granite-kitchen-countertop.jpg",
    desc: "Heat-resistant and scratch-proof granite countertops",
  },
  {
    title: "Vitrified Full Body Flooring Tiles",
    category: "Tiles",
    image: "/static/real/tile-white-grid-texture.jpg",
    desc: "Heavy-traffic vitrified tiles for passage & commercial lobbies",
  },
  {
    title: "Diamond Cut Exterior Wall Elevation",
    category: "Elevation Tiles",
    image: "/static/real/elevation-tile-exterior.jpg",
    desc: "Weatherproof 3D textured elevation tiles for exterior walls",
  },
  {
    title: "Rajasthan Kota Stone Courtyard",
    category: "Natural Stone",
    image: "/static/real/kota-stone-outdoor-courtyard.jpg",
    desc: "Durable natural Kota stone for outdoor, parking & hospitals",
  },
  {
    title: "Calacatta Quartz Island Countertop",
    category: "Quartz",
    image: "/static/real/quartz-countertop-island.jpg",
    desc: "Engineered quartz with seamless gold & grey veining",
  },
];

const BRANDED_PARTNERS = [
  { name: "Hindware Ceramic Tile Division", tag: "Premium Tiles", icon: "💎" },
  { name: "Bonzer7 Ceramic Tiles", tag: "Designer Tiles", icon: "✨" },
  { name: "Orientbell Ceramic Tiles", tag: "Floor & Wall", icon: "🏛️" },
  { name: "RAK Ceramics", tag: "Global Luxury", icon: "⭐" },
  { name: "Lavish Ceramics", tag: "Vitrified Slabs", icon: "💠" },
  { name: "Parryware", tag: "Sanitary & Tiles", icon: "🚿" },
  { name: "All Types of Granites", tag: "Flooring & Steps", icon: "🪨" },
  { name: "Italian Marbles", tag: "Imported Slabs", icon: "🏛️" },
  { name: "Natural Kota Stone", tag: "Rajasthan Quarreled", icon: "⛏️" },
];

const PRODUCT_APPLICATIONS = [
  {
    title: "Tiles",
    badge: "Branded Collection",
    items: [
      "Floor Tiles (Hall, Bedroom, Kitchen, Dining)",
      "Wall Tiles (Bathroom, Kitchen Wall)",
      "Elevation Tiles (Parking Wall, Exterior Wall, Compound Wall)",
      "Parking Tiles (Heavy Duty & Full Body)",
    ],
  },
  {
    title: "Granites",
    badge: "Natural & Durable",
    items: [
      "Flooring (Passage & Lobby)",
      "Staircase Steps & Riser",
      "Front Steps & Entry Porch",
      "Lift Wall & Wall Cladding",
      "Kitchen Tops & Countertops",
    ],
  },
  {
    title: "Indian & Italian Marble",
    badge: "Luxury & Heritage",
    items: [
      "Italian Marble Flooring (Hall, Dining, Bedroom)",
      "Indian Marble Flooring & Steps",
      "Staircase Steps & Front Steps",
      "Lift Wall Cladding & Feature Walls",
      "Custom Carved Wall Accents",
    ],
  },
  {
    title: "Natural Stone & Quartz",
    badge: "Commercial & Modern",
    items: [
      "Kota Stone Flooring & Steps (Rajasthan)",
      "Kota Stone Outdoor & Parking",
      "Commercial Areas (Hospitals, Colleges, Schools, Malls)",
      "Quartz Engineered Marble (Kitchen Tops & Flooring)",
    ],
  },
];

export default function AboutPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTour>(SHOWROOM_VIDEOS[0]);
  const [activePhoto, setActivePhoto] = useState<typeof PHOTO_GALLERY[0] | null>(null);

  const scrollToFooterContact = () => {
    const contactSection = document.getElementById("footer-contact-info") || document.querySelector("footer");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070709] text-slate-900 dark:text-white font-sans transition-colors duration-300">
      
      {/* 1. HERO BANNER */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-[#070709] text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#eab308_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Established in 1986 • Coimbatore, Tamil Nadu</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-brand-400 to-amber-200">Sharma Marble</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Sharma Marble Trading Company is Coimbatore’s leading wholesale dealer of premium Tiles, Granites, Italian Marbles, and Natural Stones. For four decades, we have been the trusted partner for top architects, civil engineers, builders, and homeowners.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={scrollToFooterContact}
                className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Contact Our Coimbatore Shop</span>
              </button>

              <Link
                href="/collections"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>Explore Slabs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COIMBATORE SHOP HIGHLIGHT & STATS */}
      <section className="py-16 bg-white dark:bg-[#0c0c0f] border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Our Coimbatore Destination</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                One-Stop Hub for Luxury Stones in Coimbatore
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Conveniently located on Thadagam Main Road, K.N.G. Pudur, our expansive Coimbatore showroom and stockyard showcase thousands of imported Italian marble slabs, premium Indian granites, high-traffic vitrified tiles, and natural Kota stones.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <MapPin className="w-5 h-5 text-brand-500 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Showroom Address</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    370, Thadagam Main Road, K.N.G. Pudur, Coimbatore - 641 025, Tamil Nadu
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                  <Clock className="w-5 h-5 text-brand-500 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Business Hours</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Monday - Saturday: 9:00 AM - 8:30 PM<br />Sunday: 10:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

              {/* Sister Concern */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-brand-500/10 border border-brand-500/20">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Our Sister Concern: SHARMA TILES AND GRANITES
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Expanding our wholesale reach with dedicated tile distributions and specialized project supply across South India.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-2 shadow-xl">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-400">1986</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Year Established</p>
                <p className="text-[11px] text-slate-300">40 years of wholesale legacy in stone trade</p>
              </div>

              <div className="p-6 rounded-2xl bg-brand-600 text-white space-y-2 shadow-xl">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">500+</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Live Slab Varieties</p>
                <p className="text-[11px] text-blue-50">Italian, Granite, Quartz, Kota & Tiles</p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">10K+</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Projects Supplied</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Homes, Villas, Malls & Hospitals</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 space-y-2 shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400">100%</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Direct Quarry</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Direct sourcing from Italy & Rajasthan</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SHOWROOM VIDEO SPACE */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-widest mb-2">
                <Play className="w-3.5 h-3.5 fill-brand-400" />
                <span>Video Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                Walk Through Our Coimbatore Showroom
              </h2>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                Experience our curated slab displays, granite stockyards, and tile collections virtually.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {SHOWROOM_VIDEOS.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedVideo.id === video.id
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {video.category}
                </button>
              ))}
            </div>
          </div>

          {/* Main Video Display Player */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/60 rounded-3xl p-4 sm:p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="lg:col-span-8 overflow-hidden rounded-2xl bg-black aspect-video relative shadow-inner">
              <video
                key={selectedVideo.src}
                src={selectedVideo.src}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-4 space-y-4 pr-2">
              <span className="px-3 py-1 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block">
                {selectedVideo.category}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedVideo.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Take an interactive look at our physical warehouse and slab displays located on Thadagam Main Road, Coimbatore.
              </p>
              
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>High-definition physical slab inspection</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>On-site cutting and bespoke edge profiling</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Live stock ready for immediate dispatch</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={scrollToFooterContact}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call to Schedule Visit</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PHOTO GALLERY */}
      <section className="py-20 bg-white dark:bg-[#070709]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">
              Visual Gallery
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Installed Applications & Real Stone Photos
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover how our Italian marbles, granites, vitrified tiles, and natural Kota stones look in luxury installations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PHOTO_GALLERY.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActivePhoto(item)}
                className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 aspect-[4/3] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. OUR BRANDED PRODUCTS (From Note) */}
      <section className="py-20 bg-slate-50 dark:bg-[#0c0c0f] border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">
              Authorized Brands & Stone Divisions
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Our Branded Products & Quarry Partners
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              We bring India and Italy’s most prestigious ceramic, granite, and marble brands directly to you at wholesale rates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {BRANDED_PARTNERS.map((brand) => (
              <div 
                key={brand.name}
                className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-brand-500 transition-all shadow-sm hover:shadow-md flex items-center space-x-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-2xl shrink-0">
                  {brand.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{brand.name}</h4>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">{brand.tag}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. COMPLETE PRODUCT & APPLICATION MATRIX (Handwritten Note Alignment) */}
      <section className="py-20 bg-white dark:bg-[#070709] border-t border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600 dark:text-brand-400">
              Applications & Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 dark:text-white">
              Tailored Stones for Every Space
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Complete catalog organized by applications according to our inventory specification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_APPLICATIONS.map((cat) => (
              <div 
                key={cat.title}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="px-2.5 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {cat.badge}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.title}</h3>
                  <ul className="space-y-2.5 pt-2">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/collections"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline pt-2 border-t border-slate-200 dark:border-white/10"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CONTACT COIMBATORE SHOP DIRECT CTA (Goes to footer numbers) */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-400">
                Direct Contact
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                Speak Directly with Our Coimbatore Team
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                Get immediate slab availability, wholesale price quotes, and showroom appointment guidance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <a 
                  href="tel:+919940882939"
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">O.P. Sharma</div>
                    <div className="text-[10px] text-slate-300">+91 99408 82939</div>
                  </div>
                </a>

                <a 
                  href="tel:+918870780734"
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Ranjeet (Marketing)</div>
                    <div className="text-[10px] text-slate-300">+91 88707 80734</div>
                  </div>
                </a>

                <a 
                  href="tel:+918610827837"
                  className="p-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors flex items-center gap-3"
                >
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold text-white">Manish (Sales)</div>
                    <div className="text-[10px] text-slate-300">+91 86108 27837</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center space-y-3">
              <button
                onClick={scrollToFooterContact}
                className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-brand-500/30 transition-all text-center"
              >
                View Full Contact Details in Footer ↓
              </button>
              <span className="text-[11px] text-slate-400 text-center lg:text-right">
                370, Thadagam Main Road, K.N.G. Pudur, Coimbatore
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox for Photo Gallery */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-6 bg-slate-900 border-t border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  {activePhoto.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activePhoto.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activePhoto.desc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

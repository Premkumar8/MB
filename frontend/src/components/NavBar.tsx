"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Sparkles, Heart, RefreshCw, Award, User } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { wishlist, compareList, sampleCart } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeSection, setActiveSection] = useState("hero");

  // Monitor scroll for top navbar style (if any) and intersection observer for active section
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Setup intersection observer for scroll spy
    const sections = ["hero", "showroom", "about", "portfolio", "testimonials"];
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the most intersecting entry
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by intersection ratio to get the most visible one
          visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { threshold: [0.2, 0.5, 0.8] } 
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [pathname]);

  const navLinks = [
    { name: "Collections", href: "/collections" },
    { name: "3D Showroom", href: "/showroom" },
    { name: "AI Visualizer", href: "/visualizer" },
    { name: "Blog", href: "/blog" },
    { name: "Dealers", href: "/dealers" },
    { name: "Quote Request", href: "/quote" },
  ];

  const sectionLinks = [
    { name: "Top", id: "hero" },
    { name: "Showroom", id: "showroom" },
    { name: "Heritage", id: "about" },
    { name: "Portfolio", id: "portfolio" },
    { name: "Clients", id: "testimonials" },
  ];

  return (
    <>
      {/* 
        Top Navbar (Minimal)
        Logo on top left, Actions on top right.
      */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white dark:bg-[#080809] py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-black/5 dark:border-white/5"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          {/* Logo on Top */}
          <Link href="/" className="flex items-center space-x-1 lg:space-x-2 group cursor-pointer h-10 lg:h-14">
            <div className="relative flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14">
              {/* Outer rotating ring */}
              <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] opacity-40 group-hover:opacity-100 transition-opacity duration-700" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeDasharray="15 5 5 5" />
              </svg>
              {/* Inner geometric shape (Stacked Marble Slabs) */}
              <svg className="w-6 h-6 lg:w-8 lg:h-8 drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.8)] group-hover:scale-110 transition-all duration-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#BF953F" />
                    <stop offset="25%" stopColor="#FCF6BA" />
                    <stop offset="50%" stopColor="#B38728" />
                    <stop offset="75%" stopColor="#FBF5B7" />
                    <stop offset="100%" stopColor="#AA771C" />
                  </linearGradient>
                </defs>
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#gold-gradient)" fillOpacity="0.9" stroke="url(#gold-gradient)" strokeWidth="0.5" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="url(#gold-gradient)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center ml-1">
              <span className="font-serif text-xl lg:text-3xl tracking-[0.15em] uppercase font-light text-black dark:text-white leading-none mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gold-400 group-hover:to-gold-600 transition-all duration-500">
                Sharma
              </span>
              <div className="flex items-center space-x-2">
                <span className="h-[1px] w-4 lg:w-6 bg-gold-500/50"></span>
                <span className="font-sans text-[7px] lg:text-[9px] tracking-[0.5em] uppercase text-black/60 dark:text-gold-500/80 font-semibold leading-none">
                  Marble
                </span>
              </div>
            </div>
          </Link>

          {/* Right Actions (No Black Box, Just Icons) */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Compare */}
            {compareList.length > 0 && (
              <Link
                href="/collections?compare=true"
                className="relative p-2 text-black/70 dark:text-white/70 hover:text-gold-500 transition-colors duration-300 hidden lg:block"
                title="Compare Slabs"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span className="absolute top-0 right-0 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-black/70 dark:text-white/70 hover:text-gold-500 transition-colors duration-300"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-gold-500 text-gold-500" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-black/70 dark:text-white/70 hover:text-gold-500 transition-colors duration-300"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Login / Register (Desktop) */}
            <Link
              href="/login"
              className="hidden lg:flex items-center space-x-1.5 border border-black/20 dark:border-white/20 hover:border-gold-500 hover:text-gold-500 transition-all duration-300 px-4 py-1.5 text-[10px] tracking-widest uppercase font-semibold text-black/80 dark:text-white/80"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-black dark:text-white focus:outline-none hover:text-gold-500 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 
        Right Side ScrollSpy Navigation 
        Only shown on desktop, usually useful on the homepage where sections exist.
      */}
      {pathname === "/" && (
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col space-y-6 items-end">
          {sectionLinks.map((section, i) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center justify-end relative h-4 w-40 cursor-pointer"
              >
                {/* Menu Name (Slides out from right) */}
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 20,
                    display: isActive ? "block" : "none"
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mr-6 font-sans text-xs tracking-[0.2em] uppercase font-bold text-gold-500 whitespace-nowrap drop-shadow-md"
                >
                  {section.name}
                </motion.span>
                
                {/* Dot / Line Indicator */}
                <div className="absolute right-0 flex items-center justify-center w-4 h-4">
                  <motion.div
                    animate={{
                      height: isActive ? "16px" : "4px",
                      width: isActive ? "2px" : "4px",
                      backgroundColor: isActive ? "#eab308" : (theme === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"),
                      borderRadius: isActive ? "1px" : "9999px"
                    }}
                    transition={{ duration: 0.3 }}
                    className="group-hover:bg-gold-500 group-hover:scale-125 transition-all duration-300"
                  />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-[60px] w-full bg-white/95 dark:bg-black/95 backdrop-blur-md z-40 flex flex-col justify-between p-8 border-t border-black/5 dark:border-white/5"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-serif text-2xl tracking-wider hover:text-gold-500 transition-colors duration-300 ${
                    pathname === link.href ? "text-gold-500" : "text-black/80 dark:text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex flex-col space-y-4 mt-12">
              {/* Admin/Login link removed per request */}
              <div className="text-center text-[10px] tracking-widest text-black/40 dark:text-white/40 uppercase">
                © 2026 Sharma Marble Trading Co.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

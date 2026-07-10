"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Sparkles, Heart, RefreshCw, Award } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { wishlist, compareList, sampleCart } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for premium drop shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collections", href: "/collections" },
    { name: "3D Showroom", href: "/showroom" },
    { name: "AI Visualizer", href: "/visualizer" },
    { name: "Blog", href: "/blog" },
    { name: "Dealers", href: "/dealers" },
    { name: "Quote Request", href: "/quote" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "glass-premium py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-gold-500/20"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Luxury Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="relative">
            <span className="font-serif text-xl lg:text-2xl tracking-[0.25em] uppercase font-bold text-black dark:text-white transition-colors duration-300">
              Aurelia
            </span>
            <span className="block h-[1px] w-0 group-hover:w-full bg-gold-500 transition-all duration-500 absolute bottom-0 left-0"></span>
          </div>
          <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-gold-500 pt-1.5 font-light">
            Marmi
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative font-sans text-xs tracking-[0.18em] uppercase transition-colors duration-300 hover:text-gold-500 ${
                  isActive ? "text-gold-500 font-medium" : "text-black/60 dark:text-white/60"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-500"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* Compare Badge */}
          {compareList.length > 0 && (
            <Link
              href="/collections?compare=true"
              className="relative p-2 text-black/70 dark:text-white/70 hover:text-gold-500 transition-colors duration-300"
              title="Compare Slabs"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span className="absolute top-0 right-0 bg-gold-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            </Link>
          )}

          {/* Wishlist Badge */}
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

          {/* Admin portal */}
          <Link
            href="/admin"
            className="flex items-center space-x-1.5 border border-gold-500/40 bg-gold-500/5 hover:bg-gold-500 hover:text-black transition-all duration-300 px-4 py-1.5 text-[10px] tracking-widest uppercase font-semibold text-gold-500 dark:text-gold-500 dark:hover:text-black"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>

        {/* Mobile Action Controls */}
        <div className="lg:hidden flex items-center space-x-4">
          <Link
            href="/wishlist"
            className="relative p-2 text-black/70 dark:text-white/70"
            title="Wishlist"
          >
            <Heart className={`w-4.5 h-4.5 ${wishlist.length > 0 ? "fill-gold-500 text-gold-500" : ""}`} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-gold-500 text-black text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 text-black/70 dark:text-white/70"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-black dark:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] w-full bg-white/95 dark:bg-black/95 backdrop-blur-md z-40 page-fade-in flex flex-col justify-between p-8 border-t border-black/5 dark:border-white/5">
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

          <div className="flex flex-col space-y-4">
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="w-full text-center border border-gold-500 text-gold-500 py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-gold-500 hover:text-black transition-all duration-300"
            >
              Curator Login (Admin)
            </Link>
            <div className="text-center text-[10px] tracking-widest text-black/40 dark:text-white/40 uppercase">
              © 2026 Aurelia Marmi
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

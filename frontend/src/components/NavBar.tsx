"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Heart, RefreshCw, ChevronDown, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

interface SubLink {
  name: string;
  href: string;
  desc: string;
  image?: string;
}

interface MenuItem {
  name: string;
  href: string;
  dropdown?: SubLink[];
}

const category = (name: string) => `/collections?category=${encodeURIComponent(name)}`;

const tilesDropdown: SubLink[] = [
  { name: "Full Body Tiles", href: category("Full Body Tiles"), desc: "Vitrified tiles built for heavy-traffic floors", image: "/static/real/tile-white-grid-texture.jpg" },
  { name: "Wall Tiles", href: category("Wall Tiles"), desc: "Elegant finishes for walls & backsplashes", image: "/static/real/tile-white-diamond-pattern.jpg" },
  { name: "PVT Tiles", href: category("PVT"), desc: "Polished vitrified tiles, glass-like shine", image: "/static/real/lobby-reflective-building.jpg" },
  { name: "Elevation Tiles", href: "/quote", desc: "Exterior & compound wall cladding — ask for a quote", image: "/static/real/elevation-tile-exterior.jpg" },
];

const marblesDropdown: SubLink[] = [
  { name: "Indian Marble — Flooring", href: category("Marble"), desc: "Hall, dining & bedroom marble flooring", image: "/static/real/marble-gray-herringbone-floor.jpg" },
  { name: "Indian Marble — Staircase", href: category("Marble"), desc: "Staircase & step installations", image: "/static/real/marble-gray-stair-tread-installation.jpg" },
  { name: "Italian Marble — Flooring", href: category("Imported Marble"), desc: "Statuario & imported slab flooring", image: "/static/real/marble-imported-statuario-kitchen.jpg" },
  { name: "Italian Marble — Wall Cladding", href: category("Imported Marble"), desc: "Lift walls & decorative cladding", image: "/static/real/marble-imported-carved-wall.jpg" },
  { name: "Quartz & Natural Stone", href: category("Quartz"), desc: "Durable stone for floors, parking & outdoors", image: "/static/real/quartzite-travertine-beige.jpg" },
];

const stonesDropdown: SubLink[] = [
  { name: "Granites — Flooring", href: category("Granite"), desc: "Passage & lobby flooring", image: "/static/real/granite-flooring-lobby.jpg" },
  { name: "Granites — Staircase", href: category("Granite"), desc: "Staircase & step installations", image: "/static/real/granite-staircase-closeup.jpg" },
  { name: "Granites — Kitchen Top", href: category("Granite"), desc: "Kitchen counters & table tops", image: "/static/real/granite-kitchen-countertop.jpg" },
  { name: "Granites — Wall Cladding", href: category("Granite"), desc: "Lift walls & lobby cladding", image: "/static/real/granite-wall-cladding-lobby.jpg" },
  { name: "Natural Stone (Kota) — Flooring", href: category("Kota Stone"), desc: "Hall & passage flooring", image: "/static/real/kota-stone-flooring-passage.jpg" },
  { name: "Natural Stone (Kota) — Outdoor", href: category("Kota Stone"), desc: "Courtyard & parking areas", image: "/static/real/kota-stone-outdoor-courtyard.jpg" },
  { name: "Engineering Marble (Quartz) — Kitchen Top", href: category("Quartz"), desc: "Kitchen counters", image: "/static/real/quartz-countertop-island.jpg" },
  { name: "Engineering Marble (Quartz) — Flooring", href: category("Quartz"), desc: "Hall & living room flooring", image: "/static/real/quartz-flooring-hall.jpg" },
];

const menuItems: MenuItem[] = [
  { name: "Home", href: "/" },
  { name: "Tiles", href: "/collections", dropdown: tilesDropdown },
  { name: "Marbles & Stones", href: "/collections", dropdown: marblesDropdown },
  { name: "Granites & Quartz", href: "/collections", dropdown: stonesDropdown },
  { name: "Collections", href: "/collections" },
  { name: "Contact", href: "/contact" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { wishlist, compareList } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const sections = ["hero", "showroom", "about", "portfolio", "testimonials"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
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

  useEffect(() => {
    setIsOpen(false);
    setOpenMobileGroup(null);
  }, [pathname]);

  const sectionLinks = [
    { name: "Top", id: "hero" },
    { name: "Showroom", id: "showroom" },
    { name: "Heritage", id: "about" },
    { name: "Portfolio", id: "portfolio" },
    { name: "Clients", id: "testimonials" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white dark:bg-[#080809] py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-black/5 dark:border-white/5"
            : "bg-transparent py-6 border-b border-transparent"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 flex justify-between items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 lg:space-x-2 group cursor-pointer h-10 lg:h-14 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 rounded-full bg-brand-700 group-hover:bg-brand-600 transition-colors duration-500">
              <svg className="w-6 h-6 lg:w-8 lg:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.95" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex flex-col justify-center ml-1">
              <span className="font-sans text-xl lg:text-3xl tracking-[0.1em] uppercase font-bold text-brand-800 dark:text-white leading-none mb-1 group-hover:text-brand-500 transition-colors duration-500">
                Sharma
              </span>
              <div className="flex items-center space-x-2">
                <span className="h-[1px] w-4 lg:w-6 bg-brand-500/60"></span>
                <span className="font-sans text-[7px] lg:text-[9px] tracking-[0.5em] uppercase text-black/60 dark:text-brand-400 font-semibold leading-none">
                  Marble
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center flex-1 justify-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              if (!item.dropdown) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-2.5 2xl:px-3.5 py-2 text-[10.5px] 2xl:text-[11px] tracking-[0.12em] 2xl:tracking-[0.15em] uppercase font-semibold transition-colors duration-300 whitespace-nowrap ${
                      isActive ? "text-brand-500" : "text-black/75 dark:text-white/75 hover:text-brand-500"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1 h-1 rounded-full bg-brand-500" />
                    )}
                  </Link>
                );
              }

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-2.5 2xl:px-3.5 py-2 text-[10.5px] 2xl:text-[11px] tracking-[0.12em] 2xl:tracking-[0.15em] uppercase font-semibold text-black/75 dark:text-white/75 group-hover:text-brand-500 transition-colors duration-300 whitespace-nowrap"
                  >
                    {item.name}
                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Link>

                  {/* Dropdown Panel */}
                  <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="w-96 bg-white dark:bg-[#111113] border-t-2 border-brand-500 shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-2">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="group/item flex items-center gap-3 px-3 py-2.5 hover:bg-brand-500/10 transition-colors duration-200"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden border border-black/10 dark:border-white/10 bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={sub.name}
                                className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <ArrowRight className="w-5 h-5 text-brand-500" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-black dark:text-white group-hover/item:text-brand-500 transition-colors">
                              {sub.name}
                            </div>
                            <div className="text-[11px] text-black/50 dark:text-white/50 mt-1 leading-snug truncate">
                              {sub.desc}
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 text-brand-500 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-200" />
                        </Link>
                      ))}
                      <Link
                        href={item.href}
                        className="mt-1 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white transition-colors duration-300"
                      >
                        View All {item.name}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 lg:space-x-3 2xl:space-x-4 shrink-0">
            {/* Compare */}
            {compareList.length > 0 && (
              <Link
                href="/collections?compare=true"
                className="relative p-2 text-black/70 dark:text-white/70 hover:text-brand-500 transition-colors duration-300 hidden lg:block"
                title="Compare Slabs"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span className="absolute top-0 right-0 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-black/70 dark:text-white/70 hover:text-brand-500 transition-colors duration-300"
              title="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 ? "fill-brand-500 text-brand-500" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-black/70 dark:text-white/70 hover:text-brand-500 transition-colors duration-300"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Get a Quote CTA */}
            <Link
              href="/quote"
              className="hidden lg:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 2xl:px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.55)] whitespace-nowrap"
            >
              Get a Quote
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2 text-black dark:text-white focus:outline-none hover:text-brand-500 transition-colors"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Right Side ScrollSpy Navigation (homepage only) */}
      {pathname === "/" && (
        <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col space-y-6 items-end">
          {sectionLinks.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center justify-end relative h-4 w-40 cursor-pointer"
              >
                <motion.span
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 20,
                    display: isActive ? "block" : "none"
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mr-6 font-sans text-xs tracking-[0.2em] uppercase font-bold text-brand-500 whitespace-nowrap drop-shadow-md"
                >
                  {section.name}
                </motion.span>

                <div className="absolute right-0 flex items-center justify-center w-4 h-4">
                  <motion.div
                    animate={{
                      height: isActive ? "16px" : "4px",
                      width: isActive ? "2px" : "4px",
                      backgroundColor: isActive ? "#eab308" : (theme === 'dark' ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"),
                      borderRadius: isActive ? "1px" : "9999px"
                    }}
                    transition={{ duration: 0.3 }}
                    className="group-hover:bg-brand-500 group-hover:scale-125 transition-all duration-300"
                  />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden fixed inset-0 top-[76px] w-full bg-white/98 dark:bg-black/98 backdrop-blur-md z-40 flex flex-col justify-between p-8 border-t border-black/5 dark:border-white/5 overflow-y-auto"
          >
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => {
                if (!item.dropdown) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`py-3 font-serif text-2xl tracking-wider hover:text-brand-500 transition-colors duration-300 border-b border-black/5 dark:border-white/5 ${
                        pathname === item.href ? "text-brand-500" : "text-black/80 dark:text-white/80"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                const isGroupOpen = openMobileGroup === item.name;
                return (
                  <div key={item.name} className="border-b border-black/5 dark:border-white/5">
                    <button
                      onClick={() => setOpenMobileGroup(isGroupOpen ? null : item.name)}
                      className="w-full flex items-center justify-between py-3 font-serif text-2xl tracking-wider text-black/80 dark:text-white/80"
                    >
                      {item.name}
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isGroupOpen ? "rotate-180 text-brand-500" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isGroupOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pl-4"
                        >
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2.5 text-sm tracking-wide text-black/60 dark:text-white/60 hover:text-brand-500 transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block py-2.5 text-sm font-bold tracking-wide text-brand-500"
                          >
                            View All {item.name} →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col space-y-4 mt-8">
              <Link
                href="/quote"
                onClick={() => setIsOpen(false)}
                className="w-full text-center bg-brand-500 text-white py-4 text-xs font-bold uppercase tracking-[0.2em]"
              >
                Get a Quote
              </Link>
              <div className="text-center text-[10px] tracking-widest text-black/40 dark:text-white/40 uppercase pt-2">
                © 2026 Sharma Marble Trading Co.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

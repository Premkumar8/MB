"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Welcome to the Aurelia Circle. You will receive private collection updates.");
  };

  return (
    <footer className="bg-[#09090b] text-white border-t border-gold-500/10 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-2xl tracking-[0.2em] uppercase font-bold text-white">
              Aurelia
            </span>
            <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-gold-500 pt-1.5 font-light">
              Marmi
            </span>
          </div>
          <p className="text-white/50 text-xs leading-relaxed max-w-sm">
            Curators of high-fidelity Italian Carrara, exotic Brazilian Quartzites, and backlit Iranian Onyx slabs. Tailored for signature architectural landmarks and luxury residences worldwide.
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-gold-500 hover:border-gold-500 transition-all duration-300"
            >
              <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Navigation Links Column */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold">
            Collections
          </h4>
          <ul className="space-y-3.5 text-xs text-white/60">
            <li>
              <Link href="/collections?category=Marble" className="hover:text-white transition-colors duration-200 flex items-center">
                <span>Carrara & Fine Marble</span>
                <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 hover:opacity-100 transition-opacity" />
              </Link>
            </li>
            <li>
              <Link href="/collections?category=Onyx" className="hover:text-white transition-colors duration-200 flex items-center">
                <span>Backlit Green Onyx</span>
              </Link>
            </li>
            <li>
              <Link href="/collections?category=Quartzite" className="hover:text-white transition-colors duration-200 flex items-center">
                <span>Exotic Quartzites</span>
              </Link>
            </li>
            <li>
              <Link href="/showroom" className="hover:text-white transition-colors duration-200 flex items-center">
                <span>Virtual 3D Galleries</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Showrooms Column */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold">
            Locations
          </h4>
          <ul className="space-y-4 text-xs text-white/60">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                <strong>Milan Atelier:</strong> Via Monte Napoleone 12, Milano, IT
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                <strong>Carrara Yard:</strong> Viale Galilei 40, Carrara, IT
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>+39 02 8993 1102</span>
            </li>
          </ul>
        </div>

        {/* Private Updates Column */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold">
            The Aurelia Circle
          </h4>
          <p className="text-white/50 text-xs leading-relaxed">
            Subscribe to receive private viewings of newly excavated block lots and architectural stone essays.
          </p>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              required
              placeholder="YOUR EMAIL"
              className="bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold-500/60 grow transition-colors duration-300 rounded-none"
            />
            <button
              type="submit"
              className="bg-gold-500 text-black px-4 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-white hover:text-black transition-colors duration-300 rounded-none"
            >
              Join
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-white/40 uppercase">
        <div>
          © 2026 Aurelia Marmi. All Rights Reserved.
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors duration-200">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

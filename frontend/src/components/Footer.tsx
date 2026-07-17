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
            <span className="font-serif text-2xl tracking-[0.25em] uppercase font-bold text-white">
              Sharma
            </span>
            <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-gold-500 pt-1.5 font-light">
              Marble
            </span>
          <p className="text-white/50 text-xs leading-relaxed max-w-sm">
            Sharma Marble Trading Company is a leading supplier of Ceramic Tiles, Granites, and Italian marbles for architects, engineers, builders and clients. Established in 1980.
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
            Branded Products
          </h4>
          <ul className="space-y-3.5 text-xs text-white/60">
            <li>
              <span className="hover:text-white transition-colors duration-200 flex items-center">
                Hindware & Parryware
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors duration-200 flex items-center">
                Orient Bell & Bonzer 7
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors duration-200 flex items-center">
                RAK & Lavish Ceramics
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors duration-200 flex items-center">
                Italian Marbles & Granites
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold">
            Contact Us
          </h4>
          <ul className="space-y-4 text-xs text-white/60">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                370, Thadagam Main Road, K.N.G.Pudur, Coimbatore - 641 025
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>sharma_marbles@yahoo.in</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>+91 99408 82939</span>
            </li>
            <li className="flex items-start space-x-2.5 pt-2">
              <span>
                <strong>O.P. SHARMA</strong><br/>
                Managing Director
              </span>
            </li>
          </ul>
        </div>

        {/* Sister Concern Column */}
        <div className="space-y-6">
          <h4 className="text-xs uppercase tracking-[0.25em] text-gold-500 font-semibold">
            Our Sister Concern
          </h4>
          <p className="text-white/50 text-xs leading-relaxed">
            <strong>SHARMA TILES AND GRANITES</strong>
          </p>
          <p className="text-white/50 text-xs leading-relaxed">
            Delivering the same standard of quality and customer service across our extended enterprise.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] text-white/40 uppercase">
        <div>
          © 2026 Sharma Marble Trading Co. All Rights Reserved.
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

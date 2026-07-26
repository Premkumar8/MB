"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Compass, Sparkles } from "lucide-react";

// Load showroom dynamically to prevent hydration differences
const VirtualShowroom = dynamic(() => import("@/components/3d/VirtualShowroom"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#070708] text-white">
      <Sparkles className="w-8 h-8 text-gold-500 animate-spin-slow mb-4" />
      <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/50">
        Loading 3D Atelier Showroom...
      </span>
    </div>
  ),
});

export default function ShowroomPage() {
  return (
    <div className="w-full h-[calc(100vh-80px)] relative overflow-hidden page-fade-in bg-black">
      <VirtualShowroom />
    </div>
  );
}

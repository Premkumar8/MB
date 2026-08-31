import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 animate-pulse" />
          <Loader2 className="w-9 h-9 text-blue-500 animate-spin absolute" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Loading Admin Dashboard...
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Sharma Marble Pro
          </p>
        </div>
      </div>
    </div>
  );
}

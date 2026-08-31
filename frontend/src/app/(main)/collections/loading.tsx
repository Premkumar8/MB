import React from "react";
import { Loader2 } from "lucide-react";

export default function CollectionsLoading() {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-black/50">
      <div className="relative flex flex-col items-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-brand-500/20 dark:border-brand-400/20 animate-pulse" />
          <Loader2 className="w-9 h-9 text-brand-500 animate-spin absolute" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
            Loading Catalog...
          </p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
            Sharma Marble Collections
          </p>
        </div>
      </div>
    </div>
  );
}

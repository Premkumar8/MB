"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

export default function RouteLoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [targetUrl, setTargetUrl] = useState<string>("");

  // Whenever pathname or searchParams change, route change has completed
  useEffect(() => {
    setIsLoading(false);
    setTargetUrl("");
  }, [pathname, searchParams]);

  // Intercept link clicks across the entire site for instant loading feedback
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore anchor jumps on same page, new tabs, mailto, tel, external links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's internal route
      try {
        const currentUrl = new URL(window.location.href);
        const destinationUrl = new URL(href, window.location.href);

        if (destinationUrl.origin === currentUrl.origin) {
          // If clicking exact same URL and hash, ignore
          if (
            destinationUrl.pathname === currentUrl.pathname &&
            destinationUrl.search === currentUrl.search &&
            destinationUrl.hash === currentUrl.hash
          ) {
            return;
          }

          setTargetUrl(destinationUrl.pathname);
          setIsLoading(true);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, []);

  // Safety timer to auto-dismiss if route does not complete within 4s
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-route-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
        >
          {/* Top Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-transparent overflow-hidden z-[10000]">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="w-full h-full bg-gradient-to-r from-brand-600 via-amber-400 to-brand-500 shadow-[0_0_12px_rgba(234,179,8,0.8)]"
            />
          </div>

          {/* Luxury Floating Loading Spin Badge */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 10 }}
            className="bg-white/95 dark:bg-[#111113]/95 text-slate-900 dark:text-white px-6 py-4 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex items-center space-x-3.5 backdrop-blur-xl pointer-events-auto"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-brand-500/10 text-brand-500">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-black dark:text-white">
                Loading...
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                Sharma Marble
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

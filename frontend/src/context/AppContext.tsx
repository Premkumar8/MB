"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: number;
  name: string;
  category: string;
  origin: string;
  finish: string;
  thickness: string;
  applications: string;
  description: string;
  price: number | null;
  availability: string;
  image_url: string;
  images?: string[]; // Array of additional images for the gallery
  glb_url: string | null;
  texture_url: string | null;
  roughness: number;
  metalness: number;
}

interface AppContextType {
  wishlist: Product[];
  addToWishlist: (p: Product) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  
  compareList: Product[];
  addToCompare: (p: Product) => void;
  removeFromCompare: (id: number) => void;
  isInCompareList: (id: number) => boolean;

  sampleCart: Product[];
  addToSampleCart: (p: Product) => void;
  removeFromSampleCart: (id: number) => void;
  clearSampleCart: () => void;
  isInSampleCart: (id: number) => boolean;

  isChatOpen: boolean;
  setChatOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [sampleCart, setSampleCart] = useState<Product[]>([]);
  const [isChatOpen, setChatOpen] = useState<boolean>(false);

  // Load initial states from LocalStorage on mount
  useEffect(() => {
    const savedWish = localStorage.getItem("aurelia-wishlist");
    const savedComp = localStorage.getItem("aurelia-compare");
    const savedCart = localStorage.getItem("aurelia-sample-cart");

    if (savedWish) setWishlist(JSON.parse(savedWish));
    if (savedComp) setCompareList(JSON.parse(savedComp));
    if (savedCart) setSampleCart(JSON.parse(savedCart));
  }, []);

  const addToWishlist = (p: Product) => {
    if (wishlist.some((item) => item.id === p.id)) return;
    const updated = [...wishlist, p];
    setWishlist(updated);
    localStorage.setItem("aurelia-wishlist", JSON.stringify(updated));
  };

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("aurelia-wishlist", JSON.stringify(updated));
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  const addToCompare = (p: Product) => {
    if (compareList.length >= 3) {
      alert("You can compare a maximum of 3 luxury stones at a time.");
      return;
    }
    if (compareList.some((item) => item.id === p.id)) return;
    const updated = [...compareList, p];
    setCompareList(updated);
    localStorage.setItem("aurelia-compare", JSON.stringify(updated));
  };

  const removeFromCompare = (id: number) => {
    const updated = compareList.filter((item) => item.id !== id);
    setCompareList(updated);
    localStorage.setItem("aurelia-compare", JSON.stringify(updated));
  };

  const isInCompareList = (id: number) => compareList.some((item) => item.id === id);

  const addToSampleCart = (p: Product) => {
    if (sampleCart.some((item) => item.id === p.id)) return;
    const updated = [...sampleCart, p];
    setSampleCart(updated);
    localStorage.setItem("aurelia-sample-cart", JSON.stringify(updated));
  };

  const removeFromSampleCart = (id: number) => {
    const updated = sampleCart.filter((item) => item.id !== id);
    setSampleCart(updated);
    localStorage.setItem("aurelia-sample-cart", JSON.stringify(updated));
  };

  const clearSampleCart = () => {
    setSampleCart([]);
    localStorage.removeItem("aurelia-sample-cart");
  };

  const isInSampleCart = (id: number) => sampleCart.some((item) => item.id === id);

  return (
    <AppContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        isInCompareList,
        sampleCart,
        addToSampleCart,
        removeFromSampleCart,
        clearSampleCart,
        isInSampleCart,
        isChatOpen,
        setChatOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

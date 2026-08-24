"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fallbackProducts } from "@/data/products";
import { Product, useApp } from "@/context/AppContext";
import { ArrowLeft, Heart, Loader2, MessageSquareText, Store } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const productGalleryRules = [
  {
    keywords: ["stair", "steps", "staircase"],
    images: ["/static/nh/granite-staircase-black.jpg", "/static/real/marble-gray-staircase-installation.jpg"],
  },
  {
    keywords: ["kitchen", "counter", "countertop", "backsplash", "table top", "island"],
    images: ["/static/nh/stone-kitchen-counter.jpg", "/static/nh/stone-living-kitchen.jpg"],
  },
  {
    keywords: ["parking", "outdoor", "courtyard", "walkway", "patio", "exterior", "facade", "porch"],
    images: ["/static/nh/natural-parking-courtyard.jpg", "/static/real/quartzite-charcoal-outdoor-walkway.jpg"],
  },
  {
    keywords: ["bedroom"],
    images: ["/static/nh/natural-bedroom.jpg", "/static/nh/stone-bedroom-living.jpg"],
  },
  {
    keywords: ["bathroom", "shower", "vanity", "aqua", "terrazzo", "ribbed"],
    images: ["/static/nh/stone-bathroom.jpg", "/static/nh/natural-kitchen-bath.jpg"],
  },
  {
    keywords: ["lobby", "hall", "hallway", "passage", "corridor", "elevator", "showroom"],
    images: ["/static/nh/granite-lobby-gray.jpg", "/static/nh/natural-hall-modern.jpg"],
  },
  {
    keywords: ["wall", "cladding", "feature", "panel", "mosaic", "subway", "botanical"],
    images: ["/static/nh/stone-bathroom.jpg", "/static/real/tile-stone-mosaic-display-board.jpg"],
  },
  {
    keywords: ["wood"],
    images: ["/static/real/tile-wood-look-bedroom-floor.jpg", "/static/real/tile-wood-look-bedroom-floor-alt.jpg"],
  },
  {
    keywords: ["black", "nero", "galaxy", "absolute"],
    images: ["/static/nh/granite-kitchen-black.jpg"],
  },
  {
    keywords: ["white", "statuario", "carrara", "calacatta", "crystal", "kashmir"],
    images: ["/static/nh/stone-kitchen-counter.jpg"],
  },
];

function normalizeImageUrl(imageUrl: string, useApiHost = false) {
  return useApiHost && imageUrl.startsWith("/static") ? `${API_URL}${imageUrl}` : imageUrl;
}

function getProductGallery(product: Product, useApiHost = false) {
  const productText = `${product.name} ${product.category} ${product.applications}`.toLowerCase();
  const productImages = [product.image_url, ...(product.images || [])]
    .filter(Boolean)
    .map((imageUrl) => normalizeImageUrl(imageUrl, useApiHost));
  const matchedRule = productGalleryRules.find((rule) => (
    rule.keywords.some((keyword) => productText.includes(keyword))
  ));
  const images = matchedRule
    ? [...productImages, ...matchedRule.images]
    : productImages;

  return Array.from(new Set(images)).slice(0, 5);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { wishlist, addToWishlist, removeFromWishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setMainImage("");

      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          const processed: Product = {
            ...data,
            image_url: normalizeImageUrl(data.image_url, true),
          };
          const galleryImages = getProductGallery(processed, true);
          if (!cancelled) {
            setProduct({ ...processed, images: galleryImages });
            setMainImage(galleryImages[0]);
          }
        } else {
          const found = fallbackProducts.find(p => p.id === Number(id));
          if (found && !cancelled) {
            const galleryImages = getProductGallery(found);
            setProduct({ ...found, images: galleryImages });
            setMainImage(galleryImages[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching product detail:", err);
        const found = fallbackProducts.find(p => p.id === Number(id));
        if (found && !cancelled) {
          const galleryImages = getProductGallery(found);
          setProduct({ ...found, images: galleryImages });
          setMainImage(galleryImages[0]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] dark:bg-[#080809] pt-24">
        <div className="flex flex-col items-center gap-4 text-black dark:text-white">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
          <p className="text-sm uppercase tracking-[0.25em] font-semibold text-black/60 dark:text-white/60">
            Loading product
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfcfc] dark:bg-[#080809] pt-24">
        <p className="text-black dark:text-white font-serif text-2xl">Product not found.</p>
      </div>
    );
  }

  const isFav = wishlist.some((item) => item.id === product.id);
  const toggleWishlist = () => {
    if (isFav) {
      removeFromWishlist(product.id);
      return;
    }

    addToWishlist(product);
  };

  let suggestedProducts = fallbackProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (suggestedProducts.length < 4) {
    const more = fallbackProducts
      .filter(p => p.id !== product.id && !suggestedProducts.some(sp => sp.id === p.id))
      .slice(0, 4 - suggestedProducts.length);
    suggestedProducts = [...suggestedProducts, ...more];
  }

  return (
    <div className="bg-[#fcfcfc] dark:bg-[#080809] min-h-screen text-black dark:text-white selection:bg-gold-500/30">
      <div className="pt-8 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-black/60 dark:text-white/60 hover:text-gold-500 mb-8 transition-colors text-sm uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column: Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-square bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg overflow-hidden relative">
                <img 
                  src={mainImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all ${mainImage === img ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt={`${product.name} ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info */}
            <div className="flex flex-col space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-black dark:text-white mb-4">
                  {product.name}
                </h1>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">{product.category}</span>
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">{product.finish}</span>
                  <span className="px-3 py-1 bg-black/5 dark:bg-white/10 text-[11px] uppercase tracking-widest font-semibold rounded-sm">Wall & Floor</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-b border-black/10 dark:border-white/10 py-6">
                <p className="text-sm leading-relaxed text-black/70 dark:text-white/70">
                  {product.description}
                </p>
              </div>

              {/* Works Well For */}
              <div className="pt-6">
                <h3 className="text-sm font-sans text-black/60 dark:text-white/60 mb-4">Works Well For</h3>
                <div className="flex flex-wrap gap-2">
                  {["Bedroom", "Living Room", "Table Top", "Lobby", "Reception", "Mall", "Restaurant", "Hotel", "Kitchen Platform", "Offices", "Showrooms", "Airports", "Stations", "Movie Hall", "Commercial Kitchen", "Shops", "Hospital", "Educational Institutes"].map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-black/5 dark:bg-white/10 rounded-sm text-xs text-black/80 dark:text-white/80 whitespace-nowrap">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="pt-8">
                <h3 className="font-sans text-2xl text-black/80 dark:text-white/80 mb-6">Technical Details</h3>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Size</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">800 X 3000 mm</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Finish</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.finish}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Application</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.applications}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Pattern</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">Plain</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Thickness</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">{product.thickness}</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Tiles Per Carton</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">1</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Coverage (sq ft)</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">25.8</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">Coverage (sq mt)</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium">2.4</div>
                  </div>
                  <div>
                    <div className="text-sm text-black/60 dark:text-white/60 mb-2">SAP Code</div>
                    <div className="text-base text-black/90 dark:text-white/90 font-medium uppercase">T61F252000018101</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 mt-auto">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/quote"
                    className="flex-1 h-14 flex items-center justify-center space-x-2 rounded-sm text-sm uppercase tracking-widest font-bold transition-all duration-300 bg-black dark:bg-white text-white dark:text-black hover:bg-gold-500 dark:hover:bg-gold-500 hover:text-white dark:hover:text-white"
                  >
                    <MessageSquareText className="w-5 h-5" />
                    <span>Get a Quote</span>
                  </Link>

                  <button
                    onClick={toggleWishlist}
                    className={`h-14 w-14 shrink-0 flex items-center justify-center border-2 rounded-sm transition-colors duration-300 ${isFav ? 'border-gold-500 text-gold-500' : 'border-black dark:border-white text-black dark:text-white hover:border-gold-500 hover:text-gold-500'}`}
                    title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-gold-500' : ''}`} />
                  </button>
                </div>

                <button className="w-full h-14 flex items-center justify-center space-x-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors rounded-sm text-sm uppercase tracking-widest font-bold">
                  <Store className="w-4 h-4" />
                  <span>Find a Store</span>
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Products Section */}
          {suggestedProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-black/10 dark:border-white/10">
              <div className="text-center mb-12 space-y-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-gold-500 font-bold">Discover More</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-black dark:text-white">
                  You May Also <span className="text-gold-gradient font-light italic">Like</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {suggestedProducts.map((sp) => (
                  <Link key={sp.id} href={`/products/${sp.id}`} className="group block bg-white dark:bg-[#111] rounded-lg overflow-hidden border border-black/5 dark:border-white/5 hover:border-gold-500/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden bg-[#ecebeb] dark:bg-[#1a1a1a]">
                      <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-4">
                      <div className="text-[9px] uppercase tracking-wider text-black/50 dark:text-white/50 mb-1">{sp.category}</div>
                      <h3 className="font-serif text-base text-black dark:text-white group-hover:text-gold-500 transition-colors leading-snug">{sp.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

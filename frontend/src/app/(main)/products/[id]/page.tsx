"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mergeWithAdminProducts } from "@/data/products";
import { Product, useApp } from "@/context/AppContext";
import { ArrowLeft, Heart, Loader2, MessageSquareText, Store } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type RoomGallery = {
  hall?: string;
  kitchen?: string;
  bedroom?: string;
  parking?: string;
};

type GalleryItem = {
  label: string;
  src: string;
};

const includesAny = (text: string, keywords: string[]) => (
  keywords.some((keyword) => text.includes(keyword))
);

function normalizeImageUrl(imageUrl: string) {
  if (!imageUrl) return "";
  return imageUrl;
}

const productSpecificGalleryImages: Record<string, GalleryItem[]> = {
  "statuario marble": [
    { label: "Living Hall", src: "/static/real/statuario-marble-living-hall.jpg" },
    { label: "Kitchen Island", src: "/static/real/kitchen-white-marble-island.jpg" },
    { label: "Master Suite", src: "/static/real/project-residential-bedroom.jpg" },
    { label: "Villa Portico", src: "/static/rooms/white-marble/parking.jpg" },
  ],
  "flawless white": [
    { label: "Living Hall", src: "/static/real/hero-marble-hall.jpg" },
    { label: "Kitchen Island", src: "/static/real/kitchen-white-marble-island.jpg" },
    { label: "Master Suite", src: "/static/real/project-residential-bedroom.jpg" },
    { label: "Villa Portico", src: "/static/rooms/white-marble/parking.jpg" },
  ],
  "carrara gold": [
    { label: "Living Hall", src: "/static/real/hero-marble-hall.jpg" },
    { label: "Kitchen Island", src: "/static/real/kitchen-white-marble-island.jpg" },
    { label: "Master Suite", src: "/static/real/project-residential-bedroom.jpg" },
    { label: "Villa Portico", src: "/static/rooms/white-marble/parking.jpg" },
  ],
  "beige marble": [
    { label: "Living Hall", src: "/static/rooms/beige-marble/hall.jpg" },
    { label: "Kitchen Island", src: "/static/rooms/beige-marble/kitchen.jpg" },
    { label: "Master Suite", src: "/static/rooms/beige-marble/bedroom.jpg" },
    { label: "Villa Portico", src: "/static/rooms/beige-marble/parking.jpg" },
  ],
  "calacatta viola": [
    { label: "Living Hall", src: "/static/rooms/viola-pink/hall.jpg" },
    { label: "Kitchen Island", src: "/static/rooms/viola-pink/kitchen.jpg" },
    { label: "Master Suite", src: "/static/rooms/viola-pink/bedroom.jpg" },
    { label: "Villa Portico", src: "/static/rooms/white-marble/parking.jpg" },
  ],
  "taj mahal": [
    { label: "Living Hall", src: "/static/real/quartz-flooring-hall.jpg" },
    { label: "Kitchen Island", src: "/static/real/quartz-countertop-island.jpg" },
    { label: "Master Suite", src: "/static/rooms/taj-mahal-gold/bedroom.jpg" },
    { label: "Villa Portico", src: "/static/real/quartzite-speckled-courtyard-floor.jpg" },
  ],
  "fiori di pesco carved marble": [
    { label: "Carved Slab Texture", src: "/static/real/marble-imported-carved-wall.jpg" },
    { label: "Grand Feature Wall", src: "/static/real/fiori-di-pesco-living-hall.jpg" },
    { label: "Peach Vein Detail", src: "/static/real/marble-pink-rosa.jpg" },
    { label: "Villa Portico", src: "/static/rooms/white-marble/parking.jpg" },
  ],
  "gray marble staircase installation": [
    { label: "Living Hall", src: "/static/nh/gray-marble-hall.jpg" },
    { label: "Kitchen", src: "/static/nh/gray-marble-kitchen.jpg" },
    { label: "Master Suite", src: "/static/nh/gray-marble-bedroom.jpg" },
    { label: "Driveway", src: "/static/nh/gray-marble-parking.jpg" },
  ],
};

const defaultRoomGallery: Required<RoomGallery> = {
  hall: "/static/rooms/white-marble/hall.jpg",
  kitchen: "/static/rooms/white-marble/kitchen.jpg",
  bedroom: "/static/rooms/white-marble/bedroom.jpg",
  parking: "/static/rooms/white-marble/parking.jpg",
};

const materialRoomGalleries: { keywords: string[]; images: RoomGallery }[] = [
  {
    keywords: ["carrara", "statuario", "calacatta", "crystal", "flawless", "kashmir", "rak white", "lyra white", "canis white", "nyota white", "white"],
    images: {
      hall: "/static/real/hero-marble-hall.jpg",
      kitchen: "/static/real/kitchen-white-marble-island.jpg",
      bedroom: "/static/real/project-residential-bedroom.jpg",
      parking: "/static/rooms/white-marble/parking.jpg",
    },
  },
  {
    keywords: ["black", "nero", "galaxy", "absolute", "saint laurent", "charcoal", "estara"],
    images: {
      hall: "/static/real/hero-office-lobby.jpg",
      kitchen: "/static/nh/granite-kitchen-black.jpg",
      bedroom: "/static/real/bedroom-minimal-modern.jpg",
      parking: "/static/real/quartzite-charcoal-outdoor-walkway.jpg",
    },
  },
  {
    keywords: ["gray marble", "grey marble", "ash gray", "ash grey", "gray herringbone", "grey herringbone", "ice rock", "steel grey", "steel gray", "storm gray", "silver wave", "gray", "grey"],
    images: {
      hall: "/static/nh/gray-marble-hall.jpg",
      kitchen: "/static/nh/gray-marble-kitchen.jpg",
      bedroom: "/static/nh/gray-marble-bedroom.jpg",
      parking: "/static/nh/gray-marble-parking.jpg",
    },
  },
  {
    keywords: ["beige", "cream", "crema", "botticino", "diano", "travertine", "shell", "breccia", "tan brown", "lyra crema"],
    images: {
      hall: "/static/rooms/beige-marble/hall.jpg",
      kitchen: "/static/rooms/beige-marble/kitchen.jpg",
      bedroom: "/static/rooms/beige-marble/bedroom.jpg",
      parking: "/static/rooms/beige-marble/parking.jpg",
    },
  },
  {
    keywords: ["taj mahal", "giallo", "siena", "gold", "yellow"],
    images: {
      hall: "/static/real/quartz-flooring-hall.jpg",
      kitchen: "/static/real/quartz-countertop-island.jpg",
      bedroom: "/static/rooms/taj-mahal-gold/bedroom.jpg",
      parking: "/static/real/quartzite-speckled-courtyard-floor.jpg",
    },
  },
  {
    keywords: ["pink", "rosa", "viola", "purple", "aubergine", "ruby", "red"],
    images: {
      hall: "/static/rooms/viola-pink/hall.jpg",
      kitchen: "/static/rooms/viola-pink/kitchen.jpg",
      bedroom: "/static/rooms/viola-pink/bedroom.jpg",
      parking: "/static/rooms/viola-pink/parking.jpg",
    },
  },
  {
    keywords: ["green", "kota green", "kota"],
    images: {
      hall: "/static/real/kota-stone-flooring-passage.jpg",
      kitchen: "/static/nh/natural-kitchen-bath.jpg",
      bedroom: "/static/nh/natural-bedroom.jpg",
      parking: "/static/real/kota-stone-outdoor-courtyard.jpg",
    },
  },
  {
    keywords: ["wood", "timber", "plank", "floral"],
    images: {
      hall: "/static/real/tile-wood-look-floor-installation.jpg",
      kitchen: "/static/rooms/wood-look/kitchen.jpg",
      bedroom: "/static/real/tile-wood-look-bedroom-floor.jpg",
      parking: "/static/rooms/wood-look/parking.jpg",
    },
  },
  {
    keywords: ["pvt", "gloss", "polished vitrified", "salon", "showroom", "corridor", "perspective shine", "diamond gloss"],
    images: {
      hall: "/static/real/tile-pvt-perspective-shine.jpg",
      kitchen: "/static/real/hero-kitchen-tiles.jpg",
      bedroom: "/static/real/tile-cream-polished-floor-room.jpg",
      parking: "/static/rooms/pvt-gloss/parking.jpg",
    },
  },
  {
    keywords: ["aqua", "blue", "azulejo", "mosaic", "patchwork", "subway", "cafe", "decorative", "pattern", "checkerboard", "monochrome", "speckled", "terrazzo", "medallion", "wall"],
    images: {
      hall: "/static/real/tile-medallion-inlay-floor.jpg",
      kitchen: "/static/real/tile-glossy-white-kitchen-wall.jpg",
      bedroom: "/static/real/tile-botanical-matte-wall.jpg",
      parking: "/static/rooms/decorative/parking.jpg",
    },
  },
];

const roomLabels: Record<keyof RoomGallery, string> = {
  hall: "Living Hall",
  kitchen: "Kitchen Island",
  bedroom: "Master Suite",
  parking: "Villa Portico",
};

const getRoomGalleryItems = (productText: string, rooms: (keyof RoomGallery)[]) => {
  const materialGallery = materialRoomGalleries.find((gallery) => includesAny(productText, gallery.keywords));
  if (!materialGallery) {
    return [];
  }

  return rooms.flatMap((room) => (
    materialGallery.images[room] ? [{ label: roomLabels[room], src: materialGallery.images[room] }] : []
  ));
};

const getCompleteRoomGalleryItems = (productText: string) => {
  const matchedItems = getRoomGalleryItems(productText, ["hall", "kitchen", "bedroom", "parking"]);
  const byLabel = new Map(matchedItems.map((item) => [item.label, item.src]));

  return ["Hall", "Kitchen", "Bedroom", "Parking"].map((label) => ({
    label,
    src: byLabel.get(label) || defaultRoomGallery[label.toLowerCase() as keyof RoomGallery],
  }));
};

function uniqueGalleryItems(items: GalleryItem[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.src)) {
      return false;
    }

    seen.add(item.src);
    return true;
  });
}

function getProductGalleryItems(product: Product): GalleryItem[] {
  // 1. Explicit specific product gallery overrides
  const productSpecificImages = productSpecificGalleryImages[product.name.toLowerCase()];
  if (productSpecificImages) {
    return uniqueGalleryItems(productSpecificImages).slice(0, 4);
  }

  // 2. Parse and normalize custom images
  let customImages: string[] = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    customImages = product.images.map(normalizeImageUrl).filter(Boolean);
  } else if (typeof (product as any).images === "string" && (product as any).images.trim()) {
    try {
      const parsed = JSON.parse((product as any).images);
      if (Array.isArray(parsed)) {
        customImages = parsed.map(normalizeImageUrl).filter(Boolean);
      }
    } catch {
      // not json
    }
  }

  const isWallTileOrExternal = 
    product.category?.toLowerCase().includes("wall tile") || 
    product.category?.toLowerCase().includes("tile") ||
    product.image_url?.includes("/static/lakshmi/") ||
    customImages.some((img) => img.includes("/static/lakshmi/"));

  // 3. If product has its own photos (from scrape or uploaded), use ONLY these photos!
  if (customImages.length > 0) {
    const isMarbleRoomSuite = !isWallTileOrExternal && customImages.length === 4 && 
      customImages.some((img) => img.includes("/rooms/"));

    return uniqueGalleryItems(
      customImages.map((src, idx) => {
        if (isMarbleRoomSuite) {
          const roomLabels = ["Hall", "Kitchen", "Bedroom", "Parking"];
          return { label: roomLabels[idx] || `View ${idx + 1}`, src };
        }
        
        if (customImages.length === 1) {
          return { label: "Tile View", src };
        }
        const tileLabels = ["Tile Face", "Pattern Detail", "Room Layout", "Texture View"];
        return { label: tileLabels[idx] || `View ${idx + 1}`, src };
      })
    );
  }

  // 4. For Wall Tiles or any product with an image, NEVER inject generic hall/kitchen/bedroom/parking rooms!
  if (isWallTileOrExternal || product.image_url) {
    return [{ label: "Tile View", src: normalizeImageUrl(product.image_url || "/static/real/elevation-tiles-facade.jpg") }];
  }

  // 5. Fallback only for general marble stone slabs with no photos
  const productText = `${product.name} ${product.category} ${product.applications} ${product.description || ""}`.toLowerCase();
  return uniqueGalleryItems(getCompleteRoomGalleryItems(productText)).slice(0, 4);
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { wishlist, addToWishlist, removeFromWishlist } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null);
      setMainImage("");
      setGalleryItems([]);

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 3500);

      try {
        const res = await fetch(`${API_URL}/api/products/${id}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          const rawImages: any = data.images;
          let imageList: string[] = [];
          if (Array.isArray(rawImages)) {
            imageList = rawImages;
          } else if (typeof rawImages === "string") {
            try {
              const parsed = JSON.parse(rawImages);
              imageList = Array.isArray(parsed) ? parsed : [rawImages];
            } catch {
              imageList = [rawImages];
            }
          }
          const processed: Product = {
            ...data,
            images: imageList,
            image_url: normalizeImageUrl(data.image_url),
          };
          const nextGalleryItems = getProductGalleryItems(processed);
          if (!cancelled) {
            setProduct({ ...processed, images: nextGalleryItems.map((item) => item.src) });
            setGalleryItems(nextGalleryItems);
            setMainImage(nextGalleryItems[0]?.src || processed.image_url);
          }
        } else {
          const found = mergeWithAdminProducts([]).find(p => p.id === Number(id));
          if (found && !cancelled) {
            const rawImages: any = found.images;
            let imageList: string[] = [];
            if (Array.isArray(rawImages)) {
              imageList = rawImages;
            } else if (typeof rawImages === "string") {
              try {
                const parsed = JSON.parse(rawImages);
                imageList = Array.isArray(parsed) ? parsed : [rawImages];
              } catch {
                imageList = [rawImages];
              }
            }
            const processed: Product = {
              ...found,
              images: imageList,
              image_url: normalizeImageUrl(found.image_url),
            };
            const nextGalleryItems = getProductGalleryItems(processed);
            setProduct({ ...processed, images: nextGalleryItems.map((item) => item.src) });
            setGalleryItems(nextGalleryItems);
            setMainImage(nextGalleryItems[0]?.src || processed.image_url);
          }
        }
      } catch {
        const found = mergeWithAdminProducts([]).find(p => p.id === Number(id));
        if (found && !cancelled) {
          const rawImages: any = found.images;
          let imageList: string[] = [];
          if (Array.isArray(rawImages)) {
            imageList = rawImages;
          } else if (typeof rawImages === "string") {
            try {
              const parsed = JSON.parse(rawImages);
              imageList = Array.isArray(parsed) ? parsed : [rawImages];
            } catch {
              imageList = [rawImages];
            }
          }
          const processed: Product = {
            ...found,
            images: imageList,
            image_url: normalizeImageUrl(found.image_url),
          };
          const nextGalleryItems = getProductGalleryItems(processed);
          setProduct({ ...processed, images: nextGalleryItems.map((item) => item.src) });
          setGalleryItems(nextGalleryItems);
          setMainImage(nextGalleryItems[0]?.src || processed.image_url);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }

        window.clearTimeout(timeoutId);
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

  const catalogProducts = mergeWithAdminProducts([]);
  let suggestedProducts = catalogProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  if (suggestedProducts.length < 4) {
    const more = catalogProducts
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
              
              {galleryItems.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {galleryItems.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(item.src)}
                      className={`aspect-square overflow-hidden rounded-md border-2 transition-all relative ${mainImage === item.src ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={item.src} alt={`${product.name} ${item.label}`} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/65 px-1.5 py-1 text-[9px] uppercase tracking-wider font-semibold text-white truncate">
                        {item.label}
                      </span>
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

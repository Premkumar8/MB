import { Product } from "@/context/AppContext";

export const ADMIN_PRODUCTS_STORAGE_KEY = "sharma-admin-products";
export const ADMIN_DELETED_PRODUCTS_STORAGE_KEY = "sharma-admin-deleted-product-ids";

export function getStoredAdminProducts(): Product[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredAdminProducts(products: Product[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    try {
      const trimmed = products.slice(0, 5);
      window.localStorage.setItem(ADMIN_PRODUCTS_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (secondError) {
      console.warn("Could not write all products to localStorage due to browser quota:", secondError);
    }
  }
}

export function getDeletedAdminProductIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawIds = window.localStorage.getItem(ADMIN_DELETED_PRODUCTS_STORAGE_KEY);
    if (!rawIds) {
      return [];
    }

    const parsedIds = JSON.parse(rawIds);
    return Array.isArray(parsedIds) ? parsedIds.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export function saveDeletedAdminProductIds(productIds: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_DELETED_PRODUCTS_STORAGE_KEY, JSON.stringify(Array.from(new Set(productIds))));
}

export function mergeWithAdminProducts(serverProducts: Product[]): Product[] {
  const adminProducts = getStoredAdminProducts();
  const deletedIds = new Set(getDeletedAdminProductIds());
  const mergedMap = new Map<number, Product>();
  
  fallbackProducts.forEach((p) => {
    if (!deletedIds.has(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  serverProducts.forEach((p) => {
    if (!deletedIds.has(p.id)) {
      mergedMap.set(p.id, p);
    }
  });

  adminProducts.forEach((p) => {
    if (!deletedIds.has(p.id)) {
      const existing = mergedMap.get(p.id);
      if (existing && p.image_url?.startsWith("data:") && !existing.image_url?.startsWith("data:")) {
        mergedMap.set(p.id, {
          ...p,
          image_url: existing.image_url,
          images: existing.images || p.images,
        });
      } else {
        mergedMap.set(p.id, p);
      }
    }
  });

  return Array.from(mergedMap.values());
}

export function mergeWithFallbackProducts(serverProducts: Product[]): Product[] {
  return mergeWithAdminProducts(serverProducts);
}

export const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Carrara Gold",
    category: "Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Countertops, Wall Cladding, Bathrooms",
    description: "Quarried from the Apuan Alps in Carrara, Italy, this legendary marble features a striking white background with prominent gold and gray veins, offering a warm and timeless elegance.",
    price: 185.00,
    availability: "In Stock",
    image_url: "/static/real/marble-white-carrara.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    glb_url: "/static/seed/carrara_gold.glb",
    texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.15,
    metalness: 0.05,
  },
  {
    id: 2,
    name: "Nero Marquina",
    category: "Marble",
    origin: "Spain",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Accent Walls, Fireplaces",
    description: "A high-quality black stone marble extracted from the region of Markina, Northern Spain. The deep black color contrasts sharply with white calcite veins, embodying true architectural drama.",
    price: 140.00,
    availability: "In Stock",
    image_url: "/static/real/marble-black-nero.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ],
    glb_url: "/static/seed/nero_marquina.glb",
    texture_url: "/static/seed/textures/nero_marquina_diff.jpg",
    roughness: 0.12,
    metalness: 0.1,
  },
  {
    id: 4,
    name: "Calacatta Viola",
    category: "Marble",
    origin: "Italy",
    finish: "Honed",
    thickness: "3cm",
    applications: "Kitchen Islands, Credenzas, Vanity Tops",
    description: "One of the oldest quarried marbles, Calacatta Viola features bold, rich purple-burgundy veins flowing through a creamy white canvas. Highly sought after by modern luxury designers.",
    price: 245.00,
    availability: "In Stock",
    image_url: "/static/seed/calacatta_viola.jpg",
    images: [
      "/static/rooms/viola-pink/hall.jpg",
      "/static/rooms/viola-pink/kitchen.jpg",
      "/static/rooms/viola-pink/bedroom.jpg",
      "/static/rooms/viola-pink/parking.jpg"
    ],
    glb_url: "/static/seed/calacatta_viola.glb",
    texture_url: "/static/seed/textures/calacatta_viola_diff.jpg",
    roughness: 0.3,
    metalness: 0.05,
  },
  {
    id: 5,
    name: "Taj Mahal",
    category: "Quartz",
    origin: "Brazil",
    finish: "Leathered",
    thickness: "3cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "Offering the look of marble with the structural strength of granite, Taj Mahal Quartzite is quarried in Brazil and exhibits soft white background tones with delicate gold-brown veining.",
    price: 210.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-travertine-beige.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/real/quartz-countertop-island.jpg",
      "/static/rooms/taj-mahal-gold/bedroom.jpg",
      "/static/real/quartzite-speckled-courtyard-floor.jpg"
    ],
    glb_url: "/static/seed/taj_mahal.glb",
    texture_url: "/static/seed/textures/taj_mahal_diff.jpg",
    roughness: 0.45,
    metalness: 0.02,
  },
  {
    id: 6,
    name: "Statuario Soft Balcony Tiles",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Color: Whites. Premium full body tiles.",
    price: 48.00,
    availability: "In Stock",
    image_url: "/static/real/tile-floor-bright-white.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    glb_url: "/static/seed/carrara_gold.glb",
    texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.2,
    metalness: 0.05,
  },
  {
    id: 7,
    name: "Estara Nero Floor Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "600x1200 mm",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Premium black full body tiles.",
    price: 76.00,
    availability: "In Stock",
    image_url: "/static/real/granite-black-veined.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ],
    glb_url: "/static/seed/nero_marquina.glb",
    texture_url: "/static/seed/textures/nero_marquina_diff.jpg",
    roughness: 0.15,
    metalness: 0.1,
  },
  {
    id: 8,
    name: "Statuario Soft Full Body Slab",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Premium full body slab.",
    price: 150.00,
    availability: "In Stock",
    image_url: "/static/real/marble-white-countertop-gold.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    glb_url: "/static/seed/carrara_gold.glb",
    texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.2,
    metalness: 0.05,
  },
  {
    id: 9,
    name: "Saint Laurent Full Body Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Color: Blacks. Premium full body tiles.",
    price: 250.00,
    availability: "In Stock",
    image_url: "/static/real/granite-black-veined.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ],
    glb_url: "/static/seed/nero_marquina.glb",
    texture_url: "/static/seed/textures/nero_marquina_diff.jpg",
    roughness: 0.1,
    metalness: 0.1,
  },
  {
    id: 10,
    name: "Breccia Atlanta Full Body Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Color: Beige. Premium full body tiles.",
    price: 40.00,
    availability: "In Stock",
    image_url: "/static/real/tile-floor-beige-large.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ],
    glb_url: "/static/seed/taj_mahal.glb",
    texture_url: "/static/seed/textures/taj_mahal_diff.jpg",
    roughness: 0.3,
    metalness: 0.05,
  },
  {
    id: 11,
    name: "Ice Rock Stone Full Body Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Color: Grays. Premium full body tiles.",
    price: 60.00,
    availability: "In Stock",
    image_url: "/static/real/marble-gray-floor-plain.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ],
    glb_url: "/static/seed/carrara_gold.glb",
    texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.4,
    metalness: 0.02,
  },
  {
    id: 12,
    name: "Crystal White Full Body Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "Varies",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Color: Grays. Premium full body tiles.",
    price: 93.00,
    availability: "In Stock",
    image_url: "/static/real/marble-white-bold-veins.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    glb_url: "/static/seed/carrara_gold.glb",
    texture_url: "/static/seed/textures/carrara_gold_diff.jpg",
    roughness: 0.1,
    metalness: 0.05,
  },
  {
    id: 200,
    name: "Lyra White",
    category: "Full Body Tiles",
    price: 350,
    image_url: "/static/somany/lyra-white_1.webp",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    origin: "India",
    finish: "Full Polished",
    thickness: "1200 X 1800 mm",
    availability: "In Stock",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Redefine high-footfall environments with [Tile Name] from the Ultra Charge Collection. Featuring advanced double-layer infusion for enhanced pattern depth and exceptional thickness, this tile is built for longevity and heavy-duty performance. With its anti-stain properties and elegant glossy finish, [Tile Name] provides a resilient, eco-friendly surface that seamlessly blends industrial strength with sophisticated modern style."
  },
  {
    id: 201,
    name: "Canis White",
    category: "Full Body Tiles",
    price: 351,
    image_url: "/static/somany/canis-white_1.webp",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    origin: "India",
    finish: "Full Polished",
    thickness: "1200 X 1800 mm",
    availability: "In Stock",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Redefine high-footfall environments with [Tile Name] from the Ultra Charge Collection. Featuring advanced double-layer infusion for enhanced pattern depth and exceptional thickness, this tile is built for longevity and heavy-duty performance. With its anti-stain properties and elegant glossy finish, [Tile Name] provides a resilient, eco-friendly surface that seamlessly blends industrial strength with sophisticated modern style."
  },
  {
    id: 202,
    name: "Lyra Crema",
    category: "Full Body Tiles",
    price: 352,
    image_url: "/static/somany/lyra-crema_1.webp",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ],
    origin: "India",
    finish: "Full Polished",
    thickness: "1200 X 1800 mm",
    availability: "In Stock",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Redefine high-footfall environments with [Tile Name] from the Ultra Charge Collection. Featuring advanced double-layer infusion for enhanced pattern depth and exceptional thickness, this tile is built for longevity and heavy-duty performance. With its anti-stain properties and elegant glossy finish, [Tile Name] provides a resilient, eco-friendly surface that seamlessly blends industrial strength with sophisticated modern style."
  },
  {
    id: 203,
    name: "Nyota White",
    category: "Full Body Tiles",
    price: 353,
    image_url: "/static/somany/nyota-white_1.webp",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ],
    origin: "India",
    finish: "Full Polished",
    thickness: "1200 X 1800 mm",
    availability: "In Stock",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "Redefine high-footfall environments with [Tile Name] from the Ultra Charge Collection. Featuring advanced double-layer infusion for enhanced pattern depth and exceptional thickness, this tile is built for longevity and heavy-duty performance. With its anti-stain properties and elegant glossy finish, [Tile Name] provides a resilient, eco-friendly surface that seamlessly blends industrial strength with sophisticated modern style."
  },
  {
    id: 204,
    name: "Botticino Beige Marble",
    category: "Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Wall Cladding, Vanity Tops",
    description: "A warm beige Italian marble with soft linear veining, prized for its understated elegance in classical and contemporary interiors alike.",
    price: 165.00,
    availability: "In Stock",
    image_url: "/static/real/marble-beige-botticino.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 205,
    name: "Rosa Perlino Marble",
    category: "Marble",
    origin: "Turkey",
    finish: "Polished",
    thickness: "2cm",
    applications: "Feature Walls, Vanity Tops, Decorative Panels",
    description: "A vivid rose-pink marble with fine white veining, delivering a bold, romantic statement for accent walls and luxury bathrooms.",
    price: 275.00,
    availability: "In Stock",
    image_url: "/static/real/marble-pink-rosa.jpg",
    images: [
      "/static/rooms/viola-pink/hall.jpg",
      "/static/rooms/viola-pink/kitchen.jpg",
      "/static/rooms/viola-pink/bedroom.jpg",
      "/static/rooms/viola-pink/parking.jpg"
    ]
  },
  {
    id: 206,
    name: "Giallo Siena Marble",
    category: "Marble",
    origin: "Italy",
    finish: "Honed",
    thickness: "3cm",
    applications: "Countertops, Flooring, Fireplace Surrounds",
    description: "A golden-beige marble streaked with dramatic dark veining, quarried in Siena and favored for statement countertops and flooring.",
    price: 230.00,
    availability: "In Stock",
    image_url: "/static/real/marble-gold-siena.jpg",
    images: [
      "/static/real/quartz-flooring-hall.jpg",
      "/static/real/quartz-countertop-island.jpg",
      "/static/rooms/taj-mahal-gold/bedroom.jpg",
      "/static/real/quartzite-speckled-courtyard-floor.jpg"
    ]
  },
  {
    id: 212,
    name: "Silver Wave Quartzite",
    category: "Quartz",
    origin: "Brazil",
    finish: "Leathered",
    thickness: "3cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A silvery-grey quartzite with soft wave-like movement, combining granite-level durability with the elegance of natural stone.",
    price: 195.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-silver-wave.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 213,
    name: "Storm Gray Quartzite",
    category: "Quartz",
    origin: "India",
    finish: "Honed",
    thickness: "2cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A dense charcoal-grey quartzite with a fine, uniform texture, well suited to both interior floors and exterior cladding.",
    price: 175.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-storm-gray.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 214,
    name: "Shell Beige Quartzite",
    category: "Quartz",
    origin: "Brazil",
    finish: "Polished",
    thickness: "3cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A soft beige quartzite flecked with natural fossil-like inclusions, giving countertops a warm, organic character.",
    price: 205.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-shell-beige.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 215,
    name: "Fossil Stone Quartzite",
    category: "Quartz",
    origin: "India",
    finish: "Honed",
    thickness: "2cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "Subtle fossil imprints and fine veining run through this earthy quartzite, adding quiet texture to floors and walls.",
    price: 180.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-fossil-stone.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 216,
    name: "Quartzite Checkerboard Floor Tile",
    category: "Quartz",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "Quartzite slabs cut and laid in a classic checkerboard pattern, built for heavy-footfall hallways and grand entrances.",
    price: 190.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-checkered-floor.jpg",
    images: [
      "/static/real/tile-pvt-checkerboard-1.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 217,
    name: "Calacatta Imported Marble",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "Genuine Italian Calacatta marble with soft grey veining on a bright white ground, imported for premium flooring and countertop projects.",
    price: 380.00,
    availability: "In Stock",
    image_url: "/static/real/marble-imported-calacatta.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 218,
    name: "Statuario Kitchen Marble",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "Classic Statuario marble, quarried in Italy and finished to a bright polish, ideal for kitchen backsplashes and worktops.",
    price: 395.00,
    availability: "In Stock",
    image_url: "/static/real/marble-imported-statuario-kitchen.jpg",
    images: [
      "/static/real/marble-imported-curtain-hall.jpg",
      "/static/real/marble-imported-statuario-kitchen.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 219,
    name: "Diano Reale Marble",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "A warm cream Italian marble threaded with fine golden veining, offering a softer alternative to the classic whites.",
    price: 340.00,
    availability: "In Stock",
    image_url: "/static/real/marble-imported-diano-reale.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 220,
    name: "Imported Marble Showroom Series",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "Varies",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "A curated series of imported marble and natural stone panels displayed together, showcasing the range available for bespoke projects.",
    price: 260.00,
    availability: "In Stock",
    image_url: "/static/real/marble-imported-showroom.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 221,
    name: "Fiori Di Pesco Carved Marble",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Carved / CNC Finish",
    thickness: "2cm",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "Imported marble CNC-carved into a fine floral relief pattern, designed as a dramatic backlit feature wall for lobbies and hotels.",
    price: 420.00,
    availability: "Limited",
    image_url: "/static/real/marble-imported-carved-wall.jpg",
    images: [
      "/static/real/marble-imported-carved-wall.jpg",
      "/static/real/fiori-di-pesco-living-hall.jpg",
      "/static/real/marble-pink-rosa.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 222,
    name: "Curtain Hall Imported Marble",
    category: "Imported Marble",
    origin: "Italy",
    finish: "Polished",
    thickness: "2cm",
    applications: "Flooring, Staircase, Steps, Wall Cladding, Wall, Lift Wall, Bathrooms, Countertops",
    description: "A bright white imported marble with soft grey veining, finished to a high gloss for luminous hallways and reception floors.",
    price: 350.00,
    availability: "In Stock",
    image_url: "/static/real/marble-imported-curtain-hall.jpg",
    images: [
      "/static/real/marble-imported-curtain-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 223,
    name: "Glossy White Square Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy",
    thickness: "8mm",
    applications: "Kitchen Walls, Bathroom Walls",
    description: "A clean square-format wall tile in glossy white, with a soft embossed relief that catches the light for subtle texture.",
    price: 32.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-white-square.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/tile-glossy-white-kitchen-wall.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 224,
    name: "Tan Subway Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "8mm",
    applications: "Kitchen Backsplash, Bathroom Walls",
    description: "A warm tan subway-style wall tile laid in a classic running-bond pattern, bringing texture and warmth to kitchens and baths.",
    price: 28.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-tan-subway.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/real/tile-wall-tan-subway.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 225,
    name: "Ruby Red Mosaic Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy",
    thickness: "6mm",
    applications: "Feature Walls, Splashbacks",
    description: "A vivid ruby-red glossy mosaic tile with a crisp blue border accent, ideal for bold feature walls and splashbacks.",
    price: 45.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-ruby-mosaic.jpg",
    images: [
      "/static/rooms/viola-pink/hall.jpg",
      "/static/real/tile-wall-ruby-mosaic.jpg",
      "/static/rooms/viola-pink/bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 226,
    name: "Aqua Glass Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy",
    thickness: "6mm",
    applications: "Bathroom Walls, Pool Surrounds",
    description: "A cool aqua-blue glass wall tile with a soft gradient sheen, well suited to bathrooms, spas, and pool surrounds.",
    price: 50.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-aqua-glass.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/tile-wall-aqua-glass.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 227,
    name: "Azulejo Blue Wall Tile",
    category: "Wall Tiles",
    origin: "Spain",
    finish: "Matte",
    thickness: "8mm",
    applications: "Feature Walls, Kitchen Backsplash",
    description: "A hand-painted-style blue and white azulejo pattern, bringing classic Iberian character to kitchens and feature walls.",
    price: 55.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-azulejo-blue.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/tile-wall-azulejo-blue.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 228,
    name: "Patchwork Marble Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "10mm",
    applications: "Feature Walls, Bathroom Walls",
    description: "A patchwork of marble-effect tiles in soft pink, cream, and grey tones, laid for an eclectic, gallery-style wall finish.",
    price: 60.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wall-patchwork-marble.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/tile-wall-patchwork-marble.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 229,
    name: "Checkerboard PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Hallways",
    description: "Polished vitrified tile laid in a bold black-and-white checkerboard, delivering a glass-like shine across large floor areas.",
    price: 65.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-checkerboard-1.jpg",
    images: [
      "/static/real/tile-pvt-checkerboard-1.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 230,
    name: "Classic Black & White PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Foyers",
    description: "A timeless black-and-white polished vitrified tile pattern, reflective enough to visually double the height of any room.",
    price: 65.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-checkerboard-2.jpg",
    images: [
      "/static/real/tile-pvt-checkerboard-2.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 231,
    name: "Diamond Gloss PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Commercial Spaces",
    description: "A high-gloss polished vitrified tile with a diamond-set laying pattern, engineered for heavy-footfall commercial floors.",
    price: 70.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-diamond-gloss.jpg",
    images: [
      "/static/real/tile-pvt-diamond-gloss.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 232,
    name: "Perspective Shine PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Lobbies",
    description: "A mirror-glossy polished vitrified tile that throws deep reflections down long hallways and grand lobby floors.",
    price: 72.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-perspective-shine.jpg",
    images: [
      "/static/real/tile-pvt-perspective-shine.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 233,
    name: "Salon Gloss PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Retail & Salons",
    description: "A warm-toned polished vitrified tile with a mirror finish, popular in salons, boutiques, and retail showroom floors.",
    price: 68.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-salon-gloss.jpg",
    images: [
      "/static/real/tile-pvt-salon-gloss.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 234,
    name: "Elevator Lobby PVT Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Flooring, Commercial Lobbies",
    description: "A large-format polished vitrified tile in warm beige tones, delivering a glass-like shine for elevator lobbies and corridors.",
    price: 75.00,
    availability: "In Stock",
    image_url: "/static/real/tile-pvt-elevator-lobby.jpg",
    images: [
      "/static/real/tile-pvt-elevator-lobby.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 235,
    name: "Speckled Terrazzo Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "10mm",
    applications: "Bathroom Walls, Shower Areas",
    description: "A warm beige terrazzo-effect tile with fine speckled aggregate, photographed from an actual bathroom installation, giving walls and shower recesses a soft, textured finish.",
    price: 42.00,
    availability: "In Stock",
    image_url: "/static/real/tile-terrazzo-speckled-wall.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-terrazzo-speckled-wall.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 236,
    name: "Aubergine Fluted Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy",
    thickness: "8mm",
    applications: "Bathroom Walls, Feature Walls",
    description: "A bold aubergine-purple fluted wall tile from a real bathroom installation, its vertical ribbing catching the light for a rich, boutique-hotel feel.",
    price: 48.00,
    availability: "In Stock",
    image_url: "/static/real/tile-aubergine-fluted-wall.jpg",
    images: [
      "/static/rooms/viola-pink/hall.jpg",
      "/static/rooms/viola-pink/kitchen.jpg",
      "/static/real/tile-aubergine-fluted-wall.jpg",
      "/static/rooms/viola-pink/parking.jpg"
    ]
  },
  {
    id: 237,
    name: "Medallion Inlay Floor Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "10mm",
    applications: "Foyers, Entryways, Pooja Rooms",
    description: "A decorative marble and tile medallion inlay, laid as a concentric square border pattern — photographed from an actual home entryway installation.",
    price: 85.00,
    availability: "In Stock",
    image_url: "/static/real/tile-medallion-inlay-floor.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 238,
    name: "Ash Gray Bookmatch Marble",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Elevator Lobbies, Feature Walls",
    description: "A cool ash-grey marble with soft cloud-like veining, bookmatched across panels in a real elevator lobby installation for a seamless, mirrored effect.",
    price: 220.00,
    availability: "In Stock",
    image_url: "/static/real/marble-ash-gray-bookmatch.jpg",
    images: [
      "/static/real/marble-ash-gray-bookmatch.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 239,
    name: "Beige Slab Display Marble",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Countertops, Flooring, Wall Cladding",
    description: "A warm greige marble slab with soft crystalline veining, shown as supplied — straight off the yard, ready for fabrication into countertops or flooring.",
    price: 175.00,
    availability: "In Stock",
    image_url: "/static/real/marble-beige-slab-display.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 240,
    name: "Charcoal Leathered Quartzite",
    category: "Quartz",
    origin: "India",
    finish: "Leathered",
    thickness: "2cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A dense charcoal quartzite with a leathered, slip-resistant surface, photographed on an actual staircase installation for durable, heavy-footfall steps.",
    price: 200.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-charcoal-stair-tread.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ]
  },
  {
    id: 241,
    name: "Wood Look Floor Tile Installation",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte Wood Look",
    thickness: "10mm",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "A warm wood-effect floor tile installed in a residential room, giving the comfort of timber with the durability and easier maintenance of tile.",
    price: 58.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wood-look-floor-installation.jpg",
    images: [
      "/static/real/tile-wood-look-floor-installation.jpg",
      "/static/rooms/wood-look/kitchen.jpg",
      "/static/real/tile-wood-look-bedroom-floor.jpg",
      "/static/rooms/wood-look/parking.jpg"
    ]
  },
  {
    id: 242,
    name: "Color Subway Wall Tile Display",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy / Textured",
    thickness: "8mm",
    applications: "Kitchen Backsplash, Bathrooms, Feature Walls",
    description: "A showroom display of colorful subway and relief wall tiles, suited for bright backsplash and bathroom feature-wall combinations.",
    price: 46.00,
    availability: "In Stock",
    image_url: "/static/real/tile-color-subway-display.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-color-subway-display.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 243,
    name: "Cafe Print Wall Tile Panel",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy Printed",
    thickness: "8mm",
    applications: "Kitchen Walls, Dining Corners, Commercial Cafes",
    description: "A printed wall-tile panel with cafe motifs and contrasting dark accents, designed for kitchen and dining feature walls.",
    price: 44.00,
    availability: "In Stock",
    image_url: "/static/real/tile-cafe-print-wall-panel.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-cafe-print-wall-panel.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 244,
    name: "Stone Mosaic Display Board",
    category: "Wall Tiles",
    origin: "India",
    finish: "Textured",
    thickness: "10mm",
    applications: "Feature Walls, Exterior Cladding, Accent Panels",
    description: "A mixed stone and mosaic wall-tile display with stacked, geometric, and textured finishes for feature walls and cladding.",
    price: 62.00,
    availability: "In Stock",
    image_url: "/static/real/tile-stone-mosaic-display-board.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-stone-mosaic-display-board.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 245,
    name: "Splitface Quartzite Wall Cladding",
    category: "Quartz",
    origin: "India",
    finish: "Natural Splitface",
    thickness: "Varies",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A grey splitface quartzite cladding panel with a rugged stacked-stone texture for durable exterior and accent wall use.",
    price: 78.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-splitface-wall-cladding.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ]
  },
  {
    id: 246,
    name: "Green Polished Marble Slab",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Countertops, Wall Cladding, Statement Panels",
    description: "A deep green polished marble-look slab with white mineral veining, photographed in the showroom for selection and fabrication.",
    price: 190.00,
    availability: "In Stock",
    image_url: "/static/real/marble-green-polished-slab.jpg",
    images: [
      "/static/real/kota-stone-flooring-passage.jpg",
      "/static/nh/natural-kitchen-bath.jpg",
      "/static/nh/natural-bedroom.jpg",
      "/static/real/kota-stone-outdoor-courtyard.jpg"
    ]
  },
  {
    id: 247,
    name: "RAK White Marble Look Slab Tile",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "Large Format",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "A large-format white marble-look slab tile with soft grey veins, suitable for clean contemporary wall and floor layouts.",
    price: 82.00,
    availability: "In Stock",
    image_url: "/static/real/tile-rak-white-marble-look-slab.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 248,
    name: "Glossy White Kitchen Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy",
    thickness: "8mm",
    applications: "Kitchen Walls, Utility Walls, Backsplashes",
    description: "A glossy white kitchen wall tile installed with a warm horizontal accent band for simple, easy-to-clean kitchen surfaces.",
    price: 39.00,
    availability: "In Stock",
    image_url: "/static/real/tile-glossy-white-kitchen-wall.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/tile-glossy-white-kitchen-wall.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 249,
    name: "Gray Shower Suite Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte Stone Look",
    thickness: "10mm",
    applications: "Bathroom Walls, Shower Floors, Wet Areas",
    description: "A grey stone-look bathroom tile installed across shower walls and floors, pairing slip-conscious texture with a restrained modern palette.",
    price: 52.00,
    availability: "In Stock",
    image_url: "/static/real/tile-gray-shower-suite.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 250,
    name: "Monochrome Feature Tile Display",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy / Matte Mix",
    thickness: "8mm",
    applications: "Feature Walls, Bathrooms, Showroom Displays",
    description: "A black-and-white feature tile display combining glossy slabs, dark accents, and decorative floor inserts for coordinated wall designs.",
    price: 56.00,
    availability: "In Stock",
    image_url: "/static/real/tile-monochrome-feature-display.jpg",
    images: [
      "/static/real/tile-pvt-checkerboard-1.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 251,
    name: "White Marble Look Slab Display",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "Large Format",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "A white marble-look slab tile displayed upright, with fine grey veining and a glossy surface for large-format interiors.",
    price: 84.00,
    availability: "In Stock",
    image_url: "/static/real/tile-white-marble-look-slab-display.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 252,
    name: "Botanical Matte Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte Printed",
    thickness: "8mm",
    applications: "Bathroom Walls, Feature Walls, Powder Rooms",
    description: "A soft botanical printed wall tile with muted leaf and floral forms, used to add pattern without making the room feel busy.",
    price: 50.00,
    availability: "In Stock",
    image_url: "/static/real/tile-botanical-matte-wall.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-cafe-print-wall-panel.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 253,
    name: "Decorative Floor Pattern Tile Board",
    category: "Full Body Tiles",
    origin: "India",
    finish: "Matte Patterned",
    thickness: "10mm",
    applications: "Floor, Flooring, Parking, Outdoor, Heavy Duty, Living Room, Hall, Balcony",
    description: "A display board of decorative patterned floor tiles in neutral tones, suitable for entryways, balconies, and accent flooring.",
    price: 54.00,
    availability: "In Stock",
    image_url: "/static/real/tile-decorative-floor-pattern-board.jpg",
    images: [
      "/static/real/tile-decorative-floor-pattern-board.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-botanical-matte-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 254,
    name: "Wood Floral Wall Tile Panel",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy Printed",
    thickness: "8mm",
    applications: "Feature Walls, Bathrooms, Decorative Niches",
    description: "A decorative wall tile panel combining wood tones and floral printwork for warm residential accent walls.",
    price: 47.00,
    availability: "In Stock",
    image_url: "/static/real/tile-wood-floral-wall-panel.jpg",
    images: [
      "/static/real/tile-wood-look-floor-installation.jpg",
      "/static/rooms/wood-look/kitchen.jpg",
      "/static/real/tile-wood-floral-wall-panel.jpg",
      "/static/rooms/wood-look/parking.jpg"
    ]
  },
  {
    id: 255,
    name: "Glossy Showroom Corridor Tile",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Showrooms, Corridors, Commercial Floors",
    description: "A reflective polished vitrified tile installation through a showroom corridor, showing the shine and scale possible in commercial spaces.",
    price: 74.00,
    availability: "In Stock",
    image_url: "/static/real/tile-showroom-glossy-corridor.jpg",
    images: [
      "/static/real/tile-showroom-glossy-corridor.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 256,
    name: "Gray Herringbone Marble Floor",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Living Rooms, Hallways, Luxury Floors",
    description: "A grey marble floor laid in a herringbone pattern with a polished finish, photographed across multiple angles from a completed installation.",
    price: 225.00,
    availability: "In Stock",
    image_url: "/static/real/marble-gray-herringbone-floor.jpg",
    images: [
      "/static/real/marble-gray-herringbone-floor.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 257,
    name: "Charcoal Outdoor Quartzite Walkway",
    category: "Quartz",
    origin: "India",
    finish: "Textured",
    thickness: "2cm",
    applications: "Kitchen Top, Kitchen Countertop, Island, Flooring, Hall, Living Room, Vanity",
    description: "A dark outdoor quartzite walkway with a textured surface for practical exterior circulation areas.",
    price: 95.00,
    availability: "In Stock",
    image_url: "/static/real/quartzite-charcoal-outdoor-walkway.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ]
  },
  {
    id: 258,
    name: "Travertine Exterior Cladding Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte Stone Look",
    thickness: "10mm",
    applications: "Exterior Walls, Facades, Porches",
    description: "A warm travertine-look exterior wall tile installed around windows and porch walls for a clean residential facade.",
    price: 66.00,
    availability: "In Stock",
    image_url: "/static/real/tile-travertine-exterior-cladding.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/nh/stone-living-kitchen.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 259,
    name: "Gray Marble Staircase Installation",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Staircases, Landings, Duplex Homes",
    description: "A grey marble staircase installation with broad tread pieces and polished stone movement across the steps and landing.",
    price: 210.00,
    availability: "In Stock",
    image_url: "/static/real/marble-gray-staircase-installation.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 260,
    name: "Gray Elevator Marble Cladding",
    category: "Marble",
    origin: "India",
    finish: "Polished",
    thickness: "2cm",
    applications: "Elevator Lobbies, Wall Cladding, Apartment Interiors",
    description: "A grey marble-look elevator wall cladding installation that adds a durable polished surface around high-use lobby areas.",
    price: 205.00,
    availability: "In Stock",
    image_url: "/static/real/marble-gray-elevator-cladding.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 261,
    name: "Speckled Bathroom Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Matte",
    thickness: "8mm",
    applications: "Bathroom Walls, Shower Areas, Utility Rooms",
    description: "A light speckled bathroom wall tile installed in a shower area, giving small bathrooms a bright and practical wall finish.",
    price: 43.00,
    availability: "In Stock",
    image_url: "/static/real/tile-speckled-bathroom-wall.jpg",
    images: [
      "/static/real/tile-medallion-inlay-floor.jpg",
      "/static/real/tile-glossy-white-kitchen-wall.jpg",
      "/static/real/tile-speckled-bathroom-wall.jpg",
      "/static/rooms/decorative/parking.jpg"
    ]
  },
  {
    id: 262,
    name: "Purple Ribbed Bathroom Wall Tile",
    category: "Wall Tiles",
    origin: "India",
    finish: "Glossy Ribbed",
    thickness: "8mm",
    applications: "Bathroom Walls, Vanity Backsplashes, Feature Walls",
    description: "A purple ribbed wall tile used behind a bathroom vanity, adding vertical texture and color to compact wet-area designs.",
    price: 49.00,
    availability: "In Stock",
    image_url: "/static/real/tile-purple-ribbed-bathroom-wall.jpg",
    images: [
      "/static/rooms/viola-pink/hall.jpg",
      "/static/rooms/viola-pink/kitchen.jpg",
      "/static/real/tile-purple-ribbed-bathroom-wall.jpg",
      "/static/rooms/viola-pink/parking.jpg"
    ]
  },
  {
    id: 263,
    name: "Cream Polished Floor Tile Installation",
    category: "PVT",
    origin: "India",
    finish: "Glossy / PVT",
    thickness: "10mm",
    applications: "Living Rooms, Bedrooms, Apartment Floors",
    description: "A cream polished vitrified tile installation photographed across residential rooms, showing a bright, low-maintenance floor finish.",
    price: 69.00,
    availability: "In Stock",
    image_url: "/static/real/tile-cream-polished-floor-installation.jpg",
    images: [
      "/static/real/tile-cream-polished-floor-installation.jpg",
      "/static/real/hero-kitchen-tiles.jpg",
      "/static/real/tile-cream-polished-floor-room.jpg",
      "/static/rooms/pvt-gloss/parking.jpg"
    ]
  },
  {
    id: 300,
    name: "Black Galaxy Granite",
    category: "Granite",
    origin: "India (Andhra Pradesh)",
    finish: "Polished",
    thickness: "18mm",
    applications: "Kitchen Countertops, Wall Cladding, Flooring",
    description: "A dramatic jet-black granite flecked with golden crystalline specks that catch the light like stars. A perennial favourite for kitchen counters and feature walls.",
    price: 95.00,
    availability: "In Stock",
    image_url: "/static/real/granite-black-veined.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ]
  },
  {
    id: 301,
    name: "Steel Grey Granite",
    category: "Granite",
    origin: "India (Karnataka)",
    finish: "Polished",
    thickness: "18mm",
    applications: "Passage & Lobby Flooring, Staircases",
    description: "A cool, uniform grey granite with fine speckling, giving grand entrances and passageways a clean, contemporary finish that wears well under heavy foot traffic.",
    price: 78.00,
    availability: "In Stock",
    image_url: "/static/real/granite-flooring-lobby.jpg",
    images: [
      "/static/real/granite-flooring-lobby.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/nh/gray-marble-parking.jpg"
    ]
  },
  {
    id: 302,
    name: "Tan Brown Granite",
    category: "Granite",
    origin: "India (Karnataka)",
    finish: "Polished",
    thickness: "18mm",
    applications: "Kitchen Countertops, Table Tops",
    description: "Warm brown tones threaded with black mineral flecks — one of the most requested granites for kitchen counters for its durability and forgiving, low-maintenance surface.",
    price: 82.00,
    availability: "In Stock",
    image_url: "/static/real/granite-kitchen-countertop.jpg",
    images: [
      "/static/real/hallway-travertine-arched.jpg",
      "/static/real/granite-kitchen-countertop.jpg",
      "/static/nh/stone-bedroom-living.jpg",
      "/static/rooms/beige-marble/parking.jpg"
    ]
  },
  {
    id: 303,
    name: "Kashmir White Granite",
    category: "Granite",
    origin: "India (Andhra Pradesh)",
    finish: "Polished",
    thickness: "18mm",
    applications: "Wall Cladding, Lift Lobbies",
    description: "A soft white-and-grey granite with burgundy garnet flecks, popular for elevator lobbies and feature walls where a bright, reflective surface is wanted.",
    price: 105.00,
    availability: "In Stock",
    image_url: "/static/real/granite-wall-cladding-lobby.jpg",
    images: [
      "/static/real/statuario-marble-living-hall.jpg",
      "/static/real/kitchen-white-marble-island.jpg",
      "/static/real/project-residential-bedroom.jpg",
      "/static/rooms/white-marble/parking.jpg"
    ]
  },
  {
    id: 304,
    name: "Absolute Black Granite",
    category: "Granite",
    origin: "India (Karnataka)",
    finish: "Polished",
    thickness: "18mm",
    applications: "Staircases, Steps, Kitchen Countertops",
    description: "A dense, uniformly jet-black granite prized for staircase treads and steps for its slip-resistant polish and ability to hide wear over decades of use.",
    price: 110.00,
    availability: "In Stock",
    image_url: "/static/real/granite-staircase-closeup.jpg",
    images: [
      "/static/real/hero-office-lobby.jpg",
      "/static/nh/granite-kitchen-black.jpg",
      "/static/real/bedroom-minimal-modern.jpg",
      "/static/real/quartzite-charcoal-outdoor-walkway.jpg"
    ]
  },
  {
    id: 305,
    name: "Kota Green Limestone",
    category: "Kota Stone",
    origin: "India (Rajasthan)",
    finish: "Polished",
    thickness: "20mm",
    applications: "Flooring, Hall, Passage, Parking, Commercial, Outdoor, Paving, Steps",
    description: "A classic green-toned limestone quarried in Kota, Rajasthan. Naturally slip-resistant and cool underfoot, it's a time-tested choice for Indian home flooring and courtyards.",
    price: 45.00,
    availability: "In Stock",
    image_url: "/static/real/kota-stone-flooring-passage.jpg",
    images: [
      "/static/real/kota-stone-flooring-passage.jpg",
      "/static/nh/natural-kitchen-bath.jpg",
      "/static/nh/natural-bedroom.jpg",
      "/static/real/kota-stone-outdoor-courtyard.jpg"
    ]
  },
  {
    id: 306,
    name: "Kota Grey Limestone",
    category: "Kota Stone",
    origin: "India (Rajasthan)",
    finish: "Natural / Sandblasted",
    thickness: "25mm",
    applications: "Flooring, Hall, Passage, Parking, Commercial, Outdoor, Paving, Steps",
    description: "A tougher, textured grey variant of Kota limestone, ideal for outdoor parking areas, courtyards, and high-traffic commercial complexes thanks to its rough-finish grip.",
    price: 38.00,
    availability: "In Stock",
    image_url: "/static/real/kota-stone-outdoor-courtyard.jpg",
    images: [
      "/static/nh/gray-marble-hall.jpg",
      "/static/nh/gray-marble-kitchen.jpg",
      "/static/nh/gray-marble-bedroom.jpg",
      "/static/real/kota-stone-outdoor-courtyard.jpg"
    ]
  },
  {
    id: 3001,
    name: "Arnia Leaf Blanco",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irk8135r1h0n7fstlo17fnula.webp",
    images: [
      "/static/lakshmi/o_1irk8135r1h0n7fstlo17fnula.webp",
      "/static/lakshmi/o_1irml0mahget14oi11oa195r16qqh.webp",
      "/static/lakshmi/o_1irml0mahdo9c2t1m5r1u7am0ki.webp",
      "/static/lakshmi/o_1irml0mahpce93r102h1ocd1141j.webp"
]
  },
  {
    id: 3002,
    name: "Brando Lava",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Sharma Ceramic Division collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml35lqbbalo71s94b1419dqa.webp",
    images: [
      "/static/lakshmi/o_1irml35lqbbalo71s94b1419dqa.webp",
      "/static/lakshmi/o_1irml9fep1c2910938ti1s7s1uedh.webp",
      "/static/lakshmi/o_1irml9feph9f1n1f13g716fo1a7ni.webp",
      "/static/lakshmi/o_1irml9feqs61rd21n821r82kodj.webp"
]
  },
  {
    id: 3003,
    name: "Livarno Pearla",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml38aevagm3g1kaf4be1iqld.webp",
    images: [
      "/static/lakshmi/o_1irml38aevagm3g1kaf4be1iqld.webp",
      "/static/lakshmi/o_1irmlaa0sak3gsogcd1ebuiqi12.webp",
      "/static/lakshmi/o_1irmlaa0ss44100t76r40gvmq13.webp",
      "/static/lakshmi/o_1irmlaa0s1d121nbk1jlfgi3fgp14.webp"
]
  },
  {
    id: 3004,
    name: "Menorca Cotto",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml3amu1jo21kjo1u1mvmj15lkg.webp",
    images: [
      "/static/lakshmi/o_1irml3amu1jo21kjo1u1mvmj15lkg.webp",
      "/static/lakshmi/o_1irmld3ij16qc3l71ts11ffo1kich.webp",
      "/static/lakshmi/o_1irmld3ijbid6hm1o3i1c1t1ieci.webp",
      "/static/lakshmi/o_1irmld3ijgtiqor2h0153h1011j.webp"
]
  },
  {
    id: 3005,
    name: "Omega Cotto",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irk815ri193b8v8otfbnmeq0d.webp",
    images: [
      "/static/lakshmi/o_1irk815ri193b8v8otfbnmeq0d.webp",
      "/static/lakshmi/o_1irm7g9hnhgjbhs17u4n95u69m.webp",
      "/static/lakshmi/o_1irm7g9hn19gk1bn31vml2sqh8nn.webp",
      "/static/lakshmi/o_1irm7g9hndn815b21msh18tm1e82o.webp"
]
  },
  {
    id: 3006,
    name: "Soft Bianco",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml3fej5fe1s9e1qqgm2lh6aj.webp",
    images: [
      "/static/lakshmi/o_1irml3fej5fe1s9e1qqgm2lh6aj.webp",
      "/static/lakshmi/o_1irmma8ir9gaftpq81i8p1l7uh.webp",
      "/static/lakshmi/o_1irmma8irk8q7c5b00j31n12i.webp",
      "/static/lakshmi/o_1irmma8ir1r0f1k3610mpfh71mrjj.webp"
]
  },
  {
    id: 3007,
    name: "Soft Oro Blue",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml3ial1e2f2kqmjab5qrp1m.webp",
    images: [
      "/static/lakshmi/o_1irml3ial1e2f2kqmjab5qrp1m.webp",
      "/static/lakshmi/o_1irmmb7711kr85lqe0cf7d18e5s.webp",
      "/static/lakshmi/o_1irmmb7711jne16ngp5sfhk1gljt.webp",
      "/static/lakshmi/o_1irmmb771mkl17bjplnkpfr81u.webp"
]
  },
  {
    id: 3008,
    name: "Spectral German Blue",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irk7hihb9om1i3d1l2g1t0g18pda.webp",
    images: [
      "/static/lakshmi/o_1irk7hihb9om1i3d1l2g1t0g18pda.webp",
      "/static/lakshmi/o_1irm7mkbe1mja19u4k1916n7tc6u.webp",
      "/static/lakshmi/o_1irm7mkbe11qk3kn95s1ljg1vjdv.webp",
      "/static/lakshmi/o_1irm7mkbek031bj11851knq8di10.webp"
]
  },
  {
    id: 3009,
    name: "Terra Art Dove",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irml3vt71qs1lg7183s19u2endp.webp",
    images: [
      "/static/lakshmi/o_1irml3vt71qs1lg7183s19u2endp.webp"
]
  },
  {
    id: 3010,
    name: "Terra Art Mint",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irk7hkledbkhvcspi15361nikd.webp",
    images: [
      "/static/lakshmi/o_1irk7hkledbkhvcspi15361nikd.webp"
]
  },
  {
    id: 3011,
    name: "Vintage Copper",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "200x200mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 200x200mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 45.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1irmhgmq5149f1hb42pc8pd1gk7d.webp",
    images: [
      "/static/lakshmi/o_1irmhgmq5149f1hb42pc8pd1gk7d.webp",
      "/static/lakshmi/o_1irmhhuv216g4eun3co37q1kj3g.webp",
      "/static/lakshmi/o_1irmhhuv2sk6bpo1hnd1gob1u0hh.webp",
      "/static/lakshmi/o_1irmhhuv21rrlqkj1i5nmsi1cqmi.webp"
]
  },
  {
    id: 3012,
    name: "Carrara Mist (15083)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1dko1e16038hgcpr4i.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1dko1e16038hgcpr4i.webp"
]
  },
  {
    id: 3013,
    name: "Statuario Luxe (15367)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqcv7hoii1411qt2uuj4j.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqcv7hoii1411qt2uuj4j.webp"
]
  },
  {
    id: 3014,
    name: "Calacatta Gold (15412)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1aj16ncvluje91lu14k.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1aj16ncvluje91lu14k.webp"
]
  },
  {
    id: 3015,
    name: "Modena Travertine (3825)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru80ibr12k71511j8gkl1dhba.webp",
    images: [
      "/static/lakshmi/o_1iru80ibr12k71511j8gkl1dhba.webp",
      "/static/lakshmi/o_1is0d1ts91hck1520dfa1supo9fb.webp",
      "/static/lakshmi/o_1is0d1ts91c9r1r2iae511arhdfc.webp"
]
  },
  {
    id: 3016,
    name: "Valencia Crema (6064)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqbjid16hr1dob135klcn42.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqbjid16hr1dob135klcn42.webp"
]
  },
  {
    id: 3017,
    name: "Siena Almond (6089)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb26b1qt71lgd1o9q1ef944.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb26b1qt71lgd1o9q1ef944.webp"
]
  },
  {
    id: 3018,
    name: "Milano Grey (6090)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb15eorjd1io21d67r8e45.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb15eorjd1io21d67r8e45.webp"
]
  },
  {
    id: 3019,
    name: "Verona Beige (6102)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb1ntq18gasre1ce1fhi46.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb1ntq18gasre1ce1fhi46.webp"
]
  },
  {
    id: 3020,
    name: "Tivoli Bianco (6143)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb1rlk1kan4ne1ea2ne44b.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb1rlk1kan4ne1ea2ne44b.webp"
]
  },
  {
    id: 3021,
    name: "Tivoli Crema (6144)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb1len191ls3i7o197v4c.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb1len191ls3i7o197v4c.webp"
]
  },
  {
    id: 3022,
    name: "Tivoli Gris (6145)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1161j4s119rl9chis4d.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1161j4s119rl9chis4d.webp"
]
  },
  {
    id: 3023,
    name: "Tivoli Ash (6146)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc8d2tto7fl1h811m304e.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc8d2tto7fl1h811m304e.webp"
]
  },
  {
    id: 3024,
    name: "Palermo Mosaic (717_D2)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqb1afs196h198p1fbrl3g3r.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqb1afs196h198p1fbrl3g3r.webp"
]
  },
  {
    id: 3025,
    name: "Ravello Slate (7607)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru88rjs1i081nma15kmmd1o79g.webp",
    images: [
      "/static/lakshmi/o_1iru88rjs1i081nma15kmmd1o79g.webp",
      "/static/lakshmi/o_1is0d7jg613vl118nmb410qsas3b.webp",
      "/static/lakshmi/o_1is0d7jg661i1gq518rg1741uedc.webp"
]
  },
  {
    id: 3026,
    name: "AFFON DK",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqci6k1mmd15185i14ks4l.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqci6k1mmd15185i14ks4l.webp"
]
  },
  {
    id: 3027,
    name: "CLASSIC WOOD GREY",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc53882ejd018ih2i94m.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc53882ejd018ih2i94m.webp"
]
  },
  {
    id: 3028,
    name: "COTTO ASH GREY",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc3kqlvi1gjltllsa4n.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc3kqlvi1gjltllsa4n.webp"
]
  },
  {
    id: 3029,
    name: "COTTO BEIGE",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc5vl1a60192i1466dk64o.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc5vl1a60192i1466dk64o.webp"
]
  },
  {
    id: 3030,
    name: "COTTO BIANCO",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc19skest1mairsq142j4p.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc19skest1mairsq142j4p.webp"
]
  },
  {
    id: 3031,
    name: "COTTO CHARCOAL",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1qam128rhh118io1fk94q.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1qam128rhh118io1fk94q.webp"
]
  },
  {
    id: 3032,
    name: "COTTO M  YELLOW",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqcb1oko81gssvkmvtn4r.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqcb1oko81gssvkmvtn4r.webp"
]
  },
  {
    id: 3033,
    name: "COTTO MOCHA",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1gqhdj2b8n1p4d17b84s.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1gqhdj2b8n1p4d17b84s.webp"
]
  },
  {
    id: 3034,
    name: "COTTO OCEAN GREEN",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqc1hd1qbqvkd1b8i73c4t.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqc1hd1qbqvkd1b8i73c4t.webp"
]
  },
  {
    id: 3035,
    name: "COTTO STEEL GREY",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqcamat7icq5iike14u.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqcamat7icq5iike14u.webp"
]
  },
  {
    id: 3036,
    name: "COTTO TERRACOTTA",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "300x300mm",
    applications: "Living Room, Wall, Feature Wall, Bedroom, Wall, Accent Wall",
    description: "Premium polished wall tile in 300x300mm format from Harsha collection. Ideal for luxury living room, wall, feature wall, bedroom, wall, accent wall installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iru9bhqcvss155l1em51210q54v.webp",
    images: [
      "/static/lakshmi/o_1iru9bhqcvss155l1em51210q54v.webp"
]
  },
  {
    id: 3037,
    name: "Imperiale Onyx (12080PN)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1lso1aab189j1u7tlfb14gbd.webp",
    images: [
      "/static/lakshmi/o_1is5h1lso1aab189j1u7tlfb14gbd.webp",
      "/static/lakshmi/o_1is5ievr71nt9akop2e1o9d1cjnc.webp",
      "/static/lakshmi/o_1is5ievr762e1gi214g01nr5713b.webp"
]
  },
  {
    id: 3038,
    name: "Royal Statuario (12129P)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1o6iom1nfuqjq1jc1a0qg.webp",
    images: [
      "/static/lakshmi/o_1is5h1o6iom1nfuqjq1jc1a0qg.webp",
      "/static/lakshmi/o_1is5ifkvlvtb1kol1imr1j2o15d7b.webp",
      "/static/lakshmi/o_1is5ifkvlhjq1lf1567p66111bc.webp"
]
  },
  {
    id: 3039,
    name: "Armani Marfil (12185P)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1qa8rtb170afgfm0h1ktsj.webp",
    images: [
      "/static/lakshmi/o_1is5h1qa8rtb170afgfm0h1ktsj.webp",
      "/static/lakshmi/o_1is5igi4laah1mol1knj13t814b8c.webp",
      "/static/lakshmi/o_1is5igi4l13unk68kcqqcs1cveb.webp"
]
  },
  {
    id: 3040,
    name: "Pietra Grey (12198P)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1sjnqdgvp4j8o18tm9pdm.webp",
    images: [
      "/static/lakshmi/o_1is5h1sjnqdgvp4j8o18tm9pdm.webp",
      "/static/lakshmi/o_1is5ih7lte201chku295jd14enc.webp",
      "/static/lakshmi/o_1is5ih7lthrdkea71412vlgisd.webp",
      "/static/lakshmi/o_1is5ih7lt17qg82vko61ngnleqe.webp"
]
  },
  {
    id: 3041,
    name: "4001 SEVELLIA CREMA",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1ji412qjjt51lloac91dda.webp",
    images: [
      "/static/lakshmi/o_1is5h1ji412qjjt51lloac91dda.webp",
      "/static/lakshmi/o_1is5i5ol613ge19c41p671ct616sbc.webp",
      "/static/lakshmi/o_1is5i5ol61s8g17os1m5pv16ul9d.webp",
      "/static/lakshmi/o_1is5i5ol61kvpquro1dvemblpe.webp"
]
  },
  {
    id: 3042,
    name: "Acron Crema",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h1ur0s6jb7vr9c163r12m2p.webp",
    images: [
      "/static/lakshmi/o_1is5h1ur0s6jb7vr9c163r12m2p.webp",
      "/static/lakshmi/o_1is5ihr2lifk1cbc1aui1dgp66sc.webp",
      "/static/lakshmi/o_1is5ihr2lv0b1a2815r7176jsimd.webp",
      "/static/lakshmi/o_1is5ihr2l15ej1mtn1jcgah21o24e.webp"
]
  },
  {
    id: 3043,
    name: "Alonza Grey",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h215o1r2k1o836d1e031lbbs.webp",
    images: [
      "/static/lakshmi/o_1is5h215o1r2k1o836d1e031lbbs.webp",
      "/static/lakshmi/o_1is5iif9e1l9u101abue1kbf7opc.webp",
      "/static/lakshmi/o_1is5iif9e1gs2ai51f9j6aj1t80d.webp",
      "/static/lakshmi/o_1is5iif9e1bpn12vcmjg1ttc1d5me.webp"
]
  },
  {
    id: 3044,
    name: "Alonza Grey Decor",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5hmkn04mkf25if1t441t45a.webp",
    images: [
      "/static/lakshmi/o_1is5hmkn04mkf25if1t441t45a.webp"
]
  },
  {
    id: 3045,
    name: "Armani Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h23dsftj13dv1etv1eg6m56v.webp",
    images: [
      "/static/lakshmi/o_1is5h23dsftj13dv1etv1eg6m56v.webp"
]
  },
  {
    id: 3046,
    name: "Armani Bianco",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h25qo1r7v1e78rlmgg6bn612.webp",
    images: [
      "/static/lakshmi/o_1is5h25qo1r7v1e78rlmgg6bn612.webp",
      "/static/lakshmi/o_1is5ijd6d1uut1hiv5rscb0ftnd.webp",
      "/static/lakshmi/o_1is5ijd6d125e6tt1mjh1natdrse.webp",
      "/static/lakshmi/o_1is5ijd6d1q33hnr1o41507gt3c.webp"
]
  },
  {
    id: 3047,
    name: "Armani Blue",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h28c167f1hl7qli11ra1qr115.webp",
    images: [
      "/static/lakshmi/o_1is5h28c167f1hl7qli11ra1qr115.webp",
      "/static/lakshmi/o_1is5ik3vp1cnd1j0u1ll618op3fcd.webp",
      "/static/lakshmi/o_1is5ik3vpq491f7cpbg17bm1v0le.webp",
      "/static/lakshmi/o_1is5ik3vp1ja8767lq113p11m0gc.webp"
]
  },
  {
    id: 3048,
    name: "Armani Brown",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2ai21ind1i0i29t108q3uk18.webp",
    images: [
      "/static/lakshmi/o_1is5h2ai21ind1i0i29t108q3uk18.webp"
]
  },
  {
    id: 3049,
    name: "Astana White",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2d2gvph1b11d71ktc1bnd1b.webp",
    images: [
      "/static/lakshmi/o_1is5h2d2gvph1b11d71ktc1bnd1b.webp",
      "/static/lakshmi/o_1is5ilgg61fnc7d11ef1b8v2hkd.webp",
      "/static/lakshmi/o_1is5ilgg61kdqrk31nebnk6180le.webp",
      "/static/lakshmi/o_1is5ilgg61stc292lurd3d177oc.webp"
]
  },
  {
    id: 3050,
    name: "Avenue Bianco",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2fig1l346ih1h0qnam18ih1e.webp",
    images: [
      "/static/lakshmi/o_1is5h2fig1l346ih1h0qnam18ih1e.webp",
      "/static/lakshmi/o_1is5im7f767vk31ld2g641917c.webp",
      "/static/lakshmi/o_1is5im7f712e11296lu1lrt1kf9b.webp"
]
  },
  {
    id: 3051,
    name: "Avenue Bianco Decor",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5hmmt71b4vlav1ml110ltrbhd.webp",
    images: [
      "/static/lakshmi/o_1is5hmmt71b4vlav1ml110ltrbhd.webp"
]
  },
  {
    id: 3052,
    name: "Blossam Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2ii113ul1sbm66g6l135a1h.webp",
    images: [
      "/static/lakshmi/o_1is5h2ii113ul1sbm66g6l135a1h.webp",
      "/static/lakshmi/o_1is5imt6718la1apejiginul0vd.webp",
      "/static/lakshmi/o_1is5imt6718ua1pb2om31s791upue.webp",
      "/static/lakshmi/o_1is5imt67m0v18etjh1p4tdmec.webp"
]
  },
  {
    id: 3053,
    name: "Bottocino Ultra",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2l7815211imm8m01pigq1v1k.webp",
    images: [
      "/static/lakshmi/o_1is5h2l7815211imm8m01pigq1v1k.webp",
      "/static/lakshmi/o_1is5inm3em4n14mr1aa01m546hd.webp",
      "/static/lakshmi/o_1is5inm3ev8916gje4718b56mae.webp",
      "/static/lakshmi/o_1is5inm3e79cgpp1g6v5481elfc.webp"
]
  },
  {
    id: 3054,
    name: "Carnico Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2nup1089c6kb6jvutjbg1n.webp",
    images: [
      "/static/lakshmi/o_1is5h2nup1089c6kb6jvutjbg1n.webp",
      "/static/lakshmi/o_1is5iol5t1brc1ekue7e1gsjl27d.webp",
      "/static/lakshmi/o_1is5iol5tm8t1dfq1t3p18on1true.webp",
      "/static/lakshmi/o_1is5iol5t1u171kdl1e9vbs81r8vc.webp"
]
  },
  {
    id: 3055,
    name: "Cremilo Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2qj81lm81ns419mqkcb1irn1q.webp",
    images: [
      "/static/lakshmi/o_1is5h2qj81lm81ns419mqkcb1irn1q.webp",
      "/static/lakshmi/o_1is5ipf841pv8177q1etg1m0v1q9bc.webp",
      "/static/lakshmi/o_1is5ipf849eiden125ecep9ed.webp",
      "/static/lakshmi/o_1is5ipf8412uvfe1fb17jgjfe.webp"
]
  },
  {
    id: 3056,
    name: "Estela Gold",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h2uvqhi01ghl1auj125n1kkd1t.webp",
    images: [
      "/static/lakshmi/o_1is5h2uvqhi01ghl1auj125n1kkd1t.webp",
      "/static/lakshmi/o_1is5iq684ijfld19bunvc10gad.webp",
      "/static/lakshmi/o_1is5iq6841cuqi9tg7k155r1dsoe.webp",
      "/static/lakshmi/o_1is5iq684r341n481b7vsk21bhfc.webp"
]
  },
  {
    id: 3057,
    name: "Faline Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h32j01l81bjh5bn1pnlhl620.webp",
    images: [
      "/static/lakshmi/o_1is5h32j01l81bjh5bn1pnlhl620.webp",
      "/static/lakshmi/o_1is5iqtt51gc1183bfrj135l1vbuf.webp",
      "/static/lakshmi/o_1is5iqtt5ba8lphev71gh05u6g.webp",
      "/static/lakshmi/o_1is5iqtt51gd2p9ddohoe74ifd.webp"
]
  },
  {
    id: 3058,
    name: "Faline Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iv5cj0a6b81g0m1kmvorvrb9a.webp",
    images: [
      "/static/lakshmi/o_1iv5cj0a6b81g0m1kmvorvrb9a.webp"
]
  },
  {
    id: 3059,
    name: "Filita Crema",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h371r1osrkrlsaqne5pba23.webp",
    images: [
      "/static/lakshmi/o_1is5h371r1osrkrlsaqne5pba23.webp",
      "/static/lakshmi/o_1is5irfac1oei1sor1csv10mv1o2vd.webp",
      "/static/lakshmi/o_1is5irfac1pmieg72ed2jjqtue.webp",
      "/static/lakshmi/o_1is5irfac1al61aigue1h0hu0fc.webp"
]
  },
  {
    id: 3060,
    name: "Filita Crema Decor",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5hmome3lvuia1i7611r9185gg.webp",
    images: [
      "/static/lakshmi/o_1is5hmome3lvuia1i7611r9185gg.webp"
]
  },
  {
    id: 3061,
    name: "Forestwood Beige",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h39eseupd057njvqp1pmj26.webp",
    images: [
      "/static/lakshmi/o_1is5h39eseupd057njvqp1pmj26.webp"
]
  },
  {
    id: 3062,
    name: "Fresh Brown CV HT-7009 Random Design",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iu6fl18qjov1kdlkvq1smb1nu8l.webp",
    images: [
      "/static/lakshmi/o_1iu6fl18qjov1kdlkvq1smb1nu8l.webp",
      "/static/lakshmi/o_1iug6i5d81h2adl0nh4a5em27g.webp",
      "/static/lakshmi/o_1iug6i5d8u7v39goul1ihb1q4kf.webp",
      "/static/lakshmi/o_1iug6i5d8si5pifm061hiijche.webp"
]
  },
  {
    id: 3063,
    name: "HG Monaco Gold HT-7011 Random Design",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1iu6fl18qa4g170rc9v1pld1j0on.webp",
    images: [
      "/static/lakshmi/o_1iu6fl18qa4g170rc9v1pld1j0on.webp",
      "/static/lakshmi/o_1iug6vjhp1q8r3k810o7a1i1qr3k.webp",
      "/static/lakshmi/o_1iug6vjhp1v6kr7pmda79310csj.webp",
      "/static/lakshmi/o_1iug6vjhosfsl3p1f3i1nlndchi.webp"
]
  },
  {
    id: 3064,
    name: "Monaco Bianco (HT-7001)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h44vv1c2r6qa1rdu5qeirl29.webp",
    images: [
      "/static/lakshmi/o_1is5h44vv1c2r6qa1rdu5qeirl29.webp",
      "/static/lakshmi/o_1is5isgim16917ut1b6c1g4btp1i.webp",
      "/static/lakshmi/o_1is5isgim1vcvmoe19ss17ei701j.webp",
      "/static/lakshmi/o_1is5isgimpokjg6faqv6t5u8k.webp"
]
  },
  {
    id: 3065,
    name: "Monaco Crema (HT-7002)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h47kf11vcj1pgko19k21in52c.webp",
    images: [
      "/static/lakshmi/o_1is5h47kf11vcj1pgko19k21in52c.webp",
      "/static/lakshmi/o_1is5it34c9fj1ldq12ob1ah7dplh.webp",
      "/static/lakshmi/o_1is5it34ci5810pr1jcv1gorgr7i.webp",
      "/static/lakshmi/o_1is5it34c139edbt14v91mh31go5j.webp"
]
  },
  {
    id: 3066,
    name: "Monaco Gris (HT-7003)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4c6cdsbpagerl14dloig2f.webp",
    images: [
      "/static/lakshmi/o_1is5h4c6cdsbpagerl14dloig2f.webp",
      "/static/lakshmi/o_1is5iu2pd1v831fergq1188p1da4k.webp",
      "/static/lakshmi/o_1is5iu2pc1mlsesd1b8m3j6liaf.webp",
      "/static/lakshmi/o_1is5iu2pdfdl6tu5j14ro1vgog.webp"
]
  },
  {
    id: 3067,
    name: "Florenza Beige (HT-7007)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4eq8q9jdu212oepf3psg2i.webp",
    images: [
      "/static/lakshmi/o_1is5h4eq8q9jdu212oepf3psg2i.webp",
      "/static/lakshmi/o_1is5iuh3mpa81pif2s0coue9ti.webp",
      "/static/lakshmi/o_1is5iuh3mobc1ie0dg11cs1ra4e.webp",
      "/static/lakshmi/o_1is5iuh3m7f96ut44f10df1ekdf.webp"
]
  },
  {
    id: 3068,
    name: "Fresh Brown Royale (HT-7009)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4hm81hob18t6q8son711ni2l.webp",
    images: [
      "/static/lakshmi/o_1is5h4hm81hob18t6q8son711ni2l.webp",
      "/static/lakshmi/o_1is5iv64l15g51v3g12fs1aiv1lih.webp",
      "/static/lakshmi/o_1is5iv64ld2rak16f1vg0m24i.webp",
      "/static/lakshmi/o_1is5iv64ln5g2l4oq7knj35ue.webp"
]
  },
  {
    id: 3069,
    name: "Florenza Nero (HT-7010)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4kig1gkb19oc1qh011v915uq2o.webp",
    images: [
      "/static/lakshmi/o_1is5h4kig1gkb19oc1qh011v915uq2o.webp",
      "/static/lakshmi/o_1is5ivudm1kkcsup19pr1n4sf3qe.webp",
      "/static/lakshmi/o_1is5ivudmb84f8ihe6kofr4mf.webp",
      "/static/lakshmi/o_1is5ivudm14k3mp31eqg1cqgon8g.webp"
]
  },
  {
    id: 3070,
    name: "HG Monaco Gold (HT-7011)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4ncoir81u211qjlc2cub2r.webp",
    images: [
      "/static/lakshmi/o_1is5h4ncoir81u211qjlc2cub2r.webp",
      "/static/lakshmi/o_1is5j0fpf1e655bh1vuv1o3nplbh.webp",
      "/static/lakshmi/o_1is5j0fpf94vffe1sve8egpnji.webp",
      "/static/lakshmi/o_1is5j0fpfj2h1789igqkjb15hse.webp"
]
  },
  {
    id: 3071,
    name: "Venezia Statuario (HT-7012)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4q5ugo01k1liect4j5sf2u.webp",
    images: [
      "/static/lakshmi/o_1is5h4q5ugo01k1liect4j5sf2u.webp",
      "/static/lakshmi/o_1is5j1455ne29th67117he1iioh.webp",
      "/static/lakshmi/o_1is5j1455odr8621jts1d5kegci.webp",
      "/static/lakshmi/o_1is5j1454g3e15hrkflqhqrjue.webp"
]
  },
  {
    id: 3072,
    name: "Venezia Crema (HT-7020)",
    category: "Wall Tiles",
    origin: "India",
    finish: "Polished",
    thickness: "1200x600mm",
    applications: "Kitchen, Bathroom, Wall, Backsplash",
    description: "Premium polished wall tile in 1200x600mm format from Harsha collection. Ideal for luxury kitchen, bathroom, wall, backsplash installations with superior water resistance, stain resistance, and sleek contemporary aesthetics.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/lakshmi/o_1is5h4tae3l01dp61eb91jn511u931.webp",
    images: [
      "/static/lakshmi/o_1is5h4tae3l01dp61eb91jn511u931.webp",
      "/static/lakshmi/o_1is5j1lvj1hqeo1n12ikmp41iuqi.webp",
      "/static/lakshmi/o_1is5j1lvjuk2vh11t4sa8g29e.webp",
      "/static/lakshmi/o_1is5j1lvj1g1jbuo1r311ruqndaf.webp"
]
  },
  {
    id: 3101,
    name: "Slate Ledger Stone Elevation Tile",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Split Face",
    thickness: "600x300mm",
    applications: "Wall, Exterior Cladding, Compound Wall, Facade, Parking Wall, Outdoor",
    description: "Premium natural slate stacked stone elevation cladding tile with rustic dimensional texture. Ideal for modern villa exterior facades, boundary walls, and parking area accent walls.",
    price: 85.0,
    availability: "In Stock",
    image_url: "/static/real/elevation-stacked-stone-slate.jpg",
    images: ["/static/real/elevation-stacked-stone-slate.jpg", "/static/real/elevation-tiles-facade.jpg"]
  },
  {
    id: 3102,
    name: "Fluted Travertine Architectural Cladding",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Grooved Matte",
    thickness: "1200x600mm",
    applications: "Wall, Exterior Cladding, Pillar Cladding, Facade, Outdoor",
    description: "Architectural grade linear fluted groove travertine elevation slab. Delivers sophisticated contemporary texture for entrance pillars, building facades, and exterior feature walls.",
    price: 140.0,
    availability: "In Stock",
    image_url: "/static/real/elevation-travertine-fluted-groove.jpg",
    images: ["/static/real/elevation-travertine-fluted-groove.jpg", "/static/real/tile-travertine-exterior-cladding.jpg"]
  },
  {
    id: 3103,
    name: "Tuscan Terracotta Brick Elevation Tile",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Rustic Textured",
    thickness: "240x60mm",
    applications: "Wall, Compound Wall, Exterior Wall, Porch, Outdoor",
    description: "Authentic weathered terracotta exposed brick slip tile for exterior boundary walls, heritage villa facades, and portico pillars. Weatherproof and enduring.",
    price: 65.0,
    availability: "In Stock",
    image_url: "/static/real/elevation-terracotta-brick-cladding.jpg",
    images: ["/static/real/elevation-terracotta-brick-cladding.jpg"]
  },
  {
    id: 3104,
    name: "Modern Villa Facade Elevation Tile",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Textured",
    thickness: "600x300mm",
    applications: "Wall, Exterior Cladding, Parking Wall, Outdoor",
    description: "Contemporary multi-panel exterior elevation tile engineered for extreme weather resilience. Perfect for compound walls, parking area walls, and exterior balconies.",
    price: 78.0,
    availability: "In Stock",
    image_url: "/static/real/elevation-tiles-facade.jpg",
    images: ["/static/real/elevation-tiles-facade.jpg", "/static/real/elevation-tile-exterior.jpg"]
  },
  {
    id: 3105,
    name: "Rustic Multi-Stone Exterior Cladding",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Natural Rock",
    thickness: "600x300mm",
    applications: "Wall, Compound Wall, Exterior Wall, Facade, Outdoor",
    description: "Multi-hued natural stone look exterior wall tile. Blends warm earth tones with chiseled rock relief to elevate front elevations and boundary walls.",
    price: 72.0,
    availability: "In Stock",
    image_url: "/static/real/elevation-tile-exterior.jpg",
    images: ["/static/real/elevation-tile-exterior.jpg", "/static/real/elevation-tiles-facade.jpg"]
  },
  {
    id: 3106,
    name: "Alpine Quartzite Split-Face Cladding",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Chiseled Rock",
    thickness: "600x150mm",
    applications: "Wall, Boundary Wall, Entrance Pillar, Outdoor",
    description: "High-relief quartzite split-face rock wall cladding tile. Offers unmatched architectural depth and weather resistance for perimeter walls and gate pillars.",
    price: 95.0,
    availability: "In Stock",
    image_url: "/static/real/quartzite-splitface-wall-cladding.jpg",
    images: ["/static/real/quartzite-splitface-wall-cladding.jpg"]
  },
  {
    id: 3107,
    name: "Roman Travertine Exterior Wall Tile",
    category: "Elevation Tiles",
    origin: "India",
    finish: "Honed Matte",
    thickness: "600x300mm",
    applications: "Wall, Exterior Cladding, Facade, Compound Wall, Outdoor",
    description: "Classic Roman travertine textured exterior porcelain tile. Smooth matte tactile feel with natural stone veining, suitable for facade cladding and exterior balconies.",
    price: 82.0,
    availability: "In Stock",
    image_url: "/static/real/tile-travertine-exterior-cladding.jpg",
    images: ["/static/real/tile-travertine-exterior-cladding.jpg"]
  },
];
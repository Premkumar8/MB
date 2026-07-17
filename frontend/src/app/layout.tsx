import type { Metadata } from "next";
import { Playfair_Display, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { AppProvider } from "@/context/AppContext";
import SmoothScroll from "@/components/SmoothScroll";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AiChatbot from "@/components/AiChatbot";
import WhatsAppWidget from "@/components/WhatsAppWidget";

// Load premium fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurelia Marmi | Premium Luxury Marble & Natural Stone",
    template: "%s | Aurelia Marmi",
  },
  description:
    "Immerse yourself in world-class natural stone craftsmanship. Explore our interactive 3D showroom, procedural marble slab configurators, and AI room visuals. Quarried in Italy, Spain, and Brazil.",
  keywords: [
    "Luxury Marble",
    "Italian Carrara",
    "RK Marble",
    "Somany Ceramics",
    "Nero Marquina",
    "Emerald Onyx",
    "Calacatta Viola",
    "Taj Mahal Quartzite",
    "3D Showroom",
    "Architectural Stone",
  ],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Aurelia Marmi | Premium Luxury Marble & Natural Stone",
    description:
      "Immerse yourself in world-class natural stone craftsmanship. Explore our interactive 3D showroom, procedural marble slab configurators, and AI room visuals.",
    url: "https://aureliamarmi.com",
    siteName: "Aurelia Marmi",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-500 bg-white text-black dark:bg-black dark:text-white">
        <AuthProvider>
          <ThemeProvider>
            <AppProvider>
              <SmoothScroll>
                <div className="flex flex-col min-h-screen relative overflow-x-hidden">
                  <NavBar />
                  <main className="flex-grow pt-20">{children}</main>
                  <Footer />
                  <AiChatbot />
                  <WhatsAppWidget />
                </div>
              </SmoothScroll>
            </AppProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

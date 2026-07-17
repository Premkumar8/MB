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
    default: "Sharma Marble | Premium Tiles & Natural Stone",
    template: "%s | Sharma Marble",
  },
  description:
    "Explore our vast collection of premium tiles, granites, and natural stone. Featuring top brands like Somany Ceramics and world-class craftsmanship for your home and business.",
  keywords: [
    "Luxury Marble",
    "Italian Carrara",
    "Sharma Marble",
    "Somany Ceramics",
    "Tiles",
    "Granites",
    "Architectural Stone",
  ],
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Sharma Marble | Premium Tiles & Natural Stone",
    description:
      "Explore our vast collection of premium tiles, granites, and natural stone.",
    url: "https://sharmamarble.com",
    siteName: "Sharma Marble",
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

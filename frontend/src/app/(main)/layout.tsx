import React from "react";
import SmoothScroll from "@/components/SmoothScroll";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AiChatbot from "@/components/AiChatbot";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScroll>
      <div className="flex flex-col min-h-screen relative overflow-x-hidden">
        <NavBar />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
        <AiChatbot />
        <WhatsAppWidget />
      </div>
    </SmoothScroll>
  );
}

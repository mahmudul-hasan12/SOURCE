import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CategoryBar } from "@/components/CategoryBar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "SkySourcing BD - Direct Global Factory Wholesale Sourcing in Bangladesh",
  description: "Source millions of products directly from verified manufacturers and factories in China. Quality inspection, air & sea cargo, and doorstep delivery across Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 pb-16 md:pb-0">
        <Navbar />
        <CategoryBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}

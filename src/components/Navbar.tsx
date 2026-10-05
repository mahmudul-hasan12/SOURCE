"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ShoppingCart, 
  Plane, 
  Ship, 
  ShieldCheck, 
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  Command,
  Settings,
  MessageCircle
} from "lucide-react";
import { QuickCartDrawer } from "./QuickCartDrawer";

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("omnibar-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchQuery.startsWith("http://") || searchQuery.startsWith("https://")) {
      router.push(`/search?url=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(11,19,43,0.04)]">
        {/* Top Industrial Logistics Ticker */}
        <div className="bg-cargo-950 text-white text-xs py-2 px-4 border-b border-cargo-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="flex items-center gap-2 bg-cargo-900/90 px-3 py-0.5 rounded-full border border-cargo-700/60 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse"></span>
                <span className="text-freight-amber font-mono font-semibold tabular-nums text-[11px]">
                  LIVE RMB: 1.00 = ৳19.60 BDT
                </span>
              </div>
              
              <div className="hidden md:flex items-center gap-3 text-slate-300 text-xs">
                <span className="flex items-center gap-1.5 hover:text-white transition">
                  <Plane className="w-3.5 h-3.5 text-transit-air" />
                  <span>Guangzhou Air Cargo: <strong className="text-white font-mono">10–18d (৳750/kg)</strong></span>
                </span>
                <span className="text-cargo-700">•</span>
                <span className="flex items-center gap-1.5 hover:text-white transition">
                  <Ship className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sea Freight: <strong className="text-white font-mono">30–45d (৳220/kg)</strong></span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-xs">
              <Link 
                href="/track" 
                className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-white transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-qc-emerald" />
                <span>Track Parcel</span>
              </Link>

              <Link 
                href="/warehouse" 
                className="hidden sm:flex items-center gap-1.5 bg-cargo-800 hover:bg-cargo-700 text-amber-300 border border-cargo-600 px-3 py-1 rounded-md font-medium transition btn-tactile"
                title="Private China Sourcing & Quality Control Desk"
              >
                <Package className="w-3.5 h-3.5 text-freight-amber" />
                <span>China Warehouse</span>
              </Link>

              <a 
                href="https://wa.me/8801700000000?text=Hello%20SkySourcing%20BD,%20I%20want%20to%20source%20products%20from%20China"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/60 px-2.5 py-1 rounded-md font-medium transition text-xs btn-tactile"
                title="Chat with China Sourcing Agent on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>

              <Link 
                href="/admin" 
                className="text-slate-400 hover:text-white flex items-center gap-1 transition p-1"
                title="Exchange Rate & Tariff Admin"
              >
                <Settings className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3.5">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group btn-tactile">
              <div className="bg-cargo-900 border border-cargo-700 text-white font-black text-base sm:text-lg w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md group-hover:border-freight-amber transition">
                <span className="text-freight-amber">S</span>B
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-cargo-900">
                    Sky<span className="text-transit-air">Sourcing</span>
                  </span>
                  <span className="bg-cargo-900 text-freight-amber font-mono text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider border border-cargo-700">
                    BD
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-slate-500 block leading-none font-medium mt-0.5 hidden xs:block">
                  Direct Factory Wholesale • 50% Advance
                </span>
              </div>
            </Link>

            {/* Desktop Command Omnibar (>= 768px) */}
            <div className="hidden md:block flex-1 max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-slate-50/90 border border-slate-300/80 rounded-xl overflow-hidden focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 focus-within:bg-white transition-all shadow-xs">
                  <input
                    id="omnibar-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Paste 1688 / Taobao link or search wholesale goods..."
                    className="w-full py-2.5 pl-4 pr-24 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                  />
                  
                  {/* Keyboard Shortcut Hint */}
                  <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded mr-1.5 pointer-events-none">
                    <Command className="w-3 h-3" />
                    <span>K</span>
                  </div>

                  <button
                    type="submit"
                    className="bg-cargo-900 hover:bg-cargo-800 active:scale-[0.98] text-white px-5 py-2.5 font-bold text-sm flex items-center gap-1.5 transition flex-shrink-0 border-l border-cargo-800 btn-tactile"
                  >
                    <Search className="w-4 h-4 text-freight-amber" />
                    <span>Search</span>
                  </button>
                </div>

                {/* Real-time Link Detection Alert */}
                {(searchQuery.includes("1688.com") || searchQuery.includes("taobao.com") || searchQuery.includes("tmall.com")) && (
                  <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mt-1 shadow-xs animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-qc-emerald" />
                    <span>
                      {searchQuery.includes("1688.com") ? "1688 Direct Factory Link Detected" : "Taobao / Tmall Listing Detected"} • Press Enter to Auto-Resolve
                    </span>
                  </div>
                )}
              </form>

              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 overflow-x-auto whitespace-nowrap">
                <span className="font-semibold text-slate-600">Popular:</span>
                <Link href="/search?q=earbuds" className="hover:text-cargo-900 underline decoration-slate-300">Wireless Earbuds</Link>
                <span>•</span>
                <Link href="/search?q=backpack" className="hover:text-cargo-900 underline decoration-slate-300">Laptop Bags</Link>
                <span>•</span>
                <Link href="/search?q=sneakers" className="hover:text-cargo-900 underline decoration-slate-300">Sneakers</Link>
                <span>•</span>
                <Link href="/search?q=smartwatch" className="hover:text-cargo-900 underline decoration-slate-300">Smartwatches</Link>
              </div>
            </div>

            {/* Right Action: Quick Cart Drawer Trigger */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(true)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 px-3 py-2 rounded-xl transition shadow-xs group btn-tactile text-left"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-cargo-900 group-hover:scale-105 transition" />
                  <span className="absolute -top-2 -right-2 bg-freight-amber text-cargo-950 font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold leading-none">Order</div>
                  <div className="text-xs font-bold text-cargo-900 leading-tight">৳3,450</div>
                </div>
              </button>
            </div>
          </div>

          {/* Dedicated Full-Width Search Omnibar on Mobile (< 768px) */}
          <div className="md:hidden mt-2 pt-1 border-t border-slate-100">
            <form onSubmit={handleSearch} className="space-y-1.5">
              <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl overflow-hidden focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 focus-within:bg-white transition-all shadow-xs p-0.5">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Paste 1688 / Taobao link or search..."
                  className="flex-1 py-2 px-3 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                
                {/* One-tap Paste button from clipboard */}
                <button
                  type="button"
                  title="Paste link from clipboard"
                  onClick={async () => {
                    try {
                      if (navigator.clipboard) {
                        const clip = await navigator.clipboard.readText();
                        if (clip) setSearchQuery(clip.trim());
                      }
                    } catch (e) {}
                  }}
                  className="px-2 py-1 bg-slate-200/80 hover:bg-slate-300 text-cargo-900 rounded text-[10px] font-mono font-semibold transition mr-1 btn-tactile"
                >
                  Paste
                </button>

                <button
                  type="submit"
                  className="bg-cargo-900 hover:bg-cargo-800 active:scale-[0.98] text-white px-3.5 py-2 font-bold text-xs flex items-center gap-1 transition rounded-lg btn-tactile"
                >
                  <Search className="w-3.5 h-3.5 text-freight-amber" />
                  <span>Inspect</span>
                </button>
              </div>

              {/* Mobile Real-Time Link Detection Alert */}
              {(searchQuery.includes("1688.com") || searchQuery.includes("taobao.com") || searchQuery.includes("tmall.com")) && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-qc-emerald" />
                  <span>
                    {searchQuery.includes("1688.com") ? "1688 Direct Factory Link" : "Taobao / Tmall Link"} • Tap Inspect
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </header>

      {/* Quick Cart Slide-Over Drawer */}
      <QuickCartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={() => setIsCartDrawerOpen(false)} 
      />
    </>
  );
}

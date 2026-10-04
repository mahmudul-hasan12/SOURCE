"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, Package, Truck } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: 1 },
    { name: "Track", href: "/orders/ord-8910/track", icon: Truck },
    { name: "China Desk", href: "/warehouse", icon: Package, highlight: true }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-cargo-950/95 backdrop-blur-md border-t border-cargo-800 shadow-cargo-lg py-1.5 px-3">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-3 rounded-xl transition text-[11px] font-semibold relative active:scale-95 ${
                link.highlight 
                  ? "text-freight-amber font-bold"
                  : isActive
                  ? "text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${link.highlight ? "text-freight-amber" : ""}`} />
                {link.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-freight-amber text-cargo-950 font-mono font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-tight">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

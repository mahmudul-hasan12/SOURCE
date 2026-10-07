"use client";

import React from "react";
import Link from "next/link";
import { 
  Headphones, 
  Briefcase, 
  Footprints, 
  Watch, 
  Shirt, 
  Wrench, 
  Home, 
  Grid,
  Sparkles,
  Calculator
} from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "সব পণ্য (All)", icon: Grid, href: "/" },
  { id: "rfq", name: "ছবি দিয়ে খুঁজুন (RFQ)", icon: Sparkles, href: "/rfq" },
  { id: "calculator", name: "শিপিং ক্যালকুলেটর", icon: Calculator, href: "/calculator" },
  { id: "fashion", name: "পোশাক (Apparel)", icon: Shirt, href: "/search?q=garments" },
  { id: "electronics", name: "ইলেকট্রনিক্স (Gadgets)", icon: Headphones, href: "/search?q=electronics" },
  { id: "bags", name: "ব্যাগ ও লাগেজ (Bags)", icon: Briefcase, href: "/search?q=bag" },
  { id: "shoes", name: "জুতো (Shoes)", icon: Footprints, href: "/search?q=shoes" },
  { id: "industrial", name: "যন্ত্রপাতি (Tools)", icon: Wrench, href: "/search?q=industrial" },
  { id: "home", name: "হোম ডেকর (Home)", icon: Home, href: "/search?q=home" },
];

export function CategoryBar() {
  return (
    <div className="bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isFirst = idx === 0;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition flex-shrink-0 active:scale-[0.98] ${
                  isFirst
                    ? "bg-cargo-900 text-freight-amber border border-cargo-800 shadow-xs"
                    : "text-slate-600 hover:text-cargo-900 hover:bg-slate-100/80 border border-transparent hover:border-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isFirst ? "text-freight-amber" : "text-slate-400 group-hover:text-cargo-900"}`} />
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

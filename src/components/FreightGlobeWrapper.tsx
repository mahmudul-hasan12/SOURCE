"use client";

import React from "react";
import nextDynamic from "next/dynamic";

const FreightGlobe3D = nextDynamic(
  () => import("@/components/FreightGlobe3D").then((mod) => mod.FreightGlobe3D),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl bg-cargo-900/90 border border-cargo-800 p-6 h-[420px] flex flex-col items-center justify-center text-xs text-slate-400 font-mono">
        <div className="w-8 h-8 rounded-full border-2 border-freight-amber border-t-transparent animate-spin mb-3" />
        <span>Loading Guangzhou ➜ Dhaka Corridor...</span>
      </div>
    ),
  }
);

export function FreightGlobeWrapper() {
  return <FreightGlobe3D />;
}

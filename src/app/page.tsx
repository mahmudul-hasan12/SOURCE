import React from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Percent, 
  Plane, 
  Ship, 
  Package, 
  Layers
} from "lucide-react";
import { StorageService } from "@/lib/db";
import { calculateTierPriceBdt } from "@/lib/pricing";
import { LiveCalculator } from "@/components/LiveCalculator";
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

export default async function HomePage() {
  const rawProducts = await StorageService.getProducts();
  const products = rawProducts.map((p) => ({
    ...p,
    sourcePlatform: "FACTORY_DIRECT" as const,
    url: "",
    images: p.images.map((img) => img.replace(/1688\+Product/g, "Factory+Direct"))
  }));
  const settings = await StorageService.getSettings();

  return (
    <div className="space-y-12 pb-20">
      {/* Asymmetric Industrial Trade Terminal Hero */}
      <section className="bg-cargo-950 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 relative overflow-hidden border-b border-cargo-850">
        {/* Editorial Cargo Port Background Cover Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 sm:opacity-90 pointer-events-none transition-opacity duration-700"
          style={{ backgroundImage: "url('/hero-cover.jpg')" }}
        />
        {/* Directional contrast vignette: keeps left text crisp while letting illuminated cargo ships and port cranes shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-cargo-950/95 via-cargo-950/65 to-cargo-950/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-cargo-950/90 via-transparent to-cargo-950/50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (7 cols): Value Prop & Sourcing Omnibar */}
            <div className="lg:col-span-7 space-y-6 bg-cargo-950/50 p-3 sm:p-6 rounded-3xl backdrop-blur-xs border border-cargo-750/30">
              {/* Corridor Status Strip */}
              <div className="inline-flex items-center gap-2.5 bg-cargo-900/90 border border-cargo-750 px-3.5 py-1.5 rounded-full text-xs font-mono shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse"></span>
                <span className="text-freight-amber font-semibold">Guangzhou Hub Live</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Direct Factory Wholesale Pipeline to BD</span>
              </div>

              {/* 2-Line Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-white">
                Direct-from-Factory Sourcing at{" "}
                <span className="text-freight-amber underline decoration-freight-amber/35 decoration-4 underline-offset-4">
                  Wholesale Rates
                </span>
              </h1>

              {/* Strict 18-word subtext */}
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                Verified Chinese manufacturers, pre-shipment Guangzhou QC inspection, customs-cleared air and sea freight, door delivery across Bangladesh.
              </p>

              {/* Universal Sourcing Omnibar */}
              <div className="bg-cargo-900/95 border border-cargo-700/90 rounded-2xl p-3 sm:p-5 shadow-cargo space-y-3">
                <form action="/search" method="GET" className="space-y-3">
                  <div className="flex items-center bg-cargo-950/90 border border-cargo-700 rounded-xl overflow-hidden focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 transition p-1.5">
                    <input
                      id="omnibar-input"
                      type="text"
                      name="url"
                      placeholder="Paste factory product URL or catalog code (e.g. 4040 aluminum, PU stone)..."
                      className="flex-1 px-3.5 py-2.5 bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black px-5 py-2.5 rounded-lg text-xs sm:text-sm transition flex items-center gap-2 flex-shrink-0 shadow-xs btn-tactile"
                    >
                      <Search className="w-4 h-4 text-cargo-950" />
                      <span>Inspect</span>
                    </button>
                  </div>

                  {/* Trending Wholesale Catalogs */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                    <span className="text-slate-500 font-mono text-[11px]">Factory Catalogs:</span>
                    <Link 
                      href="/product/prod-891230491823" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px]"
                    >
                      4040 Aluminum
                    </Link>
                    <Link 
                      href="/product/prod-982144879342" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px]"
                    >
                      PU Stone Wall
                    </Link>
                    <Link 
                      href="/product/prod-whl-001" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px]"
                    >
                      ANC Earbuds
                    </Link>
                  </div>
                </form>

                {/* Trade Guarantees Strip */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cargo-800/80 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-cargo-800 text-freight-amber rounded-lg flex-shrink-0 mt-0.5">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">50% Advance Only</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">Lock factory production; balance on BD arrival.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-cargo-800 text-qc-emerald rounded-lg flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">Guangzhou Scale QC</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">Certified photo & gross weight verification.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): 3D Globe + Daily Corridor Ticker */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-center">
              <div className="rounded-2xl border border-cargo-750 bg-cargo-900/60 p-2 shadow-cargo">
                <FreightGlobe3D />
              </div>

              {/* Flight & Freight Tariff Card */}
              <div className="bg-cargo-900/80 border border-cargo-750 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-transit-air" />
                  <span className="text-white font-bold">Air Express: 10–18d</span>
                  <span className="text-slate-400">৳750/kg</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="w-4 h-4 text-indigo-400" />
                  <span className="text-white font-bold">Sea Cargo: 30–45d</span>
                  <span className="text-slate-400">৳220/kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operations Desk & Chrome Importer Ribbon */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-cargo-900 border border-cargo-750 rounded-2xl p-5 sm:p-6 text-white shadow-cargo flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-freight-amber text-cargo-950 font-black text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                1-Click Importer
              </span>
              <span className="text-xs text-slate-300">Browse Chinese Manufacturer Catalogs & Sync to Store</span>
            </div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Direct Chinese Supplier Extraction & Translation
            </h3>
            <p className="text-slate-400 text-xs max-w-xl">
              Extract high-res description blueprints, technical specifications, and tier pricing from Chinese suppliers with automated English translation.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/warehouse"
              className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 btn-tactile"
            >
              <Package className="w-4 h-4 text-cargo-950" />
              <span>Warehouse QC Desk</span>
            </Link>
            <Link
              href="/admin"
              className="bg-cargo-950 hover:bg-cargo-800 border border-cargo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 btn-tactile"
            >
              <Layers className="w-4 h-4 text-freight-amber" />
              <span>Admin Catalog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Landed Cost Calculator */}
      <section className="max-w-7xl mx-auto px-4">
        <LiveCalculator />
      </section>

      {/* Verified Factory Wholesale Products Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-freight-amber rounded-full"></span>
              <h2 className="text-2xl font-black text-cargo-900 tracking-tight">
                Verified Factory Wholesale Showcase
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Direct factory listings with tiered wholesale pricing, minimum order quantities (MOQ), and pre-shipment QC
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-mono">
            <ShieldCheck className="w-4 h-4 text-qc-emerald" />
            <span>Guangzhou QC Passed</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => {
            const firstTier = (product.priceTiers && product.priceTiers[0]) || { minQty: 1, priceRmb: product.basePriceRmb || 40, range: "1+ pcs" };
            const bestTier = (product.priceTiers && product.priceTiers[product.priceTiers.length - 1]) || firstTier;
            const { unitPriceBdt: startingBdt } = calculateTierPriceBdt(product.priceTiers || [firstTier], firstTier.minQty || 1);
            const { unitPriceBdt: lowestBdt } = calculateTierPriceBdt(product.priceTiers || [bestTier], bestTier.minQty || 1);
            const lowestRmb = (bestTier.priceRmb ?? (bestTier as any)?.price ?? product.basePriceRmb ?? 40);
            const highestRmb = (firstTier.priceRmb ?? (firstTier as any)?.price ?? product.basePriceRmb ?? 40);

            return (
              <div 
                key={product.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-cargo transition-all duration-300 hover:-translate-y-1 group flex flex-col"
              >
                {/* Image & Badges */}
                <Link 
                  href={`/product/${product.id}`}
                  className="relative aspect-square overflow-hidden bg-slate-100 block cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.titleEn}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 items-start">
                    <span className="bg-cargo-950 text-freight-amber font-mono font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs border border-cargo-800">
                      Direct Factory
                    </span>
                    {product.isSensitiveCargo && (
                      <span className="bg-amber-600 text-white font-bold text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs">
                        Battery Safe
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-cargo-900/90 text-white text-[9px] sm:text-[11px] font-mono font-medium px-1.5 sm:px-2 py-0.5 rounded tabular-nums">
                    MOQ: {product.minOrderQty} pcs
                  </span>
                </Link>

                {/* Content */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                      {product.location} Hub
                    </span>
                    <Link href={`/product/${product.id}`} className="block">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-tight sm:leading-snug group-hover:text-transit-air transition mt-0.5 cursor-pointer">
                        {product.titleEn}
                      </h3>
                    </Link>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {product.shopName}
                    </p>
                  </div>

                  {/* Pricing Tiers Table */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2 sm:p-3 space-y-1 sm:space-y-1.5 font-mono">
                    <div className="flex justify-between items-baseline text-[10px] sm:text-xs">
                      <span className="text-slate-500 font-sans text-[10px] sm:text-[11px]">Wholesale Tier:</span>
                      <div className="text-right">
                        <span className="text-cargo-900 font-black text-sm sm:text-base tabular-nums">৳{lowestBdt}</span>
                        {startingBdt !== lowestBdt && (
                          <span className="text-slate-400 text-[10px] sm:text-xs ml-1 font-normal tabular-nums hidden xs:inline">~ ৳{startingBdt}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-200">
                      <span className="truncate mr-1">¥{Number(lowestRmb).toFixed(1)} ~ ¥{Number(highestRmb).toFixed(1)}</span>
                      <span className="text-qc-emerald font-bold whitespace-nowrap">50%: ৳{Math.round(lowestBdt * 0.5)}</span>
                    </div>
                  </div>

                  {/* Action Link with Emil Kowalski tactility */}
                  <Link
                    href={`/product/${product.id}`}
                    className="w-full bg-cargo-900 hover:bg-cargo-800 text-white font-bold py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-xs text-center transition flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs btn-tactile min-h-[38px] sm:min-h-[42px]"
                  >
                    <span>Inspect Tiers</span>
                    <ArrowRight className="w-3.5 h-3.5 text-freight-amber" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guangzhou-to-Dhaka Trade Protocol Pipeline */}
      <section className="bg-white border-y border-slate-200/80 py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl font-black text-cargo-900 tracking-tight">
              The Guangzhou-to-Dhaka Trade Pipeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              End-to-end milestone protocol from factory floor in China to your business in Bangladesh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
              <span className="font-mono text-xs font-bold text-freight-amber bg-cargo-950 px-2.5 py-1 rounded inline-block">
                01 • SOURCING
              </span>
              <h4 className="font-bold text-sm text-cargo-900">Select or Paste Item</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any manufacturer product URL or choose from our factory showcase with live RMB-to-BDT calculation.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
              <span className="font-mono text-xs font-bold text-freight-amber bg-cargo-950 px-2.5 py-1 rounded inline-block">
                02 • ESCROW
              </span>
              <h4 className="font-bold text-sm text-cargo-900">50% Factory Advance</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay only 50% upfront via bKash, Nagad, or Bank to lock production directly with the Chinese manufacturer.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
              <span className="font-mono text-xs font-bold text-qc-emerald bg-cargo-950 px-2.5 py-1 rounded inline-block">
                03 • INTAKE QC
              </span>
              <h4 className="font-bold text-sm text-cargo-900">Guangzhou Hub QC</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inbound packages are weighed and photographed at our Guangzhou hub. View high-res QC photos in your account.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
              <span className="font-mono text-xs font-bold text-transit-air bg-cargo-950 px-2.5 py-1 rounded inline-block">
                04 • FREIGHT
              </span>
              <h4 className="font-bold text-sm text-cargo-900">Air / Sea Cargo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidated and dispatched via Air Cargo (10–18 days) or Sea Freight (30–45 days). Customs & taxes fully cleared.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-2.5">
              <span className="font-mono text-xs font-bold text-freight-amber bg-cargo-950 px-2.5 py-1 rounded inline-block">
                05 • ARRIVAL
              </span>
              <h4 className="font-bold text-sm text-cargo-900">Doorstep Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pay remaining 50% + shipping weight upon Dhaka arrival. Handed over to courier for fast door delivery.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

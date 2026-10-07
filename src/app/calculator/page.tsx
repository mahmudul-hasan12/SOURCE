"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calculator,
  Plane,
  Ship,
  Truck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Package,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { DEFAULT_SETTINGS, calculateShippingFee } from "@/lib/pricing";

interface PresetCategory {
  id: string;
  nameBn: string;
  nameEn: string;
  weightKg: number;
  emoji: string;
  samplePriceRmb: number;
}

const PRESETS: PresetCategory[] = [
  { id: "tshirt", nameBn: "টি-শার্ট / পোলো", nameEn: "T-Shirt / Polo", weightKg: 0.2, emoji: "👕", samplePriceRmb: 18 },
  { id: "jeans", nameBn: "ডেনিম জিন্স", nameEn: "Denim Jeans", weightKg: 0.65, emoji: "👖", samplePriceRmb: 38 },
  { id: "shoes", nameBn: "স্নিকার্স (বক্সসহ)", nameEn: "Sneakers / Shoes", weightKg: 0.95, emoji: "👟", samplePriceRmb: 45 },
  { id: "bag", nameBn: "ল্যাপটপ ব্যাকপ্যাক", nameEn: "Laptop Backpack", weightKg: 0.75, emoji: "🎒", samplePriceRmb: 32 },
  { id: "gadget", nameBn: "স্মার্টওয়াচ / ইয়ারবাডস", nameEn: "Smartwatch / Earbuds", weightKg: 0.15, emoji: "🎧", samplePriceRmb: 28 },
  { id: "jacket", nameBn: "উইন্টার জ্যাকেট / হুডি", nameEn: "Winter Jacket / Hoodie", weightKg: 0.85, emoji: "🧥", samplePriceRmb: 55 },
];

export default function CalculatorPage() {
  const settings = DEFAULT_SETTINGS;

  const [mode, setMode] = useState<"PRESET" | "WEIGHT" | "CBM">("PRESET");
  const [selectedPreset, setSelectedPreset] = useState<string>("tshirt");
  const [quantity, setQuantity] = useState<number>(50);
  const [customUnitWeightKg, setCustomUnitWeightKg] = useState<number>(0.3);
  const [unitPriceRmb, setUnitPriceRmb] = useState<number>(25);
  const [isSensitive, setIsSensitive] = useState<boolean>(false);
  const [deliveryLocation, setDeliveryLocation] = useState<"DHAKA" | "OUTSIDE_DHAKA">("DHAKA");

  // CBM Mode Dimensions (cm)
  const [lengthCm, setLengthCm] = useState<number>(50);
  const [widthCm, setWidthCm] = useState<number>(40);
  const [heightCm, setHeightCm] = useState<number>(30);
  const [cartonWeightKg, setCartonWeightKg] = useState<number>(15);
  const [cartonCount, setCartonCount] = useState<number>(2);

  // Determine Effective Weight
  let effectiveTotalWeightKg = 0;
  let effectiveTotalGoodsBdt = 0;

  if (mode === "PRESET") {
    const preset = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
    effectiveTotalWeightKg = Number((preset.weightKg * quantity).toFixed(2));
    const unitPriceBdt = Math.round(unitPriceRmb * settings.exchangeRateRmbToBdt * 1.12);
    effectiveTotalGoodsBdt = unitPriceBdt * quantity;
  } else if (mode === "WEIGHT") {
    effectiveTotalWeightKg = Number((customUnitWeightKg * quantity).toFixed(2));
    const unitPriceBdt = Math.round(unitPriceRmb * settings.exchangeRateRmbToBdt * 1.12);
    effectiveTotalGoodsBdt = unitPriceBdt * quantity;
  } else if (mode === "CBM") {
    const volumetricWeightPerCarton = (lengthCm * widthCm * heightCm) / 5000;
    const billedWeightPerCarton = Math.max(cartonWeightKg, volumetricWeightPerCarton);
    effectiveTotalWeightKg = Number((billedWeightPerCarton * cartonCount).toFixed(2));
    const unitPriceBdt = Math.round(unitPriceRmb * settings.exchangeRateRmbToBdt * 1.12);
    effectiveTotalGoodsBdt = unitPriceBdt * quantity;
  }

  // Calculate Shipping Costs
  const airRate = isSensitive ? settings.airRatePerKgSensitive : settings.airRatePerKgGeneral;
  const seaRate = settings.seaRatePerKg;
  const localCourier = deliveryLocation === "DHAKA" ? settings.localCourierDhaka : settings.localCourierOutsideDhaka;

  const airShippingCostBdt = Math.round(effectiveTotalWeightKg * airRate);
  const seaShippingCostBdt = Math.round(effectiveTotalWeightKg * seaRate);

  const airTotalLandedBdt = effectiveTotalGoodsBdt + airShippingCostBdt + localCourier;
  const seaTotalLandedBdt = effectiveTotalGoodsBdt + seaShippingCostBdt + localCourier;

  const airCostPerUnitBdt = quantity > 0 ? Math.round(airTotalLandedBdt / quantity) : 0;
  const seaCostPerUnitBdt = quantity > 0 ? Math.round(seaTotalLandedBdt / quantity) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 pb-24">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-cargo-900 border border-cargo-750 px-3.5 py-1.5 rounded-full text-xs font-mono text-freight-amber">
          <Calculator className="w-3.5 h-3.5 text-freight-amber" />
          <span>লাইভ শিপিং ও ল্যান্ডেড কস্ট ক্যালকুলেটর</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-cargo-900 tracking-tight leading-tight">
          চীন থেকে আমদানির এয়ার ও সি ফ্রেইট নিখুঁত হিসাব
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          আপনার পণ্যের ওজন বা জনপ্রিয় ক্যাটাগরি প্রিসেট বেছে নিন। ১০০% পণ্যের নিরাপদ পেমেন্ট এবং বাংলাদেশে পৌঁছালে প্রতি কেজি ওজনে ডেলিভারি চার্জের রিয়েলটাইম হিসাব দেখুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calculation Parameters (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Mode Switcher */}
          <div className="flex border-b border-slate-100 pb-3 justify-between items-center">
            <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-freight-amber" />
              <span>গণনার মোড নির্বাচন করুন</span>
            </h3>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("PRESET")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  mode === "PRESET" ? "bg-white text-cargo-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                জনপ্রিয় প্রিসেট
              </button>
              <button
                type="button"
                onClick={() => setMode("WEIGHT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  mode === "WEIGHT" ? "bg-white text-cargo-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                ওজন (KG)
              </button>
              <button
                type="button"
                onClick={() => setMode("CBM")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  mode === "CBM" ? "bg-white text-cargo-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                CBM কার্টন
              </button>
            </div>
          </div>

          {/* Mode 1: Presets Grid */}
          {mode === "PRESET" && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                পণ্যের ধরন সিলেক্ট করুন:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESETS.map((p) => {
                  const isSelected = selectedPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(p.id);
                        setUnitPriceRmb(p.samplePriceRmb);
                      }}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 active:scale-98 ${
                        isSelected
                          ? "border-freight-amber bg-amber-50/70 ring-2 ring-amber-300 shadow-xs"
                          : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-2xl">{p.emoji}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-cargo-900 block truncate">{p.nameBn}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">~{p.weightKg} kg/পিস</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mode 2: Custom Weight Mode */}
          {mode === "WEIGHT" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রতি পিসের আনুমানিক ওজন (Estimated Weight Per Piece in KG)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    value={customUnitWeightKg}
                    onChange={(e) => setCustomUnitWeightKg(parseFloat(e.target.value) || 0.1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-freight-amber focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-500 font-mono">KG</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">যেমন: ০.৩৫ কেজি (৩৫০ গ্রাম)</p>
              </div>
            </div>
          )}

          {/* Mode 3: CBM Carton Mode */}
          {mode === "CBM" && (
            <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="font-bold text-xs text-cargo-900">কার্টনের পরিমাপ (Dimensions in Centimeters):</div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">দৈর্ঘ্য (L cm)</label>
                  <input
                    type="number"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Number(e.target.value) || 10)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">প্রস্থ (W cm)</label>
                  <input
                    type="number"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value) || 10)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">উচ্চতা (H cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value) || 10)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">প্রতি কার্টন আসল ওজন (KG)</label>
                  <input
                    type="number"
                    value={cartonWeightKg}
                    onChange={(e) => setCartonWeightKg(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">মোট কার্টনের সংখ্যা</label>
                  <input
                    type="number"
                    value={cartonCount}
                    onChange={(e) => setCartonCount(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 border rounded-xl font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Unit Price Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                অর্ডারের মোট সংখ্যা (Quantity in Pcs)
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-freight-amber focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ফ্যাক্টরি রেট প্রতি পিস (Price in RMB ¥)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={unitPriceRmb}
                  onChange={(e) => setUnitPriceRmb(parseFloat(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-freight-amber focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-mono">¥</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                ≈ ৳{Math.round(unitPriceRmb * settings.exchangeRateRmbToBdt * 1.12)} BDT/পিস
              </span>
            </div>
          </div>

          {/* Delivery Location & Sensitive Goods Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                ডেলিভারি এরিয়া (Local Courier)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryLocation("DHAKA")}
                  className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                    deliveryLocation === "DHAKA"
                      ? "border-cargo-900 bg-cargo-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ঢাকার ভেতরে (৳৭০)
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryLocation("OUTSIDE_DHAKA")}
                  className={`py-2 px-3 rounded-xl border text-center transition font-semibold ${
                    deliveryLocation === "OUTSIDE_DHAKA"
                      ? "border-cargo-900 bg-cargo-900 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  ঢাকার বাইরে (৳১৩০)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                সংবেদনশীল পণ্য (Sensitive Cargo)
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSensitive}
                  onChange={(e) => setIsSensitive(e.target.checked)}
                  className="rounded text-freight-amber focus:ring-freight-amber w-4 h-4"
                />
                <span className="text-[11px] text-slate-600 font-medium">
                  ব্যাটারি / লিকুইড / ম্যাগনেট পণ্য (+৳২০০/কেজি)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Results & Landed Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Summary Box */}
          <div className="bg-cargo-950 text-white border border-cargo-800 rounded-3xl p-6 shadow-cargo-lg space-y-5">
            <div className="flex justify-between items-center border-b border-cargo-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
                  মোট বিলিং ওজন (Billed Weight)
                </span>
                <span className="text-2xl font-black text-freight-amber font-mono tabular-nums">
                  {effectiveTotalWeightKg} <span className="text-sm font-sans text-slate-400 font-normal">KG</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-mono block">১০০% পণ্যের মূল্য:</span>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  ৳{effectiveTotalGoodsBdt.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Air Cargo Card */}
            <div className="bg-cargo-900 border border-sky-500/40 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-transit-air flex items-center gap-1.5 font-sans">
                  <Plane className="w-4 h-4 text-transit-air" />
                  <span>এয়ার কার্গো (১০–১৮ দিন)</span>
                </span>
                <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded font-mono font-bold">
                  ৳{airRate}/কেজি
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>আন্তর্জাতিক ফ্রেইট ফি:</span>
                  <span className="font-bold text-white tabular-nums">৳{airShippingCostBdt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>লোকাল কুরিয়ার ফি:</span>
                  <span className="font-bold text-white tabular-nums">৳{localCourier}</span>
                </div>
                <div className="pt-2 border-t border-cargo-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white font-sans">প্রতি পিস ল্যান্ডেড কস্ট:</span>
                  <span className="text-lg font-black text-freight-amber font-mono tabular-nums">
                    ৳{airCostPerUnitBdt}
                  </span>
                </div>
              </div>
            </div>

            {/* Sea Freight Card */}
            <div className="bg-cargo-900 border border-indigo-500/40 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-sans">
                  <Ship className="w-4 h-4 text-indigo-400" />
                  <span>সি ফ্রেইট (৩০–৪৫ দিন)</span>
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                  ৳{seaRate}/কেজি
                </span>
              </div>

              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>আন্তর্জাতিক ফ্রেইট ফি:</span>
                  <span className="font-bold text-white tabular-nums">৳{seaShippingCostBdt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>লোকাল কুরিয়ার ফি:</span>
                  <span className="font-bold text-white tabular-nums">৳{localCourier}</span>
                </div>
                <div className="pt-2 border-t border-cargo-800 flex justify-between items-center text-sm">
                  <span className="font-bold text-white font-sans">প্রতি পিস ল্যান্ডেড কস্ট:</span>
                  <span className="text-lg font-black text-qc-emerald font-mono tabular-nums">
                    ৳{seaCostPerUnitBdt}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-1 space-y-2">
              <Link
                href="/rfq"
                className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-98 text-cargo-950 font-black py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 btn-tactile"
              >
                <Sparkles className="w-4 h-4 text-cargo-950" />
                <span>এই পণ্যের জন্য ফ্যাক্টরি কোটেশন নিন (RFQ)</span>
              </Link>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-qc-emerald flex-shrink-0" />
                <span>কাস্টমস ট্যাক্স ও ডিউটি সম্পূর্ণ ক্লিয়ারড</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

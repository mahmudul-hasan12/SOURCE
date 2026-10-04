"use client";

import React, { useState } from "react";
import { Plane, Ship, ShieldCheck, Sliders, ArrowRight } from "lucide-react";
import { calculateShippingFee, calculateTwoStagePayment } from "@/lib/pricing";

export function LiveCalculator() {
  const [rmbPrice, setRmbPrice] = useState(45);
  const [quantity, setQuantity] = useState(10);
  const [unitWeightKg, setUnitWeightKg] = useState(0.3);
  const [shippingMethod, setShippingMethod] = useState<"AIR" | "SEA">("AIR");

  const exchangeRate = 17.50;
  const marginPercent = 12;

  // Calculations
  const unitPriceBdt = Math.round(rmbPrice * exchangeRate * (1 + marginPercent / 100));
  const productTotalBdt = unitPriceBdt * quantity;
  const totalWeightKg = Number((unitWeightKg * quantity).toFixed(2));

  const { shippingCostBdt } = calculateShippingFee(totalWeightKg, shippingMethod);
  const paymentBreakdown = calculateTwoStagePayment(productTotalBdt, shippingCostBdt, 70, 50);

  return (
    <div className="bg-cargo-900 border border-cargo-750 text-white rounded-2xl p-6 sm:p-8 shadow-cargo relative overflow-hidden">
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-cargo-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cargo-800 border border-cargo-700 text-freight-amber rounded-xl shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  Guangzhou-to-Dhaka Landed Tariff Simulator
                </h3>
                <span className="bg-cargo-950 text-freight-amber text-[10px] font-mono uppercase px-2 py-0.5 rounded border border-cargo-800 font-bold">
                  Live BDT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Simulate ex-factory RMB cost, wholesale quantity, and freight tariffs in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-cargo-950 border border-cargo-750 px-3.5 py-1.5 rounded-full text-xs self-start sm:self-auto font-mono tabular-nums shadow-xs">
            <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse"></span>
            <span className="text-slate-300">Spot Rate:</span>
            <span className="text-freight-amber font-bold">1 RMB = ৳17.50 BDT</span>
          </div>
        </div>

        {/* Input Parameters Bento Matrix with Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Factory Price */}
          <div className="bg-cargo-950 border border-cargo-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Factory Price</span>
              <span className="text-freight-amber font-mono font-bold text-sm">¥{rmbPrice} RMB</span>
            </div>
            <input
              type="range"
              min="5"
              max="300"
              step="1"
              value={rmbPrice}
              onChange={(e) => setRmbPrice(parseFloat(e.target.value))}
              className="w-full accent-freight-amber cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>¥5</span>
              <span className="text-slate-400">≈ ৳{unitPriceBdt}/pc</span>
              <span>¥300</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="bg-cargo-950 border border-cargo-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Wholesale Volume</span>
              <span className="text-white font-mono font-bold text-sm">{quantity} pcs</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-full accent-transit-air cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 pc</span>
              <span className="text-slate-400">MOQ Ladder</span>
              <span>200 pcs</span>
            </div>
          </div>

          {/* Unit Weight */}
          <div className="bg-cargo-950 border border-cargo-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Unit Scale Weight</span>
              <span className="text-white font-mono font-bold text-sm">{unitWeightKg} kg</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.05"
              value={unitWeightKg}
              onChange={(e) => setUnitWeightKg(parseFloat(e.target.value))}
              className="w-full accent-qc-emerald cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1 kg</span>
              <span className="text-slate-400">Gross: {totalWeightKg} kg</span>
              <span>5.0 kg</span>
            </div>
          </div>

          {/* Freight Route */}
          <div className="bg-cargo-950 border border-cargo-800 p-4 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Freight Corridor</span>
              <span className="text-slate-400 font-mono text-[10px]">Customs Included</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setShippingMethod("AIR")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 btn-tactile ${
                  shippingMethod === "AIR" 
                    ? "bg-transit-air text-white shadow-xs" 
                    : "bg-cargo-850 text-slate-400 hover:text-white"
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Air (10–18d)</span>
              </button>
              <button
                type="button"
                onClick={() => setShippingMethod("SEA")}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 btn-tactile ${
                  shippingMethod === "SEA" 
                    ? "bg-indigo-600 text-white shadow-xs" 
                    : "bg-cargo-850 text-slate-400 hover:text-white"
                }`}
              >
                <Ship className="w-3.5 h-3.5" />
                <span>Sea (30–45d)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calculation Output Bento */}
        <div className="bg-cargo-950 border border-cargo-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          {/* Estimated Total */}
          <div className="space-y-1 md:border-r md:border-cargo-850 md:pr-4">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block font-mono">
              Estimated Total Landed ({quantity} pcs)
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums tracking-tight">
              ৳{(paymentBreakdown.grandTotalBdt).toLocaleString()} <span className="text-xs font-sans font-medium text-slate-400">BDT</span>
            </div>
            <div className="text-xs text-slate-400 font-mono tabular-nums">
              Landed per unit: ~৳{Math.round(paymentBreakdown.grandTotalBdt / quantity)}/pc • Gross: {totalWeightKg} kg
            </div>
          </div>

          {/* Stage 1 Box */}
          <div className="bg-emerald-950/30 border border-qc-emerald/40 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-qc-emerald font-bold tracking-wider uppercase font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-qc-emerald"></span>
                Stage 1 (Pay Now)
              </span>
              <span className="text-[10px] bg-qc-emerald/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                50% Advance
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-emerald-300 tabular-nums">
              ৳{paymentBreakdown.advanceAmountBdt.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Deposit required to lock factory order and start Guangzhou warehouse intake.
            </p>
          </div>

          {/* Stage 2 Box */}
          <div className="bg-cargo-900 border border-cargo-750 p-4 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-freight-amber font-bold tracking-wider uppercase font-mono">
                Stage 2 (Pay on BD Arrival)
              </span>
              <span className="text-[10px] bg-cargo-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                Remaining 50% + Freight
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-freight-amber tabular-nums">
              ৳{paymentBreakdown.stage2TotalPayableBdt.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Paid upon customs clearance at Dhaka Hub, including {shippingMethod === "AIR" ? "Air" : "Sea"} cargo (৳{shippingCostBdt.toLocaleString()}).
            </p>
          </div>
        </div>

        {/* Guangzhou Warehouse QC Guarantee Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-cargo-950 border border-cargo-800 px-4 py-3 rounded-xl text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-qc-emerald flex-shrink-0" />
            <span>
              <strong>Guangzhou QC Guarantee:</strong> Packages weighed and photographed before international dispatch.
            </span>
          </div>
          <span className="text-freight-amber font-semibold flex-shrink-0">
            Zero Hidden Customs Fees
          </span>
        </div>
      </div>
    </div>
  );
}

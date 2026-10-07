"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Trash2, 
  ArrowRight, 
  Plane, 
  Ship, 
  ShieldCheck, 
  Clock,
  Package,
  Layers,
  CheckCircle2
} from "lucide-react";
import { getClientProducts } from "@/lib/seed-data";
import { calculateTwoStagePayment } from "@/lib/pricing";

export default function CartPage() {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(2);
  const [shippingMethod, setShippingMethod] = useState<"AIR" | "SEA">("AIR");

  useEffect(() => {
    const products = getClientProducts();
    if (products.length > 0) {
      setProduct(products[0]);
    }
  }, []);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center text-slate-500 font-mono">
        Loading wholesale cart...
      </div>
    );
  }

  const unitPriceBdt = Math.round(product.basePriceRmb * 17.5 * 1.12);
  const totalPriceBdt = unitPriceBdt * quantity;
  const shippingCostBdt = shippingMethod === "AIR" 
    ? Math.round(product.estimatedWeightKg * quantity * 750) 
    : Math.round(product.estimatedWeightKg * quantity * 220);

  const breakdown = calculateTwoStagePayment(totalPriceBdt, shippingCostBdt, 70, 100);

  const handleProceed = () => {
    const checkoutItem = {
      product,
      sku: product.skus[0],
      quantity,
      shippingMethod,
      unitPriceBdt,
      totalPriceBdt,
      shippingCostBdt,
      advanceAmountBdt: breakdown.advanceAmountBdt,
      stage2TotalPayableBdt: breakdown.stage2TotalPayableBdt
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("skysourcing_checkout", JSON.stringify(checkoutItem));
    }
    router.push("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-20">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cargo-900 text-freight-amber rounded-xl">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-cargo-900 tracking-tight">
            Wholesale Procurement Cart
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Review your items and select your international freight corridor. 100% product price is paid to order, delivery charge is per kg upon arrival.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex gap-4 items-center">
              <img
                src={product.images[0]}
                alt={product.titleEn}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] bg-cargo-950 text-freight-amber font-mono font-bold px-2 py-0.5 rounded border border-cargo-800">
                  Factory Direct
                </span>
                <h3 className="font-bold text-sm text-cargo-900 mt-1 line-clamp-1">
                  {product.titleEn}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  SKU: {product.skus[0]?.name || "Standard Model"}
                </div>
                <div className="text-sm font-black text-cargo-900 font-mono mt-1 tabular-nums">
                  ৳{unitPriceBdt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ unit</span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden font-mono">
                <button
                  onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-cargo-900 font-bold text-xs transition active:scale-95"
                >
                  -
                </button>
                <span className="px-3 py-1.5 font-bold text-xs text-cargo-950 tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-cargo-900 font-bold text-xs transition active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Subtotal ({quantity} units):</span>
              <span className="font-mono font-black text-cargo-900 text-base tabular-nums">
                ৳{totalPriceBdt.toLocaleString()} BDT
              </span>
            </div>
          </div>

          {/* Shipping Choice in Cart */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs text-cargo-900 uppercase tracking-wider">
              Select International Logistics Route:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingMethod("AIR")}
                className={`p-3.5 rounded-xl border text-left text-xs transition active:scale-[0.99] ${
                  shippingMethod === "AIR" 
                    ? "border-transit-air bg-sky-50/70 font-bold text-cargo-900 ring-2 ring-transit-air/20" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-transit-air" />
                    <span>Air Cargo (10–18 Days)</span>
                  </div>
                  {shippingMethod === "AIR" && <CheckCircle2 className="w-4 h-4 text-transit-air" />}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 font-normal tabular-nums">৳750/kg (Tax paid)</div>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod("SEA")}
                className={`p-3.5 rounded-xl border text-left text-xs transition active:scale-[0.99] ${
                  shippingMethod === "SEA" 
                    ? "border-indigo-600 bg-indigo-50/70 font-bold text-cargo-900 ring-2 ring-indigo-200" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-4 h-4 text-indigo-600" />
                    <span>Sea Freight (30–45 Days)</span>
                  </div>
                  {shippingMethod === "SEA" && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1 font-normal tabular-nums">৳220/kg (Wholesale)</div>
              </button>
            </div>
          </div>
        </div>

        {/* Two-Stage Payment Summary (5 cols) */}
        <div className="lg:col-span-5 bg-cargo-950 text-white border border-cargo-800 rounded-2xl p-6 shadow-cargo-lg space-y-5">
          <div className="border-b border-cargo-800 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Payment Schedule</h3>
            <span className="text-[10px] bg-cargo-900 text-qc-emerald font-mono px-2 py-0.5 rounded border border-cargo-700">
              100% Product Payment
            </span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Goods Total:</span>
              <span className="font-bold text-white tabular-nums">৳{totalPriceBdt.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Est. {shippingMethod === "AIR" ? "Air" : "Sea"} Shipping:</span>
              <span className="font-bold text-white tabular-nums">৳{shippingCostBdt.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-slate-400">
              <span>Local Courier in BD:</span>
              <span className="font-bold text-white tabular-nums">৳70</span>
            </div>

            <div className="pt-3 border-t border-cargo-800 space-y-2.5">
              <div className="bg-cargo-900 border border-qc-emerald/40 p-3.5 rounded-xl flex justify-between items-center">
                <div>
                  <span className="font-bold text-xs text-qc-emerald block">PAY NOW (100% GOODS)</span>
                  <span className="text-[10px] text-slate-400 font-sans">Full product order payment</span>
                </div>
                <span className="text-xl font-black text-white tabular-nums">৳{breakdown.advanceAmountBdt.toLocaleString()}</span>
              </div>

              <div className="bg-cargo-900 border border-cargo-700 p-3.5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-freight-amber block">ON BD ARRIVAL</span>
                  <span className="text-[10px] text-slate-400 font-sans">International Freight (Per Kg) + Local Courier</span>
                </div>
                <span className="font-bold text-base text-white tabular-nums">৳{breakdown.stage2TotalPayableBdt.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 rounded-xl text-xs sm:text-sm transition shadow-amber-glow flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout (৳{breakdown.advanceAmountBdt.toLocaleString()})</span>
            <ArrowRight className="w-4 h-4 text-cargo-950" />
          </button>
        </div>
      </div>
    </div>
  );
}

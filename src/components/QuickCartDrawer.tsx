"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  X, 
  ShoppingCart, 
  Plane, 
  Ship, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Trash2,
  Package
} from "lucide-react";
import { getClientProducts } from "@/lib/seed-data";
import { calculateTwoStagePayment } from "@/lib/pricing";

interface QuickCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickCartDrawer({ isOpen, onClose }: QuickCartDrawerProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(5);
  const [shippingMethod, setShippingMethod] = useState<"AIR" | "SEA">("AIR");

  useEffect(() => {
    const products = getClientProducts();
    if (products.length > 0) {
      setProduct(products[0]);
    }
  }, []);

  if (!isOpen) return null;

  const unitPriceBdt = product ? Math.round(product.basePriceRmb * 17.5 * 1.12) : 700;
  const totalPriceBdt = unitPriceBdt * quantity;
  const shippingCostBdt = shippingMethod === "AIR" 
    ? Math.round((product?.estimatedWeightKg || 0.3) * quantity * 750) 
    : Math.round((product?.estimatedWeightKg || 0.3) * quantity * 220);

  const breakdown = calculateTwoStagePayment(totalPriceBdt, shippingCostBdt, 70, 100);

  const handleCheckout = () => {
    onClose();
    const checkoutItem = {
      product,
      sku: product?.skus?.[0],
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
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-cargo-950/60 backdrop-blur-xs transition-opacity duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-drawer-in border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-cargo-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cargo-900 text-freight-amber rounded-xl">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Wholesale Queue</h3>
                <span className="text-[10px] text-slate-400 font-mono">1 Item In Cart</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cargo-800 transition btn-tactile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {product && (
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3.5">
                <div className="flex gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.titleEn}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] bg-cargo-950 text-freight-amber font-mono font-bold px-1.5 py-0.5 rounded">
                      Factory Direct
                    </span>
                    <h4 className="font-bold text-xs text-cargo-900 truncate mt-1">
                      {product.titleEn}
                    </h4>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      ৳{unitPriceBdt.toLocaleString()} / unit
                    </div>
                  </div>
                </div>

                {/* Quantity Controls with Emil Kowalski tactility */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="text-slate-500 font-medium">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden font-mono bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                      className="px-2.5 py-1 text-xs font-bold text-cargo-900 bg-slate-50 hover:bg-slate-100 btn-tactile"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs text-cargo-950 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-xs font-bold text-cargo-900 bg-slate-50 hover:bg-slate-100 btn-tactile"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono font-bold text-cargo-900">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">৳{totalPriceBdt.toLocaleString()} BDT</span>
                </div>
              </div>
            )}

            {/* Route Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cargo-900 block">
                Logistics Route to Bangladesh:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShippingMethod("AIR")}
                  className={`p-2.5 rounded-xl border text-left text-xs transition btn-tactile ${
                    shippingMethod === "AIR"
                      ? "border-transit-air bg-sky-50 font-bold text-cargo-900 ring-2 ring-transit-air/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-transit-air" />
                    <span>Air (10–18d)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">৳750/kg</div>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod("SEA")}
                  className={`p-2.5 rounded-xl border text-left text-xs transition btn-tactile ${
                    shippingMethod === "SEA"
                      ? "border-indigo-600 bg-indigo-50 font-bold text-cargo-900 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sea (30–45d)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">৳220/kg</div>
                </button>
              </div>
            </div>

            {/* Two-Stage Schedule in Drawer */}
            <div className="bg-cargo-950 text-white rounded-2xl p-4 space-y-3 font-mono border border-cargo-800">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-cargo-800">
                <span className="text-slate-400">Total Landed Est:</span>
                <span className="font-bold tabular-nums">৳{(breakdown.grandTotalBdt).toLocaleString()}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-cargo-900 border border-qc-emerald/40 p-2.5 rounded-xl flex justify-between items-center">
                  <div>
                    <span className="text-[11px] font-bold text-qc-emerald block">PAY NOW (100% GOODS)</span>
                    <span className="text-[9px] text-slate-400 font-sans">Full product order payment</span>
                  </div>
                  <span className="text-base font-black text-white tabular-nums">
                    ৳{breakdown.advanceAmountBdt.toLocaleString()}
                  </span>
                </div>

                <div className="bg-cargo-900 border border-cargo-700 p-2.5 rounded-xl flex justify-between items-center text-slate-300">
                  <div>
                    <span className="text-[11px] font-bold text-freight-amber block">BD ARRIVAL</span>
                    <span className="text-[9px] text-slate-400 font-sans">International Freight (Per Kg) + Courier</span>
                  </div>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ৳{breakdown.stage2TotalPayableBdt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="p-5 border-t border-slate-100 space-y-2 bg-slate-50">
            <button
              onClick={handleCheckout}
              className="w-full bg-freight-amber hover:bg-freight-amberHover text-cargo-950 font-black py-3.5 rounded-xl text-xs transition shadow-amber-glow flex items-center justify-center gap-2 btn-tactile"
            >
              <span>Proceed to Checkout (৳{breakdown.advanceAmountBdt.toLocaleString()})</span>
              <ArrowRight className="w-4 h-4 text-cargo-950" />
            </button>
            <Link
              href="/cart"
              onClick={onClose}
              className="w-full text-center block text-xs font-semibold text-slate-600 hover:text-cargo-900 py-1.5 transition"
            >
              View Full Cart Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

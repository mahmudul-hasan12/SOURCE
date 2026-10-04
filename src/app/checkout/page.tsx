"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  CreditCard, 
  Plane, 
  Ship, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
  Building
} from "lucide-react";
import { getClientProducts } from "@/lib/seed-data";
import { Order } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);

  // Customer Form State
  const [customerName, setCustomerName] = useState("Arif Hasan");
  const [phone, setPhone] = useState("+880 1755-123456");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("Dhanmondi");
  const [fullAddress, setFullAddress] = useState("House 12, Road 7A, Dhanmondi R/A, Dhaka-1209");
  const [paymentMethod, setPaymentMethod] = useState<"BKASH" | "NAGAD" | "BANK">("BKASH");

  // Payment processing modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBkashModal, setShowBkashModal] = useState(false);
  const [bkashPin, setBkashPin] = useState("12345");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("skysourcing_checkout");
      if (saved) {
        setCheckoutData(JSON.parse(saved));
      } else {
        const defaultProduct = getClientProducts()[0];
        setCheckoutData({
          product: defaultProduct,
          sku: defaultProduct.skus[0],
          quantity: 2,
          shippingMethod: "AIR",
          unitPriceBdt: 700,
          totalPriceBdt: 1400,
          shippingCostBdt: 375,
          advanceAmountBdt: 700,
          stage2TotalPayableBdt: 1075
        });
      }
    }
  }, []);

  if (!checkoutData) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center text-slate-500 font-mono">
        Loading checkout...
      </div>
    );
  }

  const { product, sku, quantity, shippingMethod, totalPriceBdt, advanceAmountBdt, stage2TotalPayableBdt } = checkoutData;

  const handlePlaceOrder = () => {
    setShowBkashModal(true);
  };

  const handleConfirmBkash = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      const orderNumber = `FAC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        status: "STAGE1_PAID",
        shippingMethod: shippingMethod || "AIR",
        cargoType: product.isSensitiveCargo ? "SENSITIVE" : "GENERAL",
        customer: {
          name: customerName,
          phone,
          district,
          thana,
          fullAddress
        },
        items: [
          {
            id: `item-${Date.now()}`,
            productId: product.id,
            productTitle: product.titleEn,
            productImage: product.images[0],
            sourcePlatform: "FACTORY_DIRECT",
            sourceOfferId: product.sourceOfferId,
            skuId: sku?.id,
            skuName: sku?.name,
            skuNameCn: sku?.nameCn || sku?.name,
            unitPriceRmb: product.basePriceRmb,
            unitPriceBdt: Math.round(totalPriceBdt / quantity),
            quantity
          }
        ],
        pricing: {
          exchangeRateUsed: 17.50,
          productTotalRmb: product.basePriceRmb * quantity,
          productTotalBdt: totalPriceBdt,
          advancePercentage: 50,
          advanceAmountBdt: advanceAmountBdt,
          stage2ProductBalanceBdt: totalPriceBdt - advanceAmountBdt,
          estimatedWeightKg: (product.estimatedWeightKg || 0.3) * quantity,
          intlShippingRatePerKg: shippingMethod === "AIR" ? 750 : 220,
          intlShippingCostBdt: shippingMethod === "AIR" ? 375 : 150,
          localCourierFeeBdt: 70,
          totalOrderBdt: totalPriceBdt + 445,
          stage2TotalPayableBdt: stage2TotalPayableBdt
        },
        tracking: {
          qcPhotos: []
        }
      };

      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder)
        });
      } catch (e) {
        console.error("Order save fallback:", e);
      }

      setIsProcessing(false);
      setShowBkashModal(false);
      router.push(`/orders/${newOrder.id}/track`);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cargo-900 text-freight-amber rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black text-cargo-900 tracking-tight">
            Secure Two-Stage Wholesale Checkout
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Lock factory manufacturing with a 50% advance deposit. Pay remaining 50% + shipping weight upon arrival in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Customer & Delivery Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Address Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-freight-amber" />
              <span>Bangladesh Delivery Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Mobile Number (bKash/Nagad)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Thana / Upazila</label>
                <input
                  type="text"
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-600 mb-1">Detailed Street Address</label>
              <textarea
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-cargo-900" />
              <span>Select Stage 1 Payment Gateway</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("BKASH")}
                className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                  paymentMethod === "BKASH" 
                    ? "border-pink-500 bg-pink-50/60 ring-2 ring-pink-200 shadow-xs" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="font-black text-pink-600 text-base">bKash</span>
                <span className="text-[10px] text-slate-500">Instant Verification</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("NAGAD")}
                className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                  paymentMethod === "NAGAD" 
                    ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-200 shadow-xs" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="font-black text-orange-600 text-base">Nagad</span>
                <span className="text-[10px] text-slate-500">Automated Webpay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("BANK")}
                className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                  paymentMethod === "BANK" 
                    ? "border-cargo-900 bg-slate-50 ring-2 ring-cargo-900/20 shadow-xs" 
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span className="font-bold text-cargo-900 text-sm">Bank / Card</span>
                <span className="text-[10px] text-slate-500">BRAC / City / Visa</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Two-Stage Payment (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cargo-950 text-white border border-cargo-800 rounded-2xl p-6 shadow-cargo-lg space-y-5">
            <h3 className="font-bold text-sm text-white border-b border-cargo-800 pb-3 flex justify-between items-center">
              <span>Order Summary</span>
              <span className="text-[10px] font-mono text-freight-amber bg-cargo-900 px-2 py-0.5 rounded border border-cargo-700">
                LOT #{product.sourceOfferId}
              </span>
            </h3>

            <div className="flex gap-3">
              <img
                src={product.images[0]}
                alt={product.titleEn}
                className="w-16 h-16 rounded-xl object-cover border border-cargo-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{product.titleEn}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Variant: {sku?.name || "Standard Model"}
                </div>
                <div className="text-xs font-mono font-bold text-freight-amber mt-1 flex justify-between">
                  <span>{quantity} pcs × ৳{Math.round(totalPriceBdt / quantity)}</span>
                  <span>৳{totalPriceBdt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Two-Stage Payment Breakdown */}
            <div className="bg-cargo-900 border border-cargo-800 rounded-xl p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>Total Goods Value:</span>
                <span className="font-bold text-white tabular-nums">৳{totalPriceBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Shipping Corridor:</span>
                <span className="font-semibold text-white">
                  {shippingMethod === "AIR" ? "Air Cargo (10–18 Days)" : "Sea Freight (30–45 Days)"}
                </span>
              </div>

              <div className="pt-2 border-t border-cargo-800 space-y-2">
                <div className="flex justify-between items-center bg-cargo-800 border border-qc-emerald/40 text-qc-emerald p-3 rounded-lg font-bold">
                  <span>STAGE 1: PAY NOW (50%)</span>
                  <span className="text-base text-white tabular-nums">৳{advanceAmountBdt.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400 px-1 text-[11px]">
                  <span>Stage 2 on BD Arrival (50% + Freight):</span>
                  <span className="font-semibold text-freight-amber tabular-nums">৳{stage2TotalPayableBdt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 px-6 rounded-xl text-xs sm:text-sm transition shadow-cargo flex items-center justify-center gap-2 btn-tactile"
            >
              <span>Pay 50% Advance via {paymentMethod}</span>
              <span className="font-mono font-bold">• ৳{advanceAmountBdt.toLocaleString()} BDT</span>
              <ArrowRight className="w-4 h-4 text-cargo-950" />
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-qc-emerald" />
              <span>Full purchase & QC inspection guarantee in Guangzhou before departure</span>
            </p>
          </div>
        </div>
      </div>

      {/* bKash Payment Modal Simulation */}
      {showBkashModal && (
        <div className="fixed inset-0 bg-cargo-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-cargo-lg space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="font-black text-pink-600 text-lg">bKash Merchant Pay</span>
              <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                50% Advance
              </span>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-slate-500">Payable Amount Now:</span>
              <div className="text-3xl font-black text-cargo-950 font-mono tabular-nums">
                ৳{advanceAmountBdt.toLocaleString()}
              </div>
              <span className="text-[11px] text-qc-emerald font-semibold block">
                Stage 1 Factory Procurement Deposit
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Enter 5-digit PIN (Simulation):</label>
              <input
                type="password"
                value={bkashPin}
                onChange={(e) => setBkashPin(e.target.value)}
                placeholder="12345"
                className="w-full text-center text-lg tracking-widest px-3 py-2 border rounded-xl font-bold font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowBkashModal(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBkash}
                disabled={isProcessing}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : `Confirm ৳${advanceAmountBdt.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowRight,
  Lock,
  Copy,
  Check,
  Building,
  HelpCircle
} from "lucide-react";
import { getClientProducts } from "@/lib/seed-data";
import { Order, GlobalSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/pricing";

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);

  // Customer Form State
  const [customerName, setCustomerName] = useState("Arif Hasan");
  const [phone, setPhone] = useState("01755123456");
  const [district, setDistrict] = useState("Dhaka");
  const [thana, setThana] = useState("Dhanmondi");
  const [fullAddress, setFullAddress] = useState("House 12, Road 7A, Dhanmondi R/A, Dhaka-1209");

  // Payment Selection: Strictly bKash or Nagad
  const [paymentMethod, setPaymentMethod] = useState<"BKASH" | "NAGAD">("BKASH");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live settings (bKash & Nagad numbers, exchange rate)
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("skysourcing_checkout");
      if (saved) {
        setCheckoutData(JSON.parse(saved));
      } else {
        const defaultProduct = getClientProducts()[0];
        setCheckoutData({
          product: defaultProduct,
          sku: defaultProduct?.skus?.[0],
          quantity: 2,
          shippingMethod: "AIR",
          unitPriceBdt: 700,
          totalPriceBdt: 1400,
          shippingCostBdt: 375,
          advanceAmountBdt: 1400,
          stage2TotalPayableBdt: 505
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

  const currentPayNumber = paymentMethod === "BKASH" ? settings.bkashNumber : settings.nagadNumber;
  const currentAccountType = paymentMethod === "BKASH" ? settings.bkashAccountType : settings.nagadAccountType;

  const handleCopyNumber = () => {
    if (navigator.clipboard && currentPayNumber) {
      navigator.clipboard.writeText(currentPayNumber.replace(/[^0-9]/g, ""));
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2500);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !phone.trim() || !fullAddress.trim()) {
      setErrorMessage("দয়া করে আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ঠিকানা প্রদান করুন।");
      return;
    }

    if (!senderNumber.trim()) {
      setErrorMessage(`দয়া করে আপনার ${paymentMethod === "BKASH" ? "বিকাশ" : "নগদ"} প্রেরক নাম্বার প্রদান করুন।`);
      return;
    }

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      setErrorMessage("দয়া করে সঠিক TrxID (Transaction ID) প্রদান করুন (কমপক্ষে ৬ ডিজিট/বর্ণ)।");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `FAC-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        status: "STAGE1_PENDING",
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
            sourcePlatform: product.sourcePlatform || "1688",
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
          exchangeRateUsed: settings.exchangeRateRmbToBdt || 18.5,
          productTotalRmb: product.basePriceRmb * quantity,
          productTotalBdt: totalPriceBdt,
          advancePercentage: settings.advancePaymentPercent || 50,
          advanceAmountBdt: advanceAmountBdt,
          stage2ProductBalanceBdt: totalPriceBdt - advanceAmountBdt,
          estimatedWeightKg: (product.estimatedWeightKg || 0.5) * quantity,
          intlShippingRatePerKg: shippingMethod === "AIR" ? (settings.airRatePerKgGeneral || 750) : (settings.seaRatePerKg || 220),
          intlShippingCostBdt: shippingMethod === "AIR" ? 375 : 150,
          localCourierFeeBdt: district === "Dhaka" ? (settings.localCourierDhaka || 70) : (settings.localCourierOutsideDhaka || 130),
          totalOrderBdt: totalPriceBdt + (shippingMethod === "AIR" ? 375 : 150) + 70,
          stage2TotalPayableBdt: stage2TotalPayableBdt
        },
        tracking: {
          qcPhotos: []
        },
        payment: {
          method: paymentMethod,
          accountType: currentAccountType,
          senderNumber: senderNumber.trim(),
          transactionId: transactionId.trim().toUpperCase(),
          amount: advanceAmountBdt,
          submittedAt: new Date().toISOString(),
          verified: false
        }
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder)
      });

      if (!res.ok) {
        throw new Error("Failed to save order");
      }

      // Clear session checkout data
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("skysourcing_checkout");
      }

      router.push(`/orders/${newOrder.id}/track`);
    } catch (err: any) {
      setErrorMessage("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Page Title & Two-Stage Explanation */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-cargo-900 text-freight-amber rounded-xl">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-cargo-900 tracking-tight">
              নিরাপদ হোলসেল চেকআউট (B2B Checkout)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ১০০% পণ্যের মূল্যে নিরাপদ অর্ডার নিশ্চিত করুন। ডেলিভারি ও ফ্রেইট ফি পণ্য বাংলাদেশে পৌঁছালে প্রতি কেজি ওজনে পরিশোধযোগ্য।
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery Details & Payment MFS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Address Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-freight-amber" />
              <span>ডেলিভারি ঠিকানা (Bangladesh Delivery Address)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  প্রাপকের নাম (Recipient Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                  placeholder="আপনার নাম"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  মোবাইল নাম্বার (Mobile Number) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                  placeholder="017XXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">জেলা (District) *</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none bg-white"
                >
                  <option value="Dhaka">ঢাকা (Dhaka)</option>
                  <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
                  <option value="Sylhet">সিলেট (Sylhet)</option>
                  <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
                  <option value="Khulna">খুলনা (Khulna)</option>
                  <option value="Barisal">বরিশাল (Barisal)</option>
                  <option value="Rangpur">রংপুর (Rangpur)</option>
                  <option value="Mymensingh">ময়মনসিংহ (Mymensingh)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">থানা / উপজেলা (Thana) *</label>
                <input
                  type="text"
                  required
                  value={thana}
                  onChange={(e) => setThana(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                  placeholder="যেমন: ধানমন্ডি / মিরপুর / কোতোয়ালি"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                সম্পূর্ণ ঠিকানা (Full Delivery Street Address) *
              </label>
              <textarea
                rows={2}
                required
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                placeholder="বাসা/হোল্ডিং নম্বর, রোড, এরিয়া..."
              />
            </div>
          </div>

          {/* Payment Method Selector: Strictly bKash & Nagad */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-qc-emerald" />
                <span>পণ্যের ১০০% মূল্য পরিশোধের মাধ্যম নির্বাচন করুন</span>
              </h3>
              <span className="text-[11px] font-mono font-semibold text-slate-500">
                bKash / Nagad Only
              </span>
            </div>

            {/* bKash & Nagad Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("BKASH")}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                  paymentMethod === "BKASH" 
                    ? "border-pink-500 bg-pink-50/70 ring-2 ring-pink-300 shadow-sm" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <div className="font-black text-pink-600 text-lg tracking-tight">bKash</div>
                <span className="text-[11px] text-slate-600 font-medium">বিকাশ পেমেন্ট</span>
                <span className="text-[10px] font-mono text-pink-600 bg-pink-100/70 px-2 py-0.5 rounded-full font-bold mt-1">
                  {settings.bkashAccountType}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("NAGAD")}
                className={`p-4 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 active:scale-[0.98] ${
                  paymentMethod === "NAGAD" 
                    ? "border-orange-500 bg-orange-50/70 ring-2 ring-orange-300 shadow-sm" 
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <div className="font-black text-orange-600 text-lg tracking-tight">Nagad</div>
                <span className="text-[11px] text-slate-600 font-medium">নগদ পেমেন্ট</span>
                <span className="text-[10px] font-mono text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded-full font-bold mt-1">
                  {settings.nagadAccountType}
                </span>
              </button>
            </div>

            {/* Step-by-Step Payment Instructions Box */}
            <div className={`p-4 rounded-2xl border ${
              paymentMethod === "BKASH" 
                ? "bg-pink-50/40 border-pink-200/80 text-pink-950" 
                : "bg-orange-50/40 border-orange-200/80 text-orange-950"
            } space-y-3`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${paymentMethod === "BKASH" ? "bg-pink-600" : "bg-orange-600"}`} />
                  <span>ধাপ ১: {paymentMethod === "BKASH" ? "বিকাশ" : "নগদ"} একাউন্টে ১০০% পণ্যের মূল্য পাঠান</span>
                </span>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border shadow-xs">
                  প্রদেয়: ৳{advanceAmountBdt.toLocaleString()}
                </span>
              </div>

              {/* Number with 1-click Copy */}
              <div className="bg-white rounded-xl p-3 border border-slate-200/90 flex items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-500 block">
                    আমাদের অফিসিয়াল {paymentMethod === "BKASH" ? "বিকাশ" : "নগদ"} নাম্বার ({currentAccountType}):
                  </span>
                  <div className="text-base sm:text-lg font-black font-mono text-cargo-950 tracking-wider">
                    {currentPayNumber}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                    copiedNumber 
                      ? "bg-emerald-600 text-white" 
                      : "bg-cargo-900 hover:bg-cargo-800 text-white"
                  }`}
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-freight-amber" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-slate-600 space-y-1 font-medium leading-relaxed">
                <p>
                  • আপনার {paymentMethod === "BKASH" ? "bKash" : "Nagad"} অ্যাপ অথবা USSD মেনু থেকে <strong>৳{advanceAmountBdt.toLocaleString()}</strong> টাকা (১০০% পণ্যের মূল্য) {currentAccountType === "MERCHANT" ? "Make Payment" : "Send Money"} করুন।
                </p>
                <p>
                  • পেমেন্ট সম্পন্ন হলে মেসেজ থেকে <strong>TrxID (Transaction ID)</strong> কপি করে নিচের বক্সে প্রদান করুন।
                </p>
              </div>
            </div>

            {/* Step 2: Verification Input Fields */}
            <div className="space-y-4 pt-1">
              <div className="font-bold text-xs text-cargo-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cargo-900 text-white text-[11px] flex items-center justify-center font-mono">২</span>
                <span>ধাপ ২: আপনার পেমেন্ট তথ্য প্রদান করুন (Payment Verification)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    প্রেরক মোবাইল নাম্বার (Sender Mobile) *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">যে নাম্বার থেকে টাকা পাঠানো হয়েছে</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ট্রানজেকশন আইডি (Transaction ID / TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="e.g. BLA928372X"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono font-bold tracking-wider"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">bKash/Nagad ফিরতি SMS-এর TrxID</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Two-Stage Payment (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-cargo-950 text-white border border-cargo-800 rounded-3xl p-6 shadow-cargo-lg space-y-5">
            <div className="flex justify-between items-center border-b border-cargo-800 pb-3">
              <span className="font-bold text-sm text-white">অর্ডার বিবরণী (Order Summary)</span>
              <span className="text-[10px] font-mono text-freight-amber bg-cargo-900 px-2 py-0.5 rounded border border-cargo-700">
                LOT #{product.sourceOfferId}
              </span>
            </div>

            <div className="flex gap-3">
              <img
                src={product.images[0]}
                alt={product.titleEn}
                className="w-16 h-16 rounded-xl object-cover border border-cargo-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{product.titleEn}</h4>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  ভ্যারিয়েন্ট: {sku?.name || "Standard Model"}
                </div>
                <div className="text-xs font-mono font-bold text-freight-amber mt-1 flex justify-between">
                  <span>{quantity} pcs × ৳{Math.round(totalPriceBdt / quantity)}</span>
                  <span>৳{totalPriceBdt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Two-Stage Payment Structure Box */}
            <div className="bg-cargo-900 border border-cargo-800 rounded-2xl p-4 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>পণ্যের মোট মূল্য (Goods Total):</span>
                <span className="font-bold text-white tabular-nums">৳{totalPriceBdt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>শিপিং করিডোর (Corridor):</span>
                <span className="font-semibold text-white">
                  {shippingMethod === "AIR" ? "Air Cargo (10–18 Days)" : "Sea Freight (30–45 Days)"}
                </span>
              </div>

              <div className="pt-2 border-t border-cargo-800 space-y-2">
                <div className="flex justify-between items-center bg-cargo-800 border border-qc-emerald/40 text-qc-emerald p-3.5 rounded-xl font-bold">
                  <div>
                    <span className="block text-xs font-bold text-white">এখন পরিশোধযোগ্য (১০০% পণ্যের মূল্য)</span>
                    <span className="text-[10px] text-qc-emerald font-normal font-sans">সরাসরি অর্ডার নিশ্চিত ও প্রসেসিং</span>
                  </div>
                  <span className="text-lg text-white tabular-nums">৳{advanceAmountBdt.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-slate-400 px-1 text-[11px]">
                  <span>ঢাকায় পণ্য পৌঁছালে প্রদেয় (ডেলিভারি ও ফ্রেইট ফি):</span>
                  <span className="font-semibold text-freight-amber tabular-nums">৳{stage2TotalPayableBdt.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Confirm & Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 px-6 rounded-2xl text-xs sm:text-sm transition shadow-cargo flex items-center justify-center gap-2 btn-tactile disabled:opacity-60"
            >
              <span>{isSubmitting ? "অর্ডার সাবমিট হচ্ছে..." : `অর্ডার কনফার্ম করুন (${paymentMethod})`}</span>
              <span className="font-mono font-bold">• ৳{advanceAmountBdt.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4 text-cargo-950" />
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-qc-emerald flex-shrink-0" />
              <span>গুয়াংজু ওয়্যারহাউসে প্রাক-শিপমেন্ট QC চেক গ্যারান্টি</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

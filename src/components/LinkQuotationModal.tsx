"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Plane, 
  Ship, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  ExternalLink,
  PackageCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import { Product } from "@/types";
import { DEFAULT_SETTINGS, calculateTierPriceBdt, calculateShippingFee, calculateTwoStagePayment } from "@/lib/pricing";

interface LinkQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

export function LinkQuotationModal({ isOpen, onClose, initialUrl = "" }: LinkQuotationModalProps) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<"AIR" | "SEA">("AIR");

  const settings = DEFAULT_SETTINGS;

  useEffect(() => {
    if (initialUrl && isOpen) {
      setUrl(initialUrl);
      resolveUrl(initialUrl);
    }
  }, [initialUrl, isOpen]);

  async function resolveUrl(targetUrl: string) {
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products/resolve?url=${encodeURIComponent(targetUrl.trim())}`);
      const data = await res.json();
      if (data.success && data.product) {
        setProduct(data.product);
        setQuantity(data.product.minOrderQty || 1);
      } else {
        setError("পণ্যটি যাচাই করতে সমস্যা হয়েছে। অনুগ্রহ করে লিংকটি চেক করুন অথবা সরাসরি হোয়াটসঅ্যাপে পাঠান।");
      }
    } catch (err) {
      console.error("Resolve error:", err);
      setError("সার্ভার সংযোগে সমস্যা হয়েছে। সরাসরি হোয়াটসঅ্যাপে লিংক পাঠিয়ে কোটেশন নিন।");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  // Calculation values
  const priceTiers = product?.priceTiers || (product ? [{ minQty: 1, priceRmb: product.basePriceRmb, range: "1+ pcs" }] : []);
  const { unitPriceRmb, unitPriceBdt, totalPriceBdt } = calculateTierPriceBdt(
    priceTiers,
    quantity,
    settings.exchangeRateRmbToBdt,
    settings.defaultProfitMarginPercent
  );

  const totalWeightKg = Number(((product?.estimatedWeightKg || 0.5) * quantity).toFixed(2));
  const { shippingCostBdt, ratePerKg } = calculateShippingFee(
    totalWeightKg,
    shippingMethod,
    product?.isSensitiveCargo || false,
    undefined,
    settings
  );

  const paymentBreakdown = calculateTwoStagePayment(
    totalPriceBdt,
    shippingCostBdt,
    settings.localCourierDhaka,
    50
  );

  // Generate WhatsApp pre-filled message
  const waText = encodeURIComponent(
    `আসসালামু আলাইকুম SkySourcing BD,\nআমি চীন থেকে সরাসরি এই পণ্যটি পাইকারি আমদানি করতে চাই:\n\n` +
    `📌 প্রোডাক্ট লিংক: ${url || product?.url || "1688 / Taobao Link"}\n` +
    `📦 পণ্যের নাম: ${product?.titleEn || "Imported Wholesale Item"}\n` +
    `🔢 অর্ডারের পরিমাণ: ${quantity} পিস\n` +
    `✈️ আন্তর্জাতিক শিপিং: ${shippingMethod === "AIR" ? "এয়ার কার্গো (১০–১৮ দিন)" : "সি ফ্রেইট (৩০–৪৫ দিন)"}\n` +
    `💵 মোট পণ্যের মূল্য: ৳${totalPriceBdt.toLocaleString()} BDT\n` +
    `🛡️ ৫০% অগ্রিম বুকিং: ৳${paymentBreakdown.advanceAmountBdt.toLocaleString()} BDT\n` +
    `📦 আন্তর্জাতিক ফ্রেইট: ৳${shippingCostBdt.toLocaleString()} BDT (বাংলাদেশে পৌঁছালে দেয়)\n\n` +
    `অনুগ্রহ করে চূড়ান্ত কোটেশন ও পেমেন্ট পদ্ধতি নিশ্চিত করুন। ধন্যবাদ!`
  );

  const handleCheckout = () => {
    if (!product) return;
    const checkoutItem = {
      product,
      sku: product.skus?.[0] || null,
      size: (product as any)?.sizes?.[0] || "Standard",
      quantity,
      shippingMethod,
      unitPriceBdt,
      totalPriceBdt,
      shippingCostBdt,
      advanceAmountBdt: paymentBreakdown.advanceAmountBdt,
      stage2TotalPayableBdt: paymentBreakdown.stage2TotalPayableBdt
    };
    if (typeof window !== "undefined") {
      sessionStorage.setItem("skysourcing_checkout", JSON.stringify(checkoutItem));
    }
    onClose();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-cargo-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200/90 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-cargo-950 text-white px-5 py-4 flex items-center justify-between border-b border-cargo-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-qc-emerald animate-pulse" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              ১৬৮৮ / তাওবাও লাইভ কোটেশন জেনারেটর
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cargo-800 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* URL Input Bar inside modal if not yet resolved */}
          {!product && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-cargo-900 block">
                পণ্যের লিংক (1688 / Taobao / Tmall URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://detail.1688.com/offer/... বা https://item.taobao.com/..."
                  className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-freight-amber"
                />
                <button
                  type="button"
                  onClick={() => resolveUrl(url)}
                  disabled={isLoading || !url.trim()}
                  className="bg-cargo-900 hover:bg-cargo-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5"
                >
                  {isLoading ? "যাচাই হচ্ছে..." : "যাচাই করুন"}
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-12 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-cargo-900 border-t-freight-amber rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono font-bold text-cargo-900">
                ১৬৮৮ ফ্যাক্টরি ডাটাবেজ থেকে আসল মূল্য ও ওজন যাচাই করা হচ্ছে...
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Live RMB Currency: 1.00 = ৳{settings.exchangeRateRmbToBdt} BDT
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
              <p className="font-semibold">{error}</p>
              <p className="text-[11px] text-amber-700">
                চাইনিজ প্ল্যাটফর্মের কিছু লিংক সরাসরি ব্রাউজারে ব্লক থাকতে পারে। আপনি লিংকটি কপি করে নিচের বাটনে ক্লিক করে আমাদের হোয়াটসঅ্যাপে পাঠিয়ে দিন, ২ মিনিটের মধ্যে সম্পূর্ণ হিসাব পেয়ে যাবেন।
              </p>
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent("আসসালামু আলাইকুম, আমি ১৬৮৮ থেকে এই লিংকটির কোটেশন চাই: " + url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-qc-emerald text-white px-3.5 py-2 rounded-xl font-bold text-xs hover:bg-emerald-700 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে পাঠান</span>
              </a>
            </div>
          )}

          {/* Resolved Product Card */}
          {product && !isLoading && (
            <div className="space-y-5">
              {/* Product Header Card */}
              <div className="flex gap-3 sm:gap-4 p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl items-start">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.titleEn}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono bg-qc-emerald/10 text-qc-emerald font-bold px-2 py-0.5 rounded-full border border-qc-emerald/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-qc-emerald" />
                      যাচাইকৃত ফ্যাক্টরি লিস্টিং
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ID: #{product.sourceOfferId}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-cargo-900 line-clamp-2 leading-snug">
                    {product.titleEn}
                  </h4>
                  <div className="flex items-center gap-3 pt-1 text-xs font-mono">
                    <span className="text-slate-500">
                      ফ্যাক্টরি রেট: <strong className="text-cargo-900">¥{unitPriceRmb} RMB</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-freight-amber font-black">
                      ৳{unitPriceBdt.toLocaleString()} BDT / পিস
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Tier Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="text-xs font-bold text-cargo-900 block">
                    অর্ডারের পরিমাণ (Quantity):
                  </label>
                  <span className="text-[11px] text-slate-500">ন্যূনতম ১ পিস থেকে পাইকারি লট</span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-bold text-cargo-900 hover:bg-slate-100 flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-9 text-center border border-slate-300 rounded-xl font-bold font-mono text-sm focus:outline-none focus:ring-2 focus:ring-freight-amber bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-300 font-bold text-cargo-900 hover:bg-slate-100 flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Freight Corridor Selector (Air vs Sea) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-cargo-900 block">
                  বাংলাদেশ শিপিং করিডোর নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShippingMethod("AIR")}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      shippingMethod === "AIR"
                        ? "border-transit-air bg-sky-50 ring-2 ring-transit-air/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-bold text-xs text-cargo-900">
                        <Plane className="w-3.5 h-3.5 text-transit-air" />
                        <span>এয়ার কার্গো (Air)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ১০–১৮ দিন • ৳৭৫০/কেজি
                      </div>
                    </div>
                    {shippingMethod === "AIR" && <CheckCircle2 className="w-4 h-4 text-transit-air" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod("SEA")}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                      shippingMethod === "SEA"
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-bold text-xs text-cargo-900">
                        <Ship className="w-3.5 h-3.5 text-indigo-600" />
                        <span>সি ফ্রেইট (Sea)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        ৩০–৪৫ দিন • ৳২২০/কেজি
                      </div>
                    </div>
                    {shippingMethod === "SEA" && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </button>
                </div>
              </div>

              {/* Two-Stage Payment Calculation Card */}
              <div className="bg-cargo-950 text-white rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b border-cargo-800 pb-2.5">
                  <span className="text-slate-400 text-xs font-mono">
                    মোট পণ্যের মূল্য ({quantity} পিস):
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-white">
                    ৳{totalPriceBdt.toLocaleString()} BDT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-cargo-900 p-3 rounded-xl border border-qc-emerald/30 space-y-0.5">
                    <span className="text-[10px] font-mono text-qc-emerald font-bold block flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-qc-emerald animate-pulse" />
                      ধাপ ১: ৫০% অগ্রিম
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono text-white block">
                      ৳{paymentBreakdown.advanceAmountBdt.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">চীন ফ্যাক্টরি বুকিং কনফার্ম</span>
                  </div>

                  <div className="bg-cargo-900 p-3 rounded-xl border border-cargo-750 space-y-0.5">
                    <span className="text-[10px] font-mono text-freight-amber font-bold block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-freight-amber" />
                      ধাপ ২: বাকি ৫০% + শিপিং
                    </span>
                    <span className="text-base sm:text-lg font-black font-mono text-white block">
                      ৳{paymentBreakdown.stage2TotalPayableBdt.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">পণ্য বাংলাদেশে পৌঁছালে প্রদেয়</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>আনুমানিক ওজন: ~{totalWeightKg} কেজি</span>
                  <span>শিপিং খরচ: ~৳{shippingCostBdt.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Direct WhatsApp Sourcing Desk */}
                <a
                  href={`https://wa.me/8801700000000?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-qc-emerald hover:bg-emerald-600 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার / কোটেশন পাঠান</span>
                </a>

                {/* 2. Direct Online 50% Advance Checkout */}
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <span>অনলাইনে ৫০% অগ্রিমে বুক করুন (৳{paymentBreakdown.advanceAmountBdt.toLocaleString()} BDT)</span>
                  <ArrowRight className="w-4 h-4 text-cargo-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

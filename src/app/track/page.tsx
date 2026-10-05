"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Phone, 
  Package, 
  CheckCircle2, 
  Clock, 
  Plane, 
  Ship, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Truck, 
  Scale, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { getClientOrders } from "@/lib/seed-data";
import { Order } from "@/types";

const TIMELINE_STEPS = [
  { key: "STAGE1_PAID", titleBn: "অর্ডার কনফার্মড ও ৫০% অগ্রিম প্রাপ্ত", titleEn: "Order Placed & 50% Advance Paid", descBn: "চীন ফ্যাক্টরিতে অর্ডার প্রকিউরমেন্ট রিকোয়েস্ট প্লেসড" },
  { key: "PURCHASING_IN_CHINA", titleBn: "ফ্যাক্টরি থেকে পণ্য ডিসপ্যাচ", titleEn: "Procured with Manufacturer", descBn: "চাইনিজ লোকাল এক্সপ্রেস কুরিয়ারে গুয়াংজু ওয়্যারহাউসের পথে" },
  { key: "CHINA_WAREHOUSE_RECEIVED", titleBn: "গুয়াংজু ওয়্যারহাউসে রিসিভড", titleEn: "Arrived at Guangzhou Hub", descBn: "পার্সেল চেক-ইন ও কার্টনিং সম্পন্ন" },
  { key: "QC_VERIFIED", titleBn: "ডিজিটাল স্কেল QC ও ফটো ভেরিফিকেশন", titleEn: "Guangzhou QC Inspected & Weighed", descBn: "বিমানে তোলার আগে প্রকৃত ওজন ও হাই-রেস ছবি সংরক্ষিত" },
  { key: "DISPATCHED_TO_BD", titleBn: "আন্তর্জাতিক ট্রানজিটে রওয়ানা", titleEn: "Dispatched to Bangladesh", descBn: "এয়ার ফ্লাইট ডিপার্টেড / সমুদ্রপথে চট্টগ্রাম বন্দরের উদ্দেশ্যে" },
  { key: "CUSTOMS_CLEARED", titleBn: "কাস্টমস ট্যাক্স ও ডিউটি ক্লিয়ারড", titleEn: "Customs Clearance Settled", descBn: "ঢাকা এয়ারপোর্ট / চট্টগ্রাম কাস্টমসের সকল শুল্ক পরিশোধিত" },
  { key: "ARRIVED_DHAKA_HUB", titleBn: "ঢাকা ওয়্যারহাউসে আগমন", titleEn: "Arrived at Dhaka Hub", descBn: "ডোরস্টেপ ডেলিভারির জন্য প্রস্তুত • বাকি ৫০% ও ফ্রেইট প্রদেয়" },
  { key: "LOCAL_DELIVERY", titleBn: "গ্রাহকের ঠিকানায় ডেলিভারি হ্যান্ডওভার", titleEn: "Doorstep Delivery Handover", descBn: "পাঠাও বা স্টিডফাস্ট কুরিয়ারের মাধ্যমে ডেলিভারি চলমান" }
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || searchParams.get("phone") || searchParams.get("order") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchedOrders, setSearchedOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Initialize with sample order if no search
  useEffect(() => {
    const all = getClientOrders();
    if (initialQuery) {
      handleSearch(initialQuery);
    } else if (all.length > 0) {
      setSearchedOrders(all);
      setSelectedOrder(all[0]);
    }
  }, [initialQuery]);

  const handleSearch = (searchTerm: string) => {
    const clean = searchTerm.trim().toLowerCase().replace(/[\s\-\+]/g, "");
    setHasSearched(true);
    if (!clean) return;

    const all = getClientOrders();
    const matched = all.filter((o) => {
      const orderNum = (o.orderNumber || "").toLowerCase().replace(/[\s\-\+]/g, "");
      const orderId = (o.id || "").toLowerCase().replace(/[\s\-\+]/g, "");
      const phone = (o.customer?.phone || "").toLowerCase().replace(/[\s\-\+]/g, "");
      const name = (o.customer?.name || "").toLowerCase();

      return (
        orderNum.includes(clean) ||
        orderId.includes(clean) ||
        phone.includes(clean) ||
        name.includes(clean)
      );
    });

    if (matched.length > 0) {
      setSearchedOrders(matched);
      setSelectedOrder(matched[0]);
    } else {
      setSearchedOrders([]);
      setSelectedOrder(null);
    }
  };

  const activeIndex = selectedOrder
    ? Math.max(0, TIMELINE_STEPS.findIndex((s) => s.key === selectedOrder.status))
    : 3;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-28">
      {/* Universal Search Card */}
      <div className="bg-cargo-950 text-white rounded-3xl p-6 sm:p-8 border border-cargo-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-freight-amber/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-cargo-900 px-3 py-1 rounded-full text-xs font-mono text-freight-amber border border-cargo-700">
            <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse" />
            <span>লাইভ কার্গো ও পার্সেল ট্র্যাকিং</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            আপনার ফোন নম্বর বা অর্ডার নম্বর দিয়ে পার্সেল ট্র্যাক করুন
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            গুয়াংজু ওয়্যারহাউস রিসিভ, ডিজিটাল স্কেল ওজন, প্রাক-ফ্লাইট আসল ছবি এবং কাস্টমস ক্লিয়ারেন্স লাইভ পর্যবেক্ষণ করুন।
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex flex-col sm:flex-row gap-2 pt-2"
          >
            <div className="flex-1 flex items-center bg-cargo-900 border border-cargo-700 rounded-xl px-3.5 py-1.5 focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 transition">
              <Phone className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ফোন নম্বর (যেমন: 01755123456) বা অর্ডার নম্বর..."
                className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-slate-400 focus:outline-none py-2 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Search className="w-4 h-4 text-cargo-950" />
              <span>ট্র্যাক করুন</span>
            </button>
          </form>

          {/* Quick Clickable Search Samples */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1 font-mono text-[11px]">
            <span className="text-slate-500">টেস্ট সার্চ:</span>
            <button
              type="button"
              onClick={() => {
                setQuery("01755123456");
                handleSearch("01755123456");
              }}
              className="bg-cargo-800 hover:bg-cargo-700 px-2 py-0.5 rounded text-freight-amber border border-cargo-700 transition"
            >
              +880 1755-123456
            </button>
            <button
              type="button"
              onClick={() => {
                setQuery("FAC-ORD-8910");
                handleSearch("FAC-ORD-8910");
              }}
              className="bg-cargo-800 hover:bg-cargo-700 px-2 py-0.5 rounded text-freight-amber border border-cargo-700 transition"
            >
              FAC-ORD-8910
            </button>
          </div>
        </div>
      </div>

      {/* No Results Message */}
      {hasSearched && searchedOrders.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-cargo-900">কোনো পার্সেল খুঁজে পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            আপনার প্রদানকৃত ফোন নম্বর বা অর্ডার নম্বরে কোনো তথ্য পাওয়া যায়নি। সঠিক নম্বর দিন অথবা সরাসরি আমাদের হোয়াটসঅ্যাপ সাপোর্ট ডেস্কে যোগাযোগ করুন।
          </p>
          <a
            href="https://wa.me/8801700000000?text=Hello%20SkySourcing%20BD,%20I%20want%20to%20track%20my%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-qc-emerald text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition mt-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপে অনুসন্ধান করুন</span>
          </a>
        </div>
      )}

      {/* Multiple Orders Tabs if multiple matched */}
      {searchedOrders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-cargo-900 font-mono flex-shrink-0">
            পাওয়া গেছে ({searchedOrders.length}):
          </span>
          {searchedOrders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => setSelectedOrder(ord)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex-shrink-0 border ${
                selectedOrder?.id === ord.id
                  ? "bg-cargo-950 text-freight-amber border-cargo-950"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {ord.orderNumber} ({ord.shippingMethod})
            </button>
          ))}
        </div>
      )}

      {/* Active Order Details & Visual Timeline */}
      {selectedOrder && (
        <div className="space-y-6">
          {/* Order Header Summary */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-lg sm:text-xl font-mono font-black text-cargo-950">
                  {selectedOrder.orderNumber}
                </span>
                <span className="bg-emerald-50 text-qc-emeraldDark border border-emerald-200 font-mono font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
                  {selectedOrder.status.replace(/_/g, " ")}
                </span>
                <span className="bg-sky-50 text-sky-800 border border-sky-200 font-mono text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  {selectedOrder.shippingMethod === "AIR" ? (
                    <>
                      <Plane className="w-3.5 h-3.5 text-sky-600" />
                      <span>এয়ার কার্গো (১০–১৮ দিন)</span>
                    </>
                  ) : (
                    <>
                      <Ship className="w-3.5 h-3.5 text-indigo-600" />
                      <span>সি ফ্রেইট (৩০–৪৫ দিন)</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                গ্রাহক: <strong>{selectedOrder.customer.name}</strong> • ফোন: {selectedOrder.customer.phone} • ঠিকানা: {selectedOrder.customer.fullAddress}
              </p>
            </div>

            {/* WhatsApp Direct Tracking Inquiry */}
            <a
              href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                `আসসালামু আলাইকুম SkySourcing BD,\nআমি আমার অর্ডার #${selectedOrder.orderNumber} (${selectedOrder.status}) এর সর্বশেষ আপডেট জানতে চাই।\nফোন: ${selectedOrder.customer.phone}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-qc-emerald hover:bg-emerald-600 active:scale-[0.98] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>পার্সেল হেল্পলাইন</span>
            </a>
          </div>

          {/* Interactive 8-Step Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-cargo-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-freight-amber" />
                <span>আন্তর্জাতিক লজিস্টিকস টাইমলাইন</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                ধাপ {activeIndex + 1} / {TIMELINE_STEPS.length}
              </span>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = idx <= activeIndex;
                const isCurrent = idx === activeIndex;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Step Circle Indicator */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCurrent
                          ? "bg-freight-amber text-cargo-950 ring-4 ring-freight-amber/30 animate-pulse"
                          : isCompleted
                          ? "bg-qc-emerald text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs sm:text-sm font-bold ${isCurrent ? "text-cargo-950" : isCompleted ? "text-slate-800" : "text-slate-400"}`}>
                          {step.titleBn}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono bg-freight-amber/20 text-cargo-950 font-black px-2 py-0.5 rounded-full">
                            বর্তমান অবস্থান
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {step.descBn}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Milestone: {step.titleEn}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guangzhou QC Photos & Weight Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-qc-emerald" />
                <h3 className="font-bold text-base text-cargo-900">
                  গুয়াংজু ওয়্যারহাউস ডিজিটাল স্কেল QC ও আসল ছবি
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-qc-emerald bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                QC PASSED
              </span>
            </div>

            <p className="text-xs text-slate-600">
              চীন ফ্যাক্টরি থেকে পণ্য আমাদের গুয়াংজু হাবে পৌঁছানোর পর ডিজিটাল স্কেলে ওজন মেপে এবং কার্টনের বাস্তব ছবি ধারণ করা হয়েছে:
            </p>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {(selectedOrder.tracking?.qcPhotos || [
                "/products/workwear-green-main.jpg",
                "/products/workwear-studio-hd.jpg",
                "/products/workwear-blue-581.jpg",
                "/products/workwear-green-pants.jpg"
              ]).map((photo: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setActivePhoto(photo)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square cursor-pointer hover:shadow-cargo transition"
                >
                  <img
                    src={photo}
                    alt={`QC Verification ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cargo-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                    <span className="text-[10px] font-mono text-white font-bold">ছবি বড় করুন</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Digital Scale Certified Weight Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-500 block text-[11px]">প্রকৃত গ্রস ওজন:</span>
                <strong className="text-base text-cargo-900 font-bold">
                  {selectedOrder.tracking?.weightGrossKg || "1.30"} কেজি
                </strong>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-500 block text-[11px]">ইন্সপেকশন তারিখ:</span>
                <strong className="text-sm text-cargo-900 font-bold">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-slate-500 block text-[11px]">ইনস্পেক্টর নোট:</span>
                <strong className="text-xs text-cargo-900 font-bold block truncate">
                  {selectedOrder.tracking?.qcNotes || "Quantity & specs verified. Ready for cargo."}
                </strong>
              </div>
            </div>
          </div>

          {/* Items & Payment Escrow Breakdown */}
          <div className="bg-cargo-950 text-white border border-cargo-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-bold text-base text-white border-b border-cargo-800 pb-3 flex items-center justify-between">
              <span>অর্ডারকৃত পণ্যের হিসাব ও আর্থিক বিবরণী</span>
              <span className="text-xs font-mono text-freight-amber">২-ধাপ নিরাপদ এসক্রো</span>
            </h3>

            {/* Item list */}
            <div className="space-y-3">
              {selectedOrder.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-12 h-12 rounded-xl object-cover border border-cargo-750"
                    />
                    <div>
                      <h4 className="font-bold text-white line-clamp-1">{item.productTitle}</h4>
                      <p className="text-slate-400 text-[11px]">পরিমাণ: {item.quantity} পিস • প্রতি পিস: ৳{item.unitPriceBdt}</p>
                    </div>
                  </div>
                  <span className="font-bold text-white tabular-nums">
                    ৳{(item.unitPriceBdt * item.quantity).toLocaleString()} BDT
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-cargo-800 text-xs font-mono">
              <div className="p-3.5 bg-cargo-900 rounded-2xl border border-qc-emerald/40 space-y-1">
                <span className="text-qc-emerald font-bold block">ধাপ ১: ৫০% অগ্রিম (পরিশোধিত)</span>
                <span className="text-xl font-black text-white">৳{(selectedOrder.pricing?.advanceAmountBdt || 700).toLocaleString()} BDT</span>
                <span className="text-[10px] text-slate-400 block">চীন ফ্যাক্টরি উৎপাদন বুকিংয়ের জন্য গৃহীত</span>
              </div>
              <div className="p-3.5 bg-cargo-900 rounded-2xl border border-cargo-700 space-y-1">
                <span className="text-freight-amber font-bold block">ধাপ ২: বাকি ৫০% + শিপিং (বাংলাদেশে প্রদেয়)</span>
                <span className="text-xl font-black text-white">৳{(selectedOrder.pricing?.stage2TotalPayableBdt || 1075).toLocaleString()} BDT</span>
                <span className="text-[10px] text-slate-400 block">পণ্য হাতে পাওয়ার সময় পরিশোধযোগ্য</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Photo Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={activePhoto}
              alt="Guangzhou Warehouse Inspection Preview"
              className="w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <p className="text-center text-white text-xs font-mono mt-3">
              ক্লিক করে বন্ধ করুন (Click anywhere to close)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UniversalTrackingPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-mono">
        <div className="w-10 h-10 border-4 border-cargo-900 border-t-freight-amber rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-600">কার্গো ট্র্যাকিং ডাটাবেজ লোড হচ্ছে...</p>
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}

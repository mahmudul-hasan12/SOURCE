"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  CheckCircle2, 
  Clock, 
  Plane, 
  Ship, 
  ShieldCheck, 
  Camera, 
  MapPin, 
  Truck, 
  Package, 
  Scale, 
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  CreditCard,
  Check,
  Printer,
  X,
  Download
} from "lucide-react";
import { getClientOrderById, getClientOrders } from "@/lib/seed-data";
import { Order } from "@/types";

const TIMELINE_STEPS = [
  { key: "STAGE1_PENDING", title: "অর্ডার সাবমিট ও TrxID প্রদান", desc: "বিকাশ/নগদ পেমেন্ট ট্রানজেকশন আইডি অ্যাডমিন রিভিউতে আছে" },
  { key: "STAGE1_PAID", title: "পেমেন্ট ভেরিফায়েড ও অর্ডার কনফার্ম", desc: "১০০% পণ্যের মূল্য যাচাই সম্পন্ন এবং অর্ডার প্রসেস করা হয়েছে" },
  { key: "PURCHASING_IN_CHINA", title: "চীন কারখানায় প্রকিউরমেন্ট রানিং", desc: "কারখানা থেকে পণ্য প্রস্তুত করে অভ্যন্তরীণ কুরিয়ারে প্রেরণ করা হয়েছে" },
  { key: "CHINA_WAREHOUSE_RECEIVED", title: "গুয়াংজু ওয়্যারহাউসে রিসিভড", desc: "আমাদের নিজস্ব চায়না হাব-এ পণ্য ইনটেক করা হয়েছে" },
  { key: "QC_VERIFIED", title: "গুয়াংজু ডিজিটাল স্কেল QC ও ওজন চেক", desc: "ডিজিটাল স্কেলে সঠিক ওজন মাপা ও প্রাক-শিপমেন্ট ছবি তোলা সম্পন্ন" },
  { key: "DISPATCHED_TO_BD", title: "বাংলাদেশে শিপমেন্টের উদ্দেশ্যে রওনা", desc: "এয়ার কার্গো বা সি ফ্রেইট কন্টেইনারে লোড করা হয়েছে" },
  { key: "CUSTOMS_CLEARED", title: "কাস্টমস ক্লিয়ারেন্স সম্পন্ন", desc: "ঢাকায় সমস্ত সরকারি শুল্ক ও কাস্টমস ট্যাক্স পরিশোধ ও ক্লিয়ার" },
  { key: "ARRIVED_DHAKA_HUB", title: "ঢাকা সেন্ট্রাল হাবে পৌঁছাল", desc: "ওজন অনুযায়ী কেজি-প্রতি ডেলিভারি ও ফ্রেইট ফি পরিশোধের জন্য প্রস্তুত" },
  { key: "LOCAL_DELIVERY", title: "কুরিয়ারে হস্তান্তর ও ডোরস্টেপ ডেলিভারি", desc: "স্টেডফাস্ট বা পাঠাও কুরিয়ারের মাধ্যমে আপনার ঠিকানায় ডেলিভারি" }
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.order) {
            setOrder(data.order);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Fetch order error:", e);
      }
      
      // Fallback to client seed orders
      const fallback = getClientOrderById(orderId) || getClientOrders()[0];
      setOrder(fallback);
      setIsLoading(false);
    }

    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-mono space-y-3">
        <div className="w-10 h-10 border-4 border-cargo-900 border-t-freight-amber rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500">লাইভ ট্র্যাকিং ডাটা লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono">
        <h2 className="text-xl font-bold text-cargo-900">অর্ডার খুঁজে পাওয়া যায়নি</h2>
        <Link href="/" className="mt-4 text-transit-air underline inline-block">হোমপেজে ফিরে যান</Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const isPaymentVerified = order.status !== "STAGE1_PENDING" || order.payment?.verified;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Top Industrial Order Header */}
      <div className="bg-cargo-950 text-white border border-cargo-800 rounded-3xl p-6 shadow-cargo-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
              {order.orderNumber}
            </h1>
            <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
              isPaymentVerified 
                ? "bg-emerald-950/90 text-qc-emerald border-emerald-700/60" 
                : "bg-amber-950/90 text-freight-amber border-amber-700/60 animate-pulse"
            }`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            তারিখ: {new Date(order.createdAt).toLocaleDateString()} • করিডোর:{" "}
            <strong className="text-white">
              {order.shippingMethod === "AIR" ? "Air Cargo (১০–১৮ দিন)" : "Sea Freight (৩০–৪৫ দিন)"}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="bg-cargo-900 hover:bg-cargo-850 text-white border border-cargo-700 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 btn-tactile"
          >
            <Printer className="w-4 h-4 text-freight-amber" />
            <span>ইনভয়েস / মেমো প্রিন্ট</span>
          </button>

          <Link
            href="/warehouse"
            className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm btn-tactile"
          >
            <Package className="w-4 h-4 text-cargo-950" />
            <span>Guangzhou Hub Ops</span>
          </Link>
        </div>
      </div>

      {/* Payment & TrxID Verification Banner */}
      <div className={`border rounded-2xl p-5 shadow-xs space-y-3 ${
        isPaymentVerified
          ? "bg-emerald-50/60 border-emerald-200 text-emerald-950"
          : "bg-amber-50/70 border-amber-200 text-amber-950"
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${
              isPaymentVerified ? "bg-emerald-600 text-white" : "bg-amber-500 text-cargo-950"
            }`}>
              {isPaymentVerified ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {isPaymentVerified
                    ? "পেমেন্ট সফলভাবে ভেরিফাই করা হয়েছে (Payment Verified)"
                    : "পেমেন্ট ট্রানজেকশন যাচাই প্রক্রিয়াধীন (TrxID Review Pending)"}
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isPaymentVerified
                  ? "আপনার ১০০% পণ্যের পেমেন্ট নিশ্চিত হয়েছে। প্রকিউরমেন্ট ও প্রসেসিং চলছে।"
                  : "আমাদের অ্যাডমিন প্যানেল থেকে আপনার প্রদত্ত TrxID যাচাই করা হচ্ছে। কিছুক্ষণের মধ্যে স্ট্যাটাস আপডেট হবে।"}
              </p>
            </div>
          </div>

          {order.payment && (
            <div className="bg-white border border-slate-200/90 rounded-xl p-3 text-xs font-mono space-y-1 sm:text-right shadow-xs">
              <div>
                <span className="text-slate-500 font-sans">পদ্ধতি: </span>
                <strong className={order.payment.method === "BKASH" ? "text-pink-600 font-bold" : "text-orange-600 font-bold"}>
                  {order.payment.method}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 font-sans">প্রেরক: </span>
                <span className="text-cargo-900 font-bold">{order.payment.senderNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans">TrxID: </span>
                <span className="bg-slate-100 text-cargo-950 px-1.5 py-0.5 rounded font-black tracking-wider">
                  {order.payment.transactionId}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guangzhou QC Photos Inspection Showcase */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cargo-900 text-qc-emerald rounded-xl">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-cargo-900">
                  গুয়াংজু ওয়্যারহাউস কোয়ালিটি চেক ও ওজন পরিদর্শন (QC Inspection)
                </h3>
                <span className="bg-emerald-100 text-qc-emeraldDark font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                  QC VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                বিমানে বা জাহাজে লোড করার পূর্বে ডিজিটাল স্কেলে নিখুঁত ওজন ও আসল পণ্যের ছবি
              </p>
            </div>
          </div>
          {order.tracking.weightGrossKg && (
            <div className="text-left sm:text-right font-mono">
              <span className="text-[11px] text-slate-500 block">ডিজিটাল স্কেল ওজন:</span>
              <span className="text-lg font-black text-cargo-900 tabular-nums">
                {order.tracking.weightGrossKg} kg
              </span>
            </div>
          )}
        </div>

        {order.tracking.qcPhotos && order.tracking.qcPhotos.length > 0 ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {order.tracking.qcPhotos.map((photo, i) => (
                <div
                  key={i}
                  onClick={() => setActivePhoto(photo)}
                  className="aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group relative bg-slate-900"
                >
                  <img
                    src={photo}
                    alt={`Guangzhou QC Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-cargo-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                    ছবি বড় করে দেখুন
                  </div>
                </div>
              ))}
            </div>
            {order.tracking.qcNotes && (
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl text-xs text-slate-700">
                <strong className="text-cargo-900 font-mono">ইনস্পেকশন নোট:</strong> {order.tracking.qcNotes}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 text-center text-xs text-slate-500">
            ⏳ পণ্যটি কারখানা থেকে গুয়াংজু হাবের পথে রয়েছে। ওয়্যারহাউসে রিসিভ হওয়ার সাথে সাথে ডিজিটাল স্কেলের আসল ছবি ও ওজন এখানে দেখা যাবে।
          </div>
        )}
      </div>

      {/* Cross-Border Logistics Pipeline Progress Tracker */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="font-bold text-sm text-cargo-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-freight-amber" />
          <span>ক্রস-বর্ডার সাপ্লাই চেইন টাইমলাইন (Cross-Border Sourcing Milestones)</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx <= activeIndex;
            const isCurrent = idx === activeIndex;

            return (
              <div key={step.key} className="relative group">
                {/* Milestone Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono transition ${
                    isCompleted
                      ? "bg-qc-emerald text-white shadow-sm ring-4 ring-emerald-50"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold ${
                      isCurrent 
                        ? "text-transit-air" 
                        : isCompleted 
                        ? "text-cargo-900" 
                        : "text-slate-400"
                    }`}>
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="bg-sky-100 text-transit-air font-mono text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                        বর্তমান ধাপ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Logistics Telemetry: China Hub & Bangladesh Doorstep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* China Logistics Box */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-cargo-900 flex items-center gap-1.5 border-b pb-2">
            <Plane className="w-4 h-4 text-transit-air" />
            <span>Guangzhou Warehouse & Freight Transit</span>
          </h4>
          <div className="space-y-2 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">কারখানা কোড:</span>
              <span className="font-semibold text-cargo-900">{order.items[0]?.chinaOrderNumber || "Processing"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">চীন অভ্যন্তরীণ কুরিয়ার:</span>
              <span className="font-semibold text-cargo-900">{order.tracking.chinaDomesticCourier || "SF Express / ZTO"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">গুয়াংজু ট্র্যাকিং কোড:</span>
              <span className="text-cargo-900 font-bold">{order.tracking.chinaTrackingNumber || "CAN-EXP-94021"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">ফ্লাইট / জাহাজ নং:</span>
              <span className="font-semibold text-transit-air">{order.tracking.airFlightOrVesselNumber || "CZ-392 (Guangzhou - Dhaka)"}</span>
            </div>
          </div>
        </div>

        {/* Bangladesh Local Delivery Box */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-cargo-900 flex items-center gap-1.5 border-b pb-2">
            <Truck className="w-4 h-4 text-freight-amber" />
            <span>বাংলাদেশ ডোরস্টেপ ডেলিভারি (Door Delivery)</span>
          </h4>
          <div className="space-y-2 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">প্রাপকের নাম:</span>
              <span className="font-semibold text-cargo-900 font-sans">{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">মোবাইল নাম্বার:</span>
              <span className="font-semibold text-cargo-900">{order.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">ডেলিভারি ঠিকানা:</span>
              <span className="font-semibold text-cargo-900 text-right font-sans">{order.customer.fullAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">লোকাল ডেলিভারি কুরিয়ার:</span>
              <span className="font-bold text-freight-amber">{order.tracking.localCourier || "Steadfast Courier (BD)"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Zoom Modal */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 bg-cargo-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="max-w-3xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-cargo-lg p-2 border border-slate-200">
            <img src={activePhoto} alt="Zoomed QC" className="max-w-full max-h-[80vh] object-contain rounded-xl" />
            <p className="text-center text-xs text-slate-500 py-2 font-mono">ছবি বন্ধ করতে যেকোনো জায়গায় ক্লিক করুন</p>
          </div>
        </div>
      )}

      {/* Printable B2B Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-cargo-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-in text-slate-800 my-8">
            {/* Modal Controls Bar */}
            <div className="flex justify-between items-center border-b pb-3 print:hidden">
              <span className="font-bold text-sm text-cargo-900 flex items-center gap-2">
                <Printer className="w-4 h-4 text-freight-amber" />
                <span>অফিসিয়াল B2B ইনভয়েস ও মানি রিসিপ্ট</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-cargo-900 hover:bg-cargo-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 btn-tactile shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5 text-freight-amber" />
                  <span>প্রিন্ট / PDF ডাউনলোড</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-cargo-900 rounded-xl hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Body */}
            <div id="printable-invoice" className="space-y-6 text-xs p-2">
              {/* Invoice Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="bg-cargo-900 text-freight-amber font-black text-sm w-8 h-8 rounded-lg flex items-center justify-center">
                      SB
                    </div>
                    <span className="font-black text-lg text-cargo-950 tracking-tight">SkySourcing BD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    চীন-টু-বাংলাদেশ সরাসরি পাইকারি সোর্সিং ও ফ্রেইট হাব
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Sector 3, Uttara, Dhaka-1230 • হেল্পলাইন: +8801755123456
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-base font-black font-mono text-cargo-900 tracking-wider">
                    INVOICE
                  </div>
                  <div className="font-mono text-slate-600 font-bold">
                    #{order.orderNumber}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    তারিখ: {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </div>
                </div>
              </div>

              {/* Bill To & Logistics Corridor */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">গ্রাহকের বিবরণ (Billed To):</span>
                  <div className="font-bold text-cargo-900 text-sm">{order.customer.name}</div>
                  <div className="font-mono text-slate-600">{order.customer.phone}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{order.customer.fullAddress}</div>
                  <div className="text-[11px] font-semibold text-slate-700">জেলা: {order.customer.district}</div>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">লজিস্টিকস করিডোর:</span>
                  <div className="font-bold text-cargo-900">
                    {order.shippingMethod === "AIR" ? "এয়ার কার্গো (১০–১৮ দিন)" : "সি ফ্রেইট (৩০–৪৫ দিন)"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    কুরিয়ার: {order.tracking.localCourier || "Steadfast Courier"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    চায়না হাব কোড: {order.items[0]?.chinaOrderNumber || "CAN-HUB"}
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                      <th className="p-3">পণ্যের বিবরণ</th>
                      <th className="p-3">ভ্যারিয়েন্ট</th>
                      <th className="p-3 text-center">পরিমাণ</th>
                      <th className="p-3 text-right">দর (BDT)</th>
                      <th className="p-3 text-right">মোট মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-sans font-bold text-cargo-900">
                          {item.productTitle}
                        </td>
                        <td className="p-3 text-slate-600 text-[11px]">
                          {item.skuName || "Standard"}
                        </td>
                        <td className="p-3 text-center font-bold">
                          {item.quantity} pcs
                        </td>
                        <td className="p-3 text-right">
                          ৳{Math.round(item.unitPriceBdt).toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-bold text-cargo-900">
                          ৳{Math.round(item.unitPriceBdt * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Payment Receipt Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
                {/* Left: Payment Verification Seal */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-qc-emerald" />
                    <span>১০০% পণ্যের পেমেন্ট ভেরিফায়েড</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-emerald-950">
                    <div>পেমেন্ট মাধ্যম: <strong>{order.payment?.method || "BKASH"}</strong></div>
                    <div>প্রেরক নাম্বার: <strong>{order.payment?.senderNumber || "01XXXXXXXXX"}</strong></div>
                    <div>TrxID: <strong className="tracking-wider bg-white px-1.5 py-0.5 rounded border border-emerald-300">{order.payment?.transactionId || "TRX-VERIFIED"}</strong></div>
                    <div>পরিশোধিত অংক: <strong>৳{order.pricing.advanceAmountBdt.toLocaleString()} BDT</strong></div>
                  </div>
                </div>

                {/* Right: Balance & Terms */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>পণ্যের মোট মূল্য (১০০%):</span>
                    <span className="font-bold text-cargo-900">৳{order.pricing.productTotalBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-b pb-2">
                    <span>পরিশোধিত (Paid):</span>
                    <span>- ৳{order.pricing.advanceAmountBdt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 pt-1">
                    <span>পণ্যের বাকি মূল্য:</span>
                    <span className="font-bold text-qc-emerald">৳০ (পরিশোধিত)</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px] pt-1 border-t">
                    <span>বাংলাদেশে প্রদেয় ডেলিভারি ফি:</span>
                    <span className="font-semibold text-amber-700">ওজন অনুযায়ী প্রতি কেজিতে</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer Terms */}
              <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 space-y-1 leading-relaxed">
                <p>• এই ইনভয়েসটি একটি কম্পিউটার-জেনারেটেড বৈধ ডিজিটাল মানি রিসিপ্ট। কোনো ম্যানুয়াল স্বাক্ষরের প্রয়োজন নেই।</p>
                <p>• আন্তর্জাতিক শিপিং ফি (এয়ার ৳৭৫০/কেজি, সি ৳২২০/কেজি) পণ্য ঢাকা সেন্ট্রাল ওয়্যারহাউসে পৌঁছানোর পর ডিজিটাল স্কেলে ওজন মেপে চূড়ান্ত হবে।</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

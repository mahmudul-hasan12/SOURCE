"use client";

import React, { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { getClientOrderById, getClientOrders } from "@/lib/seed-data";

const TIMELINE_STEPS = [
  { key: "STAGE1_PAID", title: "Order Placed & 50% Advance Paid", desc: "Factory procurement order queued and confirmed" },
  { key: "PURCHASING_IN_CHINA", title: "Procured with Manufacturer", desc: "Goods dispatched from factory via China domestic express" },
  { key: "CHINA_WAREHOUSE_RECEIVED", title: "Arrived at Guangzhou Hub", desc: "Package physically checked into our China warehouse" },
  { key: "QC_VERIFIED", title: "Guangzhou QC Inspected & Weighed", desc: "Verification photos taken on digital scale" },
  { key: "DISPATCHED_TO_BD", title: "Dispatched to Bangladesh", desc: "Loaded onto Air Cargo / Sea Freight container" },
  { key: "CUSTOMS_CLEARED", title: "Customs Clearance Settled", desc: "All import tariffs and regulatory clearances cleared in Dhaka" },
  { key: "ARRIVED_DHAKA_HUB", title: "Arrived at Dhaka Hub", desc: "Final weigh-in & ready for 50% balance settlement" },
  { key: "LOCAL_DELIVERY", title: "Doorstep Delivery Handover", desc: "Dispatched via Steadfast or Pathao Courier to your address" }
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const order = getClientOrderById(orderId) || getClientOrders()[0];

  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-mono">
        <h2 className="text-xl font-bold text-cargo-900">Order Not Found</h2>
        <Link href="/" className="mt-4 text-transit-air underline inline-block">Return to Catalog</Link>
      </div>
    );
  }

  const currentStepIndex = TIMELINE_STEPS.findIndex((s) => s.key === order.status);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 3;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Top Industrial Order Header */}
      <div className="bg-cargo-950 text-white border border-cargo-800 rounded-2xl p-6 shadow-cargo-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
              {order.orderNumber}
            </h1>
            <span className="bg-cargo-800 text-freight-amber text-xs font-mono font-bold px-3 py-1 rounded-full border border-cargo-700">
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Date: {new Date(order.createdAt).toLocaleDateString()} • Corridor:{" "}
            <strong className="text-white">
              {order.shippingMethod === "AIR" ? "Air Cargo (10–18 Days)" : "Sea Freight (30–45 Days)"}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/warehouse"
            className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Package className="w-4 h-4 text-cargo-950" />
            <span>China Warehouse Ops</span>
          </Link>
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
                  Guangzhou Warehouse QC Inspection Photos
                </h3>
                <span className="bg-emerald-100 text-qc-emeraldDark font-mono font-bold text-[10px] px-2 py-0.5 rounded">
                  QC PASSED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                High-resolution photos taken on the digital scale before master packaging in China
              </p>
            </div>
          </div>
          {order.tracking.weightGrossKg && (
            <div className="text-left sm:text-right font-mono">
              <span className="text-[11px] text-slate-500 block">Digital Scale Weight:</span>
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
                    Inspect Photo
                  </div>
                </div>
              ))}
            </div>
            {order.tracking.qcNotes && (
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl text-xs text-slate-700">
                <strong className="text-cargo-900 font-mono">Inspector Note:</strong> {order.tracking.qcNotes}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 text-center text-xs text-slate-500">
            ⏳ Package is en route to our Guangzhou warehouse. Inspection photos and digital scale weights will populate immediately upon intake!
          </div>
        )}
      </div>

      {/* 8-Stage Logistics Pipeline Progress Tracker */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
        <h3 className="font-bold text-sm text-cargo-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-freight-amber" />
          <span>Cross-Border Sourcing & Logistics Milestones</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
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
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
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
                        Active Step
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
              <span className="text-slate-400 font-sans">Factory Batch Code:</span>
              <span className="font-semibold text-cargo-900">{order.items[0]?.chinaOrderNumber || "Processing"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">China Domestic Express:</span>
              <span className="font-semibold text-cargo-900">{order.tracking.chinaDomesticCourier || "SF Express / ZTO"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Guangzhou Intake Waybill:</span>
              <span className="text-cargo-900">{order.tracking.chinaTrackingNumber || "CAN-EXP-94021"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Master Flight / Vessel:</span>
              <span className="font-semibold text-transit-air">{order.tracking.airFlightOrVesselNumber || "CZ-392 (Guangzhou - Dhaka)"}</span>
            </div>
          </div>
        </div>

        {/* Bangladesh Local Delivery Box */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-cargo-900 flex items-center gap-1.5 border-b pb-2">
            <Truck className="w-4 h-4 text-freight-amber" />
            <span>Bangladesh Doorstep Delivery</span>
          </h4>
          <div className="space-y-2 text-slate-600 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Recipient Name:</span>
              <span className="font-semibold text-cargo-900 font-sans">{order.customer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Contact Mobile:</span>
              <span className="font-semibold text-cargo-900">{order.customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Delivery Address:</span>
              <span className="font-semibold text-cargo-900 text-right font-sans">{order.customer.fullAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">Local BD Courier:</span>
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
            <p className="text-center text-xs text-slate-500 py-2 font-mono">Click anywhere to close inspection view</p>
          </div>
        </div>
      )}
    </div>
  );
}

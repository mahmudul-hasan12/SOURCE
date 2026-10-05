"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { 
  Plane, 
  Ship, 
  ShieldCheck, 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Sparkles,
  Layers,
  Info,
  Clock,
  Scale,
  Camera,
  ArrowRight,
  ArrowUpRight,
  Edit3,
  X,
  Maximize2,
  ChevronDown
} from "lucide-react";
import { DEFAULT_SETTINGS, calculateTierPriceBdt, calculateShippingFee, calculateTwoStagePayment } from "@/lib/pricing";
import { getClientProductById } from "@/lib/seed-data";

interface ProductDetailClientProps {
  productId: string;
  initialProduct?: Product | null;
}

export function ProductDetailClient({ productId, initialProduct }: ProductDetailClientProps) {
  const router = useRouter();

  const fallbackProduct = initialProduct || getClientProductById(productId);
  const [product, setProduct] = useState<Product | null>(fallbackProduct);
  const [isLoading, setIsLoading] = useState(!fallbackProduct);
  const settings = DEFAULT_SETTINGS;

  const [selectedImage, setSelectedImage] = useState(fallbackProduct?.images[0] || "");
  const [selectedSku, setSelectedSku] = useState(fallbackProduct?.skus[0] || null);
  const [selectedSize, setSelectedSize] = useState<string>((fallbackProduct as any)?.sizes?.[0] || "");
  const [quantity, setQuantity] = useState(fallbackProduct?.minOrderQty || 1);
  const [shippingMethod, setShippingMethod] = useState<"AIR" | "SEA">("AIR");
  const [isQcModalOpen, setIsQcModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showAllDescImages, setShowAllDescImages] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(fallbackProduct?.titleEn || "");
  const [editPrice, setEditPrice] = useState(fallbackProduct?.basePriceRmb || 25);
  const [editImage, setEditImage] = useState(fallbackProduct?.images[0] || "");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleSaveEdit = async () => {
    if (!product) return;
    setIsSavingEdit(true);
    try {
      const priceNum = parseFloat(String(editPrice)) || product.basePriceRmb || 25;
      const updatedProduct: Product = {
        ...product,
        titleEn: editTitle.trim() || product.titleEn,
        basePriceRmb: priceNum,
        images: editImage.trim() ? [editImage.trim(), ...(product.images.slice(1))] : product.images,
        priceTiers: [
          { range: "2–9 pcs", minQty: 2, priceRmb: priceNum },
          { range: "10–49 pcs", minQty: 10, priceRmb: Number((priceNum * 0.9).toFixed(1)) },
          { range: "50+ pcs", minQty: 50, priceRmb: Number((priceNum * 0.82).toFixed(1)) }
        ]
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        setProduct(updatedProduct);
        setSelectedImage(updatedProduct.images[0]);
        setIsEditModalOpen(false);
      }
    } catch (e) {
      console.error("Save edit failed:", e);
    } finally {
      setIsSavingEdit(false);
    }
  };

  useEffect(() => {
    if (!productId) return;
    // Refresh or load if not available initially
    fetch(`/api/products/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          if (data.product.images?.length > 0 && !selectedImage) {
            setSelectedImage(data.product.images[0]);
          }
          if (data.product.skus?.length > 0 && !selectedSku) {
            setSelectedSku(data.product.skus[0]);
          }
          if (data.product.sizes?.length > 0 && !selectedSize) {
            setSelectedSize(data.product.sizes[0]);
          }
          if (data.product.minOrderQty && quantity < data.product.minOrderQty) {
            setQuantity(data.product.minOrderQty);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not load from API, keeping fallback:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productId]);

  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono">
        <div className="w-10 h-10 border-4 border-freight-amber border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Retrieving Factory Specifications...</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to live Guangzhou database</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-mono">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested factory product ID does not exist in the catalog.</p>
        <Link href="/" className="mt-4 text-transit-air underline inline-block">Return to Wholesale Catalog</Link>
      </div>
    );
  }

  // Calculate pricing based on chosen quantity
  const { unitPriceRmb, unitPriceBdt, totalPriceBdt } = calculateTierPriceBdt(
    product.priceTiers,
    quantity,
    settings.exchangeRateRmbToBdt,
    settings.defaultProfitMarginPercent
  );

  // Total weight for quantity
  const totalWeightKg = Number(((product.estimatedWeightKg || 0.3) * quantity).toFixed(2));
  const { shippingCostBdt, ratePerKg } = calculateShippingFee(
    totalWeightKg,
    shippingMethod,
    product.isSensitiveCargo,
    undefined,
    settings
  );

  const paymentBreakdown = calculateTwoStagePayment(
    totalPriceBdt,
    shippingCostBdt,
    settings.localCourierDhaka,
    50
  );

  const handleCheckout = () => {
    const checkoutItem = {
      product,
      sku: selectedSku,
      size: selectedSize,
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
    router.push("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 pb-28">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
        <Link href="/" className="hover:text-cargo-900 transition">Factory Catalog</Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-cargo-900 font-semibold truncate max-w-sm">{product.titleEn}</span>
      </div>

      {/* 1688 Verified Sourcing & Sync Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-cargo-900 text-white p-3 sm:p-4 rounded-2xl border border-cargo-750 shadow-xs text-xs font-mono">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-qc-emerald animate-pulse" />
          <span className="text-freight-amber font-bold">1688 Direct Factory Listing:</span>
          <span className="text-slate-300">Offer #{product.sourceOfferId}</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Guangzhou Warehouse Pre-Shipment Inspection</span>
        </div>
        <div className="flex items-center gap-2">
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cargo-800 hover:bg-cargo-700 text-slate-200 px-3 py-1.5 rounded-lg border border-cargo-650 transition flex items-center gap-1.5 btn-tactile"
            >
              <span>View on 1688</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-freight-amber" />
            </a>
          )}
          <button
            onClick={() => {
              setEditTitle(product.titleEn);
              setEditPrice(product.basePriceRmb);
              setEditImage(product.images[0]);
              setIsEditModalOpen(true);
            }}
            className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5 btn-tactile"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Quick Edit & Sync</span>
          </button>
        </div>
      </div>

      {/* Main Product Surface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery & Verified Inspection Badge (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            onClick={() => setLightboxImage(selectedImage || product.images[0])}
            className="aspect-square bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm relative group cursor-zoom-in"
          >
            <img
              src={selectedImage || product.images[0]}
              alt={product.titleEn}
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('fallback-product.jpg')) {
                  target.src = '/products/fallback-product.jpg';
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
              <span className="bg-cargo-950 text-freight-amber font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-xs border border-cargo-800">
                Direct Factory
              </span>
              {product.isSensitiveCargo && (
                <span className="bg-amber-600 text-white font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                  Battery Certified
                </span>
              )}
            </div>
            <div className="absolute top-3 right-3 bg-cargo-950/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition shadow-xs flex items-center gap-1.5 pointer-events-none">
              <Maximize2 className="w-3.5 h-3.5 text-freight-amber" />
              <span>Click to Zoom</span>
            </div>
            <div className="absolute bottom-3 right-3 bg-cargo-900/90 backdrop-blur-xs text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-md tabular-nums">
              Est. {product.estimatedWeightKg} kg/unit
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition btn-tactile ${
                  selectedImage === img 
                    ? "border-freight-amber ring-2 ring-freight-amber/30" 
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Guangzhou QC Inspection Checklist */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-xs space-y-3 text-slate-600 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2 text-cargo-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-qc-emerald" />
                <span>Guangzhou Warehouse QC Protocol</span>
              </div>
              <button
                onClick={() => setIsQcModalOpen(true)}
                className="text-[11px] text-transit-air hover:underline font-mono font-semibold"
              >
                View Protocol
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
                <span>Gross Weight Scale</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
                <span>Quantity Validation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
                <span>Color/Spec Matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
                <span>High-Res Photos</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Origin Warehouse:</span>
              <span className="font-semibold text-cargo-900 font-mono">{product.location} Hub</span>
            </div>
          </div>
        </div>

        {/* Right Column: Wholesale Specifications, Tier Matrix & 2-Stage Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>LOT #{product.sourceOfferId}</span>
              <span>•</span>
              <span className="text-qc-emerald font-semibold">{product.shopName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-cargo-900 leading-snug tracking-tight">
              {product.titleEn}
            </h1>
            {((product as any).factoryBadges && (product as any).factoryBadges.length > 0) && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(product as any).factoryBadges.map((badge: string, bIdx: number) => (
                  <span 
                    key={bIdx} 
                    className="inline-flex items-center text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg font-mono shadow-2xs"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Wholesale Tiered Pricing Matrix */}
          <div id="wholesale-quantity-matrix" className="bg-cargo-50 border border-cargo-100 rounded-2xl p-4.5 space-y-2 scroll-mt-20">
            <div className="text-xs font-bold text-cargo-900 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-freight-amber" />
                <span>Wholesale Quantity Ladder</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">Active tier highlights automatically</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
              {product.priceTiers.map((tier, idx) => {
                const { unitPriceBdt: tierBdt } = calculateTierPriceBdt(product.priceTiers, tier.minQty);
                const isActive = quantity >= tier.minQty && (idx === product.priceTiers.length - 1 || quantity < product.priceTiers[idx + 1].minQty);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition ${
                      isActive 
                        ? "bg-white border-freight-amber shadow-sm ring-2 ring-freight-amber/30 text-cargo-950 font-bold scale-[1.02]" 
                        : "bg-white/70 border-slate-200 text-slate-600"
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-slate-500">{tier.range}</div>
                    <div className="text-lg sm:text-xl font-black text-cargo-900 mt-0.5 tabular-nums">৳{tierBdt}</div>
                    <div className="text-[10px] text-slate-400">¥{tier.priceRmb.toFixed(1)} Ex-Factory</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SKU Variant Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-cargo-900 flex justify-between">
              <span>Select Factory Variant / Specification:</span>
              <span className="text-transit-air font-semibold">{selectedSku?.name || "Standard Model"}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.skus.map((sku) => {
                const isSelected = selectedSku?.id === sku.id;
                return (
                  <button
                    key={sku.id}
                    onClick={() => {
                      setSelectedSku(sku);
                      if (sku.image) setSelectedImage(sku.image);
                    }}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs font-medium transition btn-tactile ${
                      isSelected
                        ? "border-cargo-900 bg-cargo-900 text-white shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {sku.image && (
                      <img src={sku.image} alt={sku.name} className="w-8 h-8 rounded-lg object-cover" />
                    )}
                    <span>{sku.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1688 Size Matrix Selector */}
          {((product as any).sizes && (product as any).sizes.length > 0) && (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-cargo-900">Select Body Size / Weight Spec:</label>
                <span className="text-transit-air font-semibold font-mono">{selectedSize || (product as any).sizes[0]}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(product as any).sizes.map((sizeStr: string, idx: number) => {
                  const isSelected = (selectedSize || (product as any).sizes[0]) === sizeStr;
                  const [sizeCode, ...rest] = sizeStr.split(' ');
                  const specLabel = rest.join(' ');
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sizeStr)}
                      className={`p-2 rounded-xl border text-xs font-mono transition text-left btn-tactile ${
                        isSelected
                          ? "bg-cargo-900 text-white border-cargo-900 shadow-xs font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="font-bold text-xs">{sizeCode}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {specLabel}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector with MOQ */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-cargo-900">Wholesale Quantity (Units):</label>
              <span className="text-slate-500 font-mono">
                Factory MOQ: <strong className="text-cargo-900">{product.minOrderQty} pcs</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(product.minOrderQty, quantity - 1))}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-cargo-900 font-bold transition btn-tactile"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(product.minOrderQty, parseInt(e.target.value) || product.minOrderQty))}
                  className="w-16 py-2 text-center text-sm font-bold font-mono text-cargo-950 focus:outline-none tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-cargo-900 font-bold transition btn-tactile"
                >
                  +
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5 font-mono">
                {[product.minOrderQty, 10, 50, 100].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setQuantity(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition btn-tactile ${
                      quantity === preset 
                        ? "bg-cargo-900 text-white border-cargo-900 shadow-xs" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {preset} pcs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* International Freight Mode Selector */}
          <div className="space-y-2 border-t border-slate-200 pt-4">
            <label className="text-xs font-bold text-cargo-900">Choose Freight Corridor to Bangladesh:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShippingMethod("AIR")}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between btn-tactile ${
                  shippingMethod === "AIR"
                    ? "border-transit-air bg-sky-50/70 ring-2 ring-transit-air/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-cargo-900">
                    <Plane className="w-4 h-4 text-transit-air" />
                    <span>Air Cargo (10–18 Days)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                    ৳{ratePerKg}/kg (Fast Express, Customs included)
                  </div>
                </div>
                {shippingMethod === "AIR" && <CheckCircle2 className="w-4 h-4 text-transit-air" />}
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod("SEA")}
                className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between btn-tactile ${
                  shippingMethod === "SEA"
                    ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-cargo-900">
                    <Ship className="w-4 h-4 text-indigo-600" />
                    <span>Sea Freight (30–45 Days)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                    ৳220/kg (Heavy wholesale & bulk containers)
                  </div>
                </div>
                {shippingMethod === "SEA" && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </button>
            </div>
          </div>

          {/* Two-Stage Advance Payment Breakdown Box */}
          <div className="glass-bento-dark text-white rounded-3xl p-6 space-y-4 shadow-cargo-lg">
            <div className="flex items-center justify-between border-b border-cargo-800 pb-3">
              <div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider block font-mono">
                  Total Order Value ({quantity} pcs)
                </span>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white tabular-nums">
                  ৳{totalPriceBdt.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-400">BDT</span>
                </div>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono tabular-nums">
                <span>Ex-Factory: </span>
                <span className="text-freight-amber font-bold">¥{(unitPriceRmb * quantity).toFixed(1)} RMB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-cargo-900/90 border border-qc-emerald/40 p-3.5 rounded-2xl space-y-1">
                <div className="text-qc-emerald font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse"></span>
                  <span>STAGE 1: PAY NOW (50%)</span>
                </div>
                <div className="text-2xl font-mono font-black text-white tabular-nums">
                  ৳{paymentBreakdown.advanceAmountBdt.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-300">
                  Required to initiate factory manufacturing in China
                </p>
              </div>

              <div className="bg-cargo-900/90 border border-cargo-700 p-3.5 rounded-2xl space-y-1">
                <div className="text-freight-amber font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-freight-amber" />
                  <span>STAGE 2: ON BD ARRIVAL</span>
                </div>
                <div className="text-2xl font-mono font-black text-white tabular-nums">
                  ৳{paymentBreakdown.stage2TotalPayableBdt.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-300">
                  Remaining 50% + {shippingMethod === "AIR" ? "Air" : "Sea"} Cargo (৳{shippingCostBdt.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Direct Checkout CTA */}
            <div className="pt-2">
              <button
                onClick={handleCheckout}
                className="w-full bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 px-6 rounded-2xl text-sm transition shadow-cargo flex items-center justify-center gap-2 btn-tactile"
              >
                <span>Lock Order with 50% Advance</span>
                <span className="font-mono font-bold">• ৳{paymentBreakdown.advanceAmountBdt.toLocaleString()} BDT</span>
                <ArrowRight className="w-4 h-4 text-cargo-950" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Overview & Translated Specifications */}
      <div className="space-y-8 pt-4">
        {/* Description & Factory Grade Summary */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-freight-amber rounded-full"></span>
            <h2 className="text-lg sm:text-xl font-bold text-cargo-900">
              Factory Overview & Sourcing Notes
            </h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {product.description || "Direct factory wholesale supply with verified pre-shipment quality inspection at Guangzhou Hub."}
          </p>
          {product.descriptionCn && product.descriptionCn !== product.description && (
            <div className="pt-2 text-xs text-slate-400 font-mono border-t border-slate-100 line-clamp-2">
              <span className="font-semibold text-slate-500">Origin Manufacturer Summary:</span> {product.descriptionCn}
            </div>
          )}
        </div>

        {/* Factory Technical Specifications Matrix */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-freight-amber" />
                  <h2 className="text-lg sm:text-xl font-bold text-cargo-900">
                    Verified Factory Technical Specifications
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Parameters extracted from manufacturer blueprint and translated to English
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-qc-emerald bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                {product.attributes.length} Verified Parameters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {product.attributes.map((attr, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition flex items-start justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-cargo-900 block">
                      {attr.keyEn || attr.keyCn}
                    </span>
                    {attr.keyCn && attr.keyCn !== attr.keyEn && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {attr.keyCn}
                      </span>
                    )}
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="font-semibold text-xs text-slate-800 font-mono block">
                      {attr.valueEn || attr.valueCn}
                    </span>
                    {attr.valueCn && attr.valueCn !== attr.valueEn && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {attr.valueCn}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Factory Blueprint & Detailed Description Photos Gallery */}
        {(() => {
          const cleanDescImages = (product.descriptionImages || []).filter(
            (img) => typeof img === "string" && !img.includes("-tps-") && !img.includes("tps-") && !img.includes("tfs/") && !img.includes("blank.png")
          );
          if (cleanDescImages.length === 0) return null;

          const displayedImgs = showAllDescImages ? cleanDescImages : cleanDescImages.slice(0, 6);

          return (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-transit-air" />
                    <h2 className="text-lg sm:text-xl font-bold text-cargo-900">
                      Factory Blueprint & Inspection Photo Gallery
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manufacturer schematics, dimension blueprints, and workshop assembly photos ({cleanDescImages.length} verified photos)
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Click any image to view in high resolution
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {displayedImgs.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImage(img)}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-xs hover:shadow-md transition"
                  >
                    <img
                      src={img}
                      alt={`Factory Diagram ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover group-hover:scale-[1.02] transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-cargo-950/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow">
                        <Maximize2 className="w-3.5 h-3.5 text-freight-amber" />
                        <span>Expand View</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {cleanDescImages.length > 6 && (
                <div className="pt-3 flex justify-center border-t border-slate-100">
                  <button
                    onClick={() => setShowAllDescImages(!showAllDescImages)}
                    className="bg-slate-100 hover:bg-slate-200 text-cargo-900 font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 btn-tactile"
                  >
                    <span>{showAllDescImages ? "Collapse Blueprint Gallery" : `View All ${cleanDescImages.length} Inspection Photos & Schematics`}</span>
                    <ChevronDown className={`w-4 h-4 transition duration-200 ${showAllDescImages ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Lightbox Modal for Full-Resolution Viewing */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center cursor-default"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 z-10 p-2 rounded-full bg-cargo-900/90 border border-slate-700 text-white hover:bg-rose-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={lightboxImage} 
              alt="Expanded Factory Inspection View" 
              className="max-h-[75vh] w-auto max-w-full rounded-2xl border border-slate-700/60 shadow-2xl object-contain bg-cargo-950" 
            />
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto p-1 max-w-md">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setLightboxImage(img);
                      setSelectedImage(img);
                    }}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                      lightboxImage === img ? "border-freight-amber ring-2 ring-freight-amber/30 scale-105" : "border-slate-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Origin-Aware QC Protocol Modal (Emil Kowalski modal rules) */}
      {isQcModalOpen && (
        <div className="fixed inset-0 bg-cargo-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-modal-enter">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-qc-emerald" />
                <h3 className="font-bold text-base text-cargo-900">Guangzhou QC Inspection Protocol</h3>
              </div>
              <button 
                onClick={() => setIsQcModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cargo-900 hover:bg-slate-100 btn-tactile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Every parcel entering our Guangzhou warehouse undergoes physical verification before dispatch:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <strong className="text-cargo-900 block font-mono">1. Digital Scale Weighing</strong>
                  <span>Accurate to 10 grams, logged directly into your consignment waybill.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <strong className="text-cargo-900 block font-mono">2. Visual Spec & Defect Check</strong>
                  <span>Verification of color, model variants, and exterior packaging condition.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <strong className="text-cargo-900 block font-mono">3. High-Resolution QC Photo Sync</strong>
                  <span>2–4 photos uploaded to your account tracking page prior to flight loading.</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsQcModalOpen(false)}
              className="w-full bg-cargo-900 hover:bg-cargo-800 text-white font-bold py-3 rounded-xl text-xs transition btn-tactile"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Fixed Bottom Mobile Order Bar (< 768px ergonomics) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-cargo flex items-center justify-between gap-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="min-w-0">
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
            <span>50% Advance</span>
            <span className="text-qc-emerald font-semibold">• {quantity} pcs</span>
          </div>
          <div className="text-base font-black text-cargo-900 font-mono tabular-nums leading-tight">
            ৳{paymentBreakdown.advanceAmountBdt.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 font-mono tabular-nums">
            Total: ৳{totalPriceBdt.toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("wholesale-quantity-matrix");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-cargo-900 text-xs font-bold font-mono hover:bg-slate-100 active:scale-95 transition min-h-[44px]"
          >
            Qty: {quantity}
          </button>
          <button
            onClick={handleCheckout}
            className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black px-5 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5 btn-tactile min-h-[44px]"
          >
            <span>Order 50%</span>
            <ArrowRight className="w-3.5 h-3.5 text-cargo-950" />
          </button>
        </div>
      </div>

      {/* Quick Edit & Sync Listing Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-cargo-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-modal-enter text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-freight-amber" />
                <h3 className="font-bold text-base text-cargo-900">Quick Edit & Sync Listing</h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-cargo-900 hover:bg-slate-100 btn-tactile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title (English)</label>
                <input 
                  type="text" 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-freight-amber text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Factory RMB Price (¥)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    step="0.1" 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-1/2 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-freight-amber text-xs font-mono"
                  />
                  <span className="text-slate-500 font-mono text-[11px]">
                    ≈ ৳{Math.round(Number(editPrice) * 17.5 * 1.12)} BDT (Tier 1)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Image URL</label>
                <input 
                  type="text" 
                  value={editImage} 
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-freight-amber text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSavingEdit}
                onClick={handleSaveEdit}
                className="w-2/3 bg-cargo-900 hover:bg-cargo-800 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-freight-amber" />
                <span>{isSavingEdit ? "Saving..." : "Save & Update Store"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

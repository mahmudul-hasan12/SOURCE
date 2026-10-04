"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Settings, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  ExternalLink,
  Layers,
  Plus,
  X,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { GlobalSettings, Product, Order } from "@/types";

export default function AdminPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);
  const [newProd, setNewProd] = useState({
    titleEn: "",
    titleCn: "",
    category: "Industrial & Building",
    shopName: "Foshan Precision Manufacturing Ltd.",
    basePriceRmb: "45.00",
    minOrderQty: "2",
    estimatedWeightKg: "0.5",
    isSensitiveCargo: false,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    description: "High-spec factory direct wholesale batch with verified pre-shipment quality inspection."
  });

  const refreshProducts = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.titleEn.trim()) {
      alert("Please enter a product title.");
      return;
    }
    setIsCreatingProduct(true);
    setCreateSuccessMsg(null);

    const basePrice = parseFloat(newProd.basePriceRmb) || 45;
    const moq = parseInt(newProd.minOrderQty, 10) || 2;

    const payload = {
      titleEn: newProd.titleEn,
      titleCn: newProd.titleCn || newProd.titleEn,
      category: newProd.category,
      shopName: newProd.shopName,
      basePriceRmb: basePrice,
      minOrderQty: moq,
      estimatedWeightKg: parseFloat(newProd.estimatedWeightKg) || 0.5,
      isSensitiveCargo: newProd.isSensitiveCargo,
      images: [newProd.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"],
      description: newProd.description,
      priceTiers: [
        { range: `${moq}–${moq * 5} pcs`, minQty: moq, priceRmb: basePrice },
        { range: `${moq * 5 + 1}–${moq * 25} pcs`, minQty: moq * 5 + 1, priceRmb: Number((basePrice * 0.9).toFixed(1)) },
        { range: `${moq * 25 + 1}+ pcs`, minQty: moq * 25 + 1, priceRmb: Number((basePrice * 0.82).toFixed(1)) }
      ]
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreateSuccessMsg(`Product created! ID: ${data.productId}`);
        refreshProducts();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setCreateSuccessMsg(null);
          // reset form
          setNewProd({
            titleEn: "",
            titleCn: "",
            category: "Industrial & Building",
            shopName: "Foshan Precision Manufacturing Ltd.",
            basePriceRmb: "45.00",
            minOrderQty: "2",
            estimatedWeightKg: "0.5",
            isSensitiveCargo: false,
            imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
            description: "High-spec factory direct wholesale batch with verified pre-shipment quality inspection."
          });
        }, 1500);
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (err: any) {
      alert("Error creating product: " + err.message);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  useEffect(() => {
    // Load settings, products, orders from API
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSettings(data.settings));

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []));

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return <div className="p-10 text-center text-slate-500">Loading admin operations...</div>;
  }

  // Financial calculations
  const totalBdtRevenue = orders.reduce((sum, o) => sum + (o.pricing.advanceAmountBdt || 0), 0);
  const totalRmbSpent = orders.reduce((sum, o) => sum + (o.pricing.productTotalRmb || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            <h1 className="text-xl font-bold text-slate-900">Admin Business Operations & Tariffs</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure exchange rates, profit commissions, freight tariffs, and manage imported products
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/warehouse"
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Go to China Warehouse Desk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500">Total Orders in Pipeline</div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium">All cross-border orders tracked</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500">Collected Advance (BDT)</div>
          <div className="text-2xl font-black text-emerald-600">৳{totalBdtRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Stage 1 50% bKash/Nagad receipts</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="text-xs font-semibold text-slate-500">1688 Factory Purchases (RMB)</div>
          <div className="text-2xl font-black text-amber-600">¥{totalRmbSpent.toFixed(1)}</div>
          <div className="text-[11px] text-slate-400">Total cost paid to Chinese suppliers</div>
        </div>
      </div>

      {/* Tariff & Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Exchange Rates & Commission Rules</span>
          </h3>
          {saveSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              RMB ➜ BDT Exchange Rate
            </label>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">1 RMB = ৳</span>
              <input
                type="number"
                step="0.05"
                value={settings.exchangeRateRmbToBdt}
                onChange={(e) => setSettings({ ...settings, exchangeRateRmbToBdt: parseFloat(e.target.value) || 17.5 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Official bank rate + FX margin</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Agent Sourcing Commission (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="1"
                value={settings.defaultProfitMarginPercent}
                onChange={(e) => setSettings({ ...settings, defaultProfitMarginPercent: parseFloat(e.target.value) || 12 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className="font-bold text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Added to base 1688 price</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Stage 1 Advance Percentage (%)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="5"
                value={settings.advancePaymentPercent}
                onChange={(e) => setSettings({ ...settings, advancePaymentPercent: parseFloat(e.target.value) || 50 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
              <span className="font-bold text-slate-400">%</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Standard: 50% upfront</span>
          </div>
        </div>

        {/* Shipping Tariffs */}
        <h4 className="font-bold text-xs text-slate-800 pt-2 border-t">
          International Cargo Rates (China ➜ Bangladesh)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Air Freight (General Goods)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.airRatePerKgGeneral}
                onChange={(e) => setSettings({ ...settings, airRatePerKgGeneral: parseFloat(e.target.value) || 750 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
              <span className="text-slate-500">৳/kg</span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Air Freight (Sensitive Goods: Battery / Liquid)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.airRatePerKgSensitive}
                onChange={(e) => setSettings({ ...settings, airRatePerKgSensitive: parseFloat(e.target.value) || 950 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
              <span className="text-slate-500">৳/kg</span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Sea Freight (Per KG)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.seaRatePerKg}
                onChange={(e) => setSettings({ ...settings, seaRatePerKg: parseFloat(e.target.value) || 220 })}
                className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900"
              />
              <span className="text-slate-500">৳/kg</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition flex items-center gap-2 shadow"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving Rates..." : "Save Pricing & Tariffs"}</span>
        </button>
      </form>

      {/* Catalog of Imported 1688 Products */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-rose-600" />
              <span>Store Product Catalog ({products.length} Products)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Imported via Chrome Extension, Direct Sourcing URL, or Manual Entry
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>+ Add New Product</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {products.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={p.images[0]} alt="Img" className="w-12 h-12 rounded-lg object-cover border" />
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 line-clamp-1">{p.titleEn}</h4>
                  <div className="text-[11px] text-slate-500">
                    Base: <b>¥{p.basePriceRmb} RMB</b> | MOQ: {p.minOrderQty} pcs | Supplier: {p.shopName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/product/${p.id}`}
                  className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-700 flex items-center gap-1"
                >
                  <span>View Product</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Direct Factory Product Ingestion</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish a new product to the wholesale catalog immediately without needing the Chrome extension.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{createSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Industrial Aluminum Extrusion Profiles 4040 Series"
                    value={newProd.titleEn}
                    onChange={(e) => setNewProd({ ...newProd, titleEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Factory Title / Chinese Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 工业铝型材4040国标"
                    value={newProd.titleCn}
                    onChange={(e) => setNewProd({ ...newProd, titleCn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Industrial & Building">Industrial & Building Materials</option>
                    <option value="Electronics & Audio">Electronics & Smart Audio</option>
                    <option value="Machinery & Hardware">Machinery & Heavy Hardware</option>
                    <option value="Textiles & Apparel">Textiles & Apparel</option>
                    <option value="Home & Office">Home & Office Appliances</option>
                    <option value="General Wholesale">General Wholesale Sourcing</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Base Factory RMB Price (¥) *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-400">¥</span>
                    <input
                      type="number"
                      step="0.1"
                      required
                      min="1"
                      value={newProd.basePriceRmb}
                      onChange={(e) => setNewProd({ ...newProd, basePriceRmb: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">Wholesale price in China (before FX & freight)</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Minimum Order Quantity (MOQ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.minOrderQty}
                    onChange={(e) => setNewProd({ ...newProd, minOrderQty: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Tier 1 discount scales automatically</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Estimated Weight per Unit (kg)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    value={newProd.estimatedWeightKg}
                    onChange={(e) => setNewProd({ ...newProd, estimatedWeightKg: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">Used for accurate air/sea freight calculation</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Supplier / Verified Factory Name
                  </label>
                  <input
                    type="text"
                    value={newProd.shopName}
                    onChange={(e) => setNewProd({ ...newProd, shopName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProd.imageUrl}
                    onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 font-mono text-[11px] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  {/* Preset quick image picks */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                    <button
                      type="button"
                      onClick={() => setNewProd({ ...newProd, imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700"
                    >
                      Industrial / CNC
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProd({ ...newProd, imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80" })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700"
                    >
                      Smart Audio / TWS
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProd({ ...newProd, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700"
                    >
                      Electronics
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewProd({ ...newProd, imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80" })}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700"
                    >
                      Building & Architectural
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Product Description / Specifications
                  </label>
                  <textarea
                    rows={2}
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800 block">Sensitive Cargo (Battery / Liquid / Magnet)</span>
                    <span className="text-[10px] text-slate-500">Subject to air sensitive cargo freight tariff (৳950/kg)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newProd.isSensitiveCargo}
                    onChange={(e) => setNewProd({ ...newProd, isSensitiveCargo: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingProduct ? "Publishing..." : "Publish Product to Store"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

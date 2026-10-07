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
  Phone,
  Copy,
  Check,
  Trash2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { GlobalSettings, Product, Order, OrderStatus } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/pricing";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"ORDERS" | "SETTINGS" | "CATALOG">("ORDERS");
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);

  // Filter & Search in Orders
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);
  const [newProd, setNewProd] = useState({
    titleEn: "",
    titleCn: "",
    category: "apparel",
    shopName: "Guangdong Verified Factory Partner",
    basePriceRmb: "25.00",
    minOrderQty: "2",
    estimatedWeightKg: "0.55",
    isSensitiveCargo: false,
    imageUrl: "https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg",
    description: "Factory direct wholesale batch with verified pre-shipment quality inspection at Guangzhou Hub."
  });

  const loadData = () => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {});

    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e: any) {
      alert("Failed to update status: " + e.message);
    }
  };

  const handleVerifyPayment = async (order: Order) => {
    try {
      const updatedPayment = {
        ...order.payment,
        verified: true,
        verifiedAt: new Date().toISOString(),
        verifiedBy: "Admin"
      };
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "STAGE1_PAID",
          payment: updatedPayment
        })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? { ...o, status: "STAGE1_PAID", payment: updatedPayment as any }
              : o
          )
        );
      }
    } catch (e: any) {
      alert("Failed to verify payment: " + e.message);
    }
  };

  const handleUpdateChinaTracking = async (orderId: string, trackingNumber: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking: { chinaTrackingNumber: trackingNumber }
        })
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, tracking: { ...o.tracking, chinaTrackingNumber: trackingNumber } }
            : o
        )
      );
      alert("China tracking number updated!");
    } catch (e: any) {
      alert("Failed to update tracking: " + e.message);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm("Are you sure you want to delete this product from the catalog?")) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== prodId && p.sourceOfferId !== prodId));
      }
    } catch (e: any) {
      alert("Failed to delete product: " + e.message);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      }
    } catch (e: any) {
      alert("Failed to delete order: " + e.message);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.titleEn.trim()) {
      alert("Please enter a product title.");
      return;
    }
    setIsCreatingProduct(true);
    setCreateSuccessMsg(null);

    const basePrice = parseFloat(newProd.basePriceRmb) || 25;
    const moq = parseInt(newProd.minOrderQty, 10) || 2;

    const payload = {
      titleEn: newProd.titleEn,
      titleCn: newProd.titleCn || newProd.titleEn,
      category: newProd.category,
      shopName: newProd.shopName,
      basePriceRmb: basePrice,
      minOrderQty: moq,
      estimatedWeightKg: parseFloat(newProd.estimatedWeightKg) || 0.55,
      isSensitiveCargo: newProd.isSensitiveCargo,
      images: [newProd.imageUrl || "https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg"],
      description: newProd.description,
      priceTiers: [
        { range: `${moq}–${moq * 5} pcs`, minQty: moq, priceRmb: basePrice },
        { range: `${moq * 5 + 1}–${moq * 25} pcs`, minQty: moq * 5 + 1, priceRmb: Number((basePrice * 0.95).toFixed(1)) },
        { range: `${moq * 25 + 1}+ pcs`, minQty: moq * 25 + 1, priceRmb: Number((basePrice * 0.88).toFixed(1)) }
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
        setCreateSuccessMsg(`Product published! ID: ${data.productId}`);
        loadData();
        setTimeout(() => {
          setIsAddModalOpen(false);
          setCreateSuccessMsg(null);
        }, 1200);
      } else {
        alert(data.message || "Failed to create product");
      }
    } catch (err: any) {
      alert("Error creating product: " + err.message);
    } finally {
      setIsCreatingProduct(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch) ||
      (o.payment?.transactionId && o.payment.transactionId.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.payment?.senderNumber && o.payment.senderNumber.includes(orderSearch));

    const matchesStatus =
      orderStatusFilter === "ALL" ||
      (orderStatusFilter === "PENDING" && o.status === "STAGE1_PENDING") ||
      (orderStatusFilter === "PAID" && o.status !== "STAGE1_PENDING") ||
      o.status === orderStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const pendingCount = orders.filter((o) => o.status === "STAGE1_PENDING").length;
  const verifiedCount = orders.filter((o) => o.status !== "STAGE1_PENDING").length;
  const totalBdtRevenue = orders.reduce((sum, o) => sum + (o.pricing.advanceAmountBdt || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      {/* Top Industrial Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cargo-900 text-freight-amber rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-cargo-900 tracking-tight">
              SkyBuyBD Style Operations Control Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ম্যানেজ করুন bKash ও Nagad পেমেন্ট TrxID, চায়না এক্সচেঞ্জ রেট, এয়ার ও সি কার্গো ট্যারিফ এবং প্রোডাক্ট ক্যাটালগ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadData}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition text-xs font-semibold flex items-center gap-1"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <Link
            href="/warehouse"
            className="bg-cargo-900 hover:bg-cargo-800 text-freight-amber font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Package className="w-3.5 h-3.5 text-freight-amber" />
            <span>Guangzhou QC Desk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Total Orders in Pipeline</div>
          <div className="text-2xl font-black text-cargo-900 font-mono tabular-nums">{orders.length}</div>
          <div className="text-[11px] text-slate-400">All customer shipments</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs space-y-1 bg-amber-50/30">
          <div className="text-xs font-semibold text-amber-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending TrxID Review</span>
          </div>
          <div className="text-2xl font-black text-amber-600 font-mono tabular-nums">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting admin verification</div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-1 bg-emerald-50/30">
          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified & Confirmed</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{verifiedCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Stage 1 deposit confirmed</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500">Collected Advance (BDT)</div>
          <div className="text-2xl font-black text-cargo-900 font-mono tabular-nums">৳{totalBdtRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">bKash / Nagad receipts</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("ORDERS")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "ORDERS"
              ? "border-freight-amber text-cargo-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Truck className="w-4 h-4 text-freight-amber" />
          <span>Orders & TrxID Verification ({orders.length})</span>
          {pendingCount > 0 && (
            <span className="bg-amber-500 text-cargo-950 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "SETTINGS"
              ? "border-freight-amber text-cargo-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <span>bKash/Nagad & Exchange Rates</span>
        </button>

        <button
          onClick={() => setActiveTab("CATALOG")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition ${
            activeTab === "CATALOG"
              ? "border-freight-amber text-cargo-900"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4 text-rose-600" />
          <span>Product Catalog ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & TrxID VERIFICATION */}
      {activeTab === "ORDERS" && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by Order #, Customer, Phone, TrxID..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-freight-amber focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-freight-amber focus:outline-none bg-white font-medium"
              >
                <option value="ALL">All Statuses ({orders.length})</option>
                <option value="PENDING">Pending Review ({pendingCount})</option>
                <option value="PAID">Confirmed / Paid ({verifiedCount})</option>
                <option value="PURCHASING_IN_CHINA">Purchasing in China</option>
                <option value="CHINA_WAREHOUSE_RECEIVED">Guangzhou Hub Received</option>
                <option value="QC_VERIFIED">QC Verified</option>
                <option value="DISPATCHED_TO_BD">Dispatched to BD</option>
                <option value="ARRIVED_DHAKA_HUB">Arrived Dhaka</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 font-mono text-xs">
              No orders matched your search criteria.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isPending = order.status === "STAGE1_PENDING" || !order.payment?.verified;
                const pay = order.payment;

                return (
                  <div
                    key={order.id}
                    className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 transition ${
                      isPending ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-black text-sm font-mono text-cargo-950">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                          isPending 
                            ? "bg-amber-100 text-amber-800 border-amber-300 animate-pulse" 
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/orders/${order.id}/track`}
                          target="_blank"
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition"
                        >
                          <span>Live Tracking</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                      {/* Product & Customer Details (5 cols) */}
                      <div className="md:col-span-5 space-y-3">
                        <div className="flex gap-3">
                          <img
                            src={order.items[0]?.productImage || "/products/fallback-product.jpg"}
                            alt="Product"
                            className="w-14 h-14 rounded-xl object-cover border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-cargo-900 line-clamp-1">
                              {order.items[0]?.productTitle}
                            </h4>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              Qty: <strong>{order.items[0]?.quantity} pcs</strong> • {order.shippingMethod} Cargo
                            </div>
                            <div className="text-[11px] font-mono text-freight-amber font-bold mt-0.5">
                              Advance: ৳{(order.pricing.advanceAmountBdt || 0).toLocaleString()} • Total: ৳{(order.pricing.totalOrderBdt || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 border border-slate-100">
                          <div className="font-bold text-slate-800">
                            Customer: {order.customer.name} ({order.customer.phone})
                          </div>
                          <div className="text-slate-500 text-[11px] line-clamp-1">
                            {order.customer.fullAddress}, {order.customer.thana}, {order.customer.district}
                          </div>
                        </div>
                      </div>

                      {/* Payment Verification Box (4 cols) */}
                      <div className="md:col-span-4 bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center border-b pb-1.5">
                          <span className="font-sans font-bold text-slate-700">MFS Payment Receipt:</span>
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            pay?.method === "BKASH" ? "bg-pink-100 text-pink-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {pay?.method || "BKASH"}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-sans">Sender Mobile:</span>
                            <span className="font-bold text-cargo-900">{pay?.senderNumber || order.customer.phone}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-sans">TrxID:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-cargo-950 tracking-wider">
                                {pay?.transactionId || "N/A"}
                              </span>
                              {pay?.transactionId && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(pay.transactionId);
                                    setCopiedTrxId(pay.transactionId);
                                    setTimeout(() => setCopiedTrxId(null), 2000);
                                  }}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-600"
                                  title="Copy TrxID"
                                >
                                  {copiedTrxId === pay.transactionId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-slate-500 font-sans">Amount Expected:</span>
                            <span className="font-bold text-emerald-600">৳{(order.pricing.advanceAmountBdt || 0).toLocaleString()} BDT</span>
                          </div>
                        </div>

                        {/* Verify Payment Button */}
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => handleVerifyPayment(order)}
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify TrxID & Approve Order</span>
                          </button>
                        ) : (
                          <div className="text-center text-[11px] text-emerald-700 font-semibold bg-emerald-50 py-1.5 rounded-lg border border-emerald-200 flex items-center justify-center gap-1 mt-1 font-sans">
                            <Check className="w-3.5 h-3.5" />
                            <span>TrxID Verified • Order Confirmed</span>
                          </div>
                        )}
                      </div>

                      {/* Status & China Tracking Update (3 cols) */}
                      <div className="md:col-span-3 space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            Advance Pipeline Status:
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="w-full text-xs font-semibold px-2.5 py-2 border rounded-xl bg-white text-cargo-900 focus:ring-2 focus:ring-freight-amber focus:outline-none"
                          >
                            <option value="STAGE1_PENDING">STAGE1_PENDING (Review TrxID)</option>
                            <option value="STAGE1_PAID">STAGE1_PAID (Confirmed)</option>
                            <option value="PURCHASING_IN_CHINA">PURCHASING_IN_CHINA</option>
                            <option value="CHINA_WAREHOUSE_RECEIVED">CHINA_WAREHOUSE_RECEIVED</option>
                            <option value="QC_VERIFIED">QC_VERIFIED (Photos Taken)</option>
                            <option value="DISPATCHED_TO_BD">DISPATCHED_TO_BD (In Flight)</option>
                            <option value="CUSTOMS_CLEARED">CUSTOMS_CLEARED</option>
                            <option value="ARRIVED_DHAKA_HUB">ARRIVED_DHAKA_HUB</option>
                            <option value="LOCAL_DELIVERY">LOCAL_DELIVERY</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                            China Tracking / SF Express #:
                          </label>
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              defaultValue={order.tracking.chinaTrackingNumber || ""}
                              id={`tracking-${order.id}`}
                              placeholder="e.g. SF12345678"
                              className="w-full text-xs font-mono px-2 py-1.5 border rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const input = document.getElementById(`tracking-${order.id}`) as HTMLInputElement;
                                if (input) handleUpdateChinaTracking(order.id, input.value);
                              }}
                              className="px-2.5 py-1.5 bg-cargo-900 hover:bg-cargo-800 text-white rounded-lg text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SETTINGS, bKASH/NAGAD & EXCHANGE RATES */}
      {activeTab === "SETTINGS" && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Exchange Rates & Mobile Financial Services (MFS) Configuration</span>
            </h3>
            {saveSuccess && (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings Saved!
              </span>
            )}
          </div>

          {/* bKash & Nagad Accounts Configuration */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-cargo-900 uppercase tracking-wider text-slate-400">
              Mobile Financial Services (Only bKash & Nagad)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {/* bKash Settings */}
              <div className="bg-pink-50/50 border border-pink-200/80 rounded-2xl p-4 space-y-3">
                <div className="font-black text-pink-600 text-sm flex items-center justify-between">
                  <span>bKash Account Settings</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-mono">bKash</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    bKash Number (Display at Checkout):
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.bkashNumber}
                    onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    placeholder="017XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    bKash Account Type:
                  </label>
                  <select
                    value={settings.bkashAccountType}
                    onChange={(e) => setSettings({ ...settings, bkashAccountType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-pink-500 focus:outline-none bg-white"
                  >
                    <option value="MERCHANT">MERCHANT (Payment)</option>
                    <option value="PERSONAL">PERSONAL (Send Money)</option>
                    <option value="AGENT">AGENT (Cash In)</option>
                  </select>
                </div>
              </div>

              {/* Nagad Settings */}
              <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-4 space-y-3">
                <div className="font-black text-orange-600 text-sm flex items-center justify-between">
                  <span>Nagad Account Settings</span>
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono">Nagad</span>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nagad Number (Display at Checkout):
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.nagadNumber}
                    onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    placeholder="018XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nagad Account Type:
                  </label>
                  <select
                    value={settings.nagadAccountType}
                    onChange={(e) => setSettings({ ...settings, nagadAccountType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white"
                  >
                    <option value="PERSONAL">PERSONAL (Send Money)</option>
                    <option value="MERCHANT">MERCHANT (Payment)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* WhatsApp Hotline & Announcement Notice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official WhatsApp Sourcing Hotline:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Used on WhatsApp consultation buttons</span>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Homepage Announcement Notice:
                </label>
                <input
                  type="text"
                  value={settings.announcementNotice || ""}
                  onChange={(e) => setSettings({ ...settings, announcementNotice: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-freight-amber focus:outline-none"
                  placeholder="আন্তর্জাতিক সরাসরি পাইকারি সোর্সিং | ১০০% নিরাপদ পেমেন্ট | ডেলিভারি চার্জ শুধু প্রতি কেজিতে"
                />
              </div>
            </div>
          </div>

          {/* Exchange Rates & Tariffs */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-xs text-cargo-900 uppercase tracking-wider text-slate-400">
              Exchange Rate & Freight Tariffs
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  RMB ➜ BDT Exchange Rate:
                </label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400">1 RMB = ৳</span>
                  <input
                    type="number"
                    step="0.05"
                    value={settings.exchangeRateRmbToBdt}
                    onChange={(e) => setSettings({ ...settings, exchangeRateRmbToBdt: parseFloat(e.target.value) || 18.5 })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Air Freight (General Goods):
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
                  Sea Freight (Per KG):
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
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-cargo-900 hover:bg-cargo-800 text-white font-bold py-3 px-6 rounded-xl text-xs transition flex items-center gap-2 shadow btn-tactile"
          >
            <Save className="w-4 h-4 text-freight-amber" />
            <span>{isSaving ? "Saving Settings..." : "Save All Rates & Accounts"}</span>
          </button>
        </form>
      )}

      {/* TAB 3: PRODUCT CATALOG */}
      {activeTab === "CATALOG" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
            <div>
              <h3 className="font-bold text-sm text-cargo-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-rose-600" />
                <span>Store Wholesale Catalog ({products.length} Products)</span>
              </h3>
              <span className="text-xs text-slate-400">
                1688 / Taobao items ready for customer quoting and instant purchase
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-freight-amber hover:bg-freight-amberHover text-cargo-950 font-black text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-xs btn-tactile"
            >
              <Plus className="w-4 h-4 text-cargo-950" />
              <span>+ Add New Product</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {products.map((p) => (
              <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0] || "/products/fallback-product.jpg"}
                    alt="Img"
                    className="w-12 h-12 rounded-xl object-cover border flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-semibold text-xs text-cargo-900 line-clamp-1">{p.titleEn}</h4>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Offer #{p.sourceOfferId} • Base: <b>¥{p.basePriceRmb} RMB</b> • MOQ: {p.minOrderQty} pcs • {p.shopName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/product/${p.id}`}
                    target="_blank"
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium text-slate-700 flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-freight-amber" />
                  <span>Publish New Product to Wholesale Catalog</span>
                </h3>
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
                    placeholder="e.g. Vintage High-Street Loose Denim Jeans"
                    value={newProd.titleEn}
                    onChange={(e) => setNewProd({ ...newProd, titleEn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-freight-amber focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Chinese Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 港风复古宽松牛仔裤"
                    value={newProd.titleCn}
                    onChange={(e) => setNewProd({ ...newProd, titleCn: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 font-medium bg-white"
                  >
                    <option value="apparel">Textiles & Apparel (পোশাক)</option>
                    <option value="electronics">Electronics & Audio (ইলেকট্রনিক্স)</option>
                    <option value="bags">Bags & Luggage (ব্যাগ)</option>
                    <option value="shoes">Shoes & Footwear (জুতো)</option>
                    <option value="industrial">Machinery & Hardware (টুলস)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Base Factory RMB Price (¥) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    min="1"
                    value={newProd.basePriceRmb}
                    onChange={(e) => setNewProd({ ...newProd, basePriceRmb: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-bold text-slate-900 font-mono"
                  />
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
                    className="w-full px-3 py-2 border rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProd.imageUrl}
                    onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-slate-900 font-mono text-[11px]"
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
                  className="bg-freight-amber hover:bg-freight-amberHover text-cargo-950 font-black px-5 py-2 rounded-xl transition shadow flex items-center gap-1.5 btn-tactile"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingProduct ? "Publishing..." : "Publish Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  ExternalLink, 
  Camera, 
  Scale, 
  Plane, 
  Ship, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Plus,
  RefreshCw,
  QrCode,
  ArrowRight
} from "lucide-react";
import { Order, OrderStatus } from "@/types";

export default function ChinaWarehousePortal() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PURCHASE" | "INBOUND" | "QC" | "DISPATCH">("PURCHASE");

  // Inbound Scanner State
  const [scannedTracking, setScannedTracking] = useState("");
  const [scannerResult, setScannerResult] = useState<Order | null>(null);

  // Selected Order for Modal / Action
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Purchase Form
  const [chinaOrderNum, setChinaOrderNum] = useState("");
  const [chinaCourier, setChinaCourier] = useState("顺丰速运 (SF Express)");
  const [chinaTrackingNum, setChinaTrackingNum] = useState("");

  // QC Form
  const [qcWeightKg, setQcWeightKg] = useState("1.25");
  const [qcNotes, setQcNotes] = useState("Quantity and color verified. No physical damage.");
  const [samplePhotos, setSamplePhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
  ]);

  // Dispatch Form
  const [flightOrVessel, setFlightOrVessel] = useState("CZ-392 (CAN-DAC Air Cargo)");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by tab lifecycle
  const pendingPurchaseOrders = orders.filter((o) => o.status === "STAGE1_PAID" || o.status === "PURCHASING_IN_CHINA");
  const receivedOrders = orders.filter((o) => o.status === "CHINA_WAREHOUSE_RECEIVED");
  const qcDoneOrders = orders.filter((o) => o.status === "QC_VERIFIED");

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus, trackingUpdates: any = {}) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          tracking: trackingUpdates
        })
      });
      if (res.ok) {
        setSelectedOrder(null);
        fetchOrders();
        alert(`Order ${orderId} updated to ${nextStatus}!`);
      }
    } catch (e) {
      alert("Error updating order");
    }
  };

  const handleScanSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scannedTracking.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.tracking.chinaTrackingNumber?.toLowerCase().includes(query) ||
        o.orderNumber.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
    );
    if (found) {
      setScannerResult(found);
    } else {
      alert("No package found matching tracking number: " + scannedTracking);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-md uppercase">
              China Operations Desk
            </span>
            <span className="text-xs text-slate-400">Guangzhou Hub (广州白云仓)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">
            1688 / Taobao Procurement & QC Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Fulfill orders from Bangladesh customers, check-in incoming SF Express/ZTO courier parcels, take photo quality checks, and consolidate air/sea export shipments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("PURCHASE")}
          className={`pb-3 px-2 flex items-center gap-2 transition ${
            activeTab === "PURCHASE"
              ? "border-b-2 border-rose-600 text-rose-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>1. 1688 Purchasing Desk ({pendingPurchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("INBOUND")}
          className={`pb-3 px-2 flex items-center gap-2 transition ${
            activeTab === "INBOUND"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>2. Package Inbound Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab("QC")}
          className={`pb-3 px-2 flex items-center gap-2 transition ${
            activeTab === "QC"
              ? "border-b-2 border-emerald-600 text-emerald-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>3. QC Photo & Scale Desk ({receivedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("DISPATCH")}
          className={`pb-3 px-2 flex items-center gap-2 transition ${
            activeTab === "DISPATCH"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>4. Dispatch to Bangladesh ({qcDoneOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: 1688 Purchasing Desk */}
      {activeTab === "PURCHASE" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">
              Orders Awaiting Purchase on 1688 / Taobao
            </h3>
            <span className="text-xs text-slate-500">
              Showing orders with Stage 1 advance payment confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingPurchaseOrders.length === 0 ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-slate-400 text-xs">
                No orders pending purchase at this moment.
              </div>
            ) : (
              pendingPurchaseOrders.map((order) => {
                const item = order.items[0];
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                        <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          100% Paid (৳{order.pricing.advanceAmountBdt})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Customer: <b>{order.customer.name}</b> ({order.customer.district})
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <img
                          src={item?.productImage}
                          alt="Item"
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{item?.productTitle}</h4>
                          <div className="text-xs text-rose-600 font-semibold mt-0.5">
                            Chinese SKU: {item?.skuNameCn || item?.skuName || "Standard"}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Quantity: <b>{item?.quantity} pcs</b> | 1688 Cost: <b>¥{item?.unitPriceRmb} RMB</b> (Total: ¥{(item?.unitPriceRmb || 0) * (item?.quantity || 1)})
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <a
                          href={`https://detail.1688.com/offer/${item?.sourceOfferId}.html`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                        >
                          <span>Open 1688</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setChinaOrderNum(order.items[0]?.chinaOrderNumber || "");
                            setChinaTrackingNum(order.tracking.chinaTrackingNumber || "");
                          }}
                          className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow"
                        >
                          Mark Purchased on 1688
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Inbound Package Scanner */}
      {activeTab === "INBOUND" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">China Warehouse Package Check-in</h3>
            <p className="text-xs text-slate-500">
              Scan barcode from incoming SF Express (顺丰), ZTO (中通), or YTO (圆通) courier package
            </p>
          </div>

          <form onSubmit={handleScanSearch} className="flex gap-2">
            <input
              type="text"
              value={scannedTracking}
              onChange={(e) => setScannedTracking(e.target.value)}
              placeholder="Scan or enter China tracking # (e.g. SF14829104819)"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition"
            >
              Scan & Find
            </button>
          </form>

          {/* Quick Scanner Helper */}
          <div className="text-center text-xs text-slate-400">
            <span>Or try quick test: </span>
            <button
              type="button"
              onClick={() => {
                setScannedTracking("SF14829104819");
                const found = orders.find((o) => o.tracking.chinaTrackingNumber === "SF14829104819");
                if (found) setScannerResult(found);
              }}
              className="text-sky-600 underline font-mono"
            >
              SF14829104819
            </button>
          </div>

          {scannerResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-sm text-slate-900">{scannerResult.orderNumber}</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Matched Order
                </span>
              </div>

              <div className="text-xs space-y-1 text-slate-600">
                <div>Item: <b>{scannerResult.items[0]?.productTitle}</b></div>
                <div>Quantity: <b>{scannerResult.items[0]?.quantity} pcs</b></div>
                <div>Customer: <b>{scannerResult.customer.name}</b> ({scannerResult.customer.district})</div>
              </div>

              <button
                onClick={() => handleUpdateStatus(scannerResult.id, "CHINA_WAREHOUSE_RECEIVED", {
                  chinaReceivedAt: new Date().toISOString()
                })}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
              >
                Confirm Inbound Arrival at Guangzhou Hub
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QC Photo & Weight Desk */}
      {activeTab === "QC" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">
              Packages Checked-in at Guangzhou (Awaiting QC Photos & Scale Weight)
            </h3>
            <span className="text-xs text-slate-500">
              Photos uploaded here are immediately viewable by the customer
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {receivedOrders.length === 0 ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-slate-400 text-xs">
                No packages currently awaiting QC inspection. Scan a package in Tab 2 to check it in!
              </div>
            ) : (
              receivedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                    <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                      In Guangzhou Warehouse
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400">Product:</span>
                      <p className="font-semibold text-slate-800">{order.items[0]?.productTitle}</p>
                      <p className="text-rose-600 font-medium">SKU: {order.items[0]?.skuNameCn || "Standard"}</p>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Perform QC & Upload Inspection Photos</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Dispatch to Bangladesh */}
      {activeTab === "DISPATCH" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-800">
              QC Verified Packages (Ready for Export Consolidation)
            </h3>
            <span className="text-xs text-slate-500">
              Consolidate packages into Air Cargo Flight or Sea Container
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {qcDoneOrders.length === 0 ? (
              <div className="bg-white border rounded-2xl p-10 text-center text-slate-400 text-xs">
                No orders ready for dispatch yet.
              </div>
            ) : (
              qcDoneOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="font-black text-sm text-slate-900">{order.orderNumber}</span>
                      <span className="ml-2 text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        QC Verified ({order.tracking.weightGrossKg} kg)
                      </span>
                    </div>
                    <span className="text-xs font-bold text-sky-600">
                      Method: {order.shippingMethod === "AIR" ? "Air Freight" : "Sea Freight"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-xs text-slate-600">
                      Destination: <b>{order.customer.name}</b>, {order.customer.fullAddress}
                    </div>

                    <button
                      onClick={() => handleUpdateStatus(order.id, "DISPATCHED_TO_BD", {
                        airFlightOrVesselNumber: flightOrVessel,
                        shippedFromChinaAt: new Date().toISOString()
                      })}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2"
                    >
                      <Plane className="w-4 h-4" />
                      <span>Dispatch to BD ({flightOrVessel})</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Mark Purchased on 1688 */}
      {selectedOrder && activeTab === "PURCHASE" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3">
              Record 1688 Purchase for #{selectedOrder.orderNumber}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600 mb-1 block">1688 Buyer Order ID</label>
                <input
                  type="text"
                  value={chinaOrderNum}
                  onChange={(e) => setChinaOrderNum(e.target.value)}
                  placeholder="e.g. 1688-ORD-83920194819"
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 mb-1 block">China Domestic Courier</label>
                <select
                  value={chinaCourier}
                  onChange={(e) => setChinaCourier(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="顺丰速运 (SF Express)">顺丰速运 (SF Express)</option>
                  <option value="中通快递 (ZTO Express)">中通快递 (ZTO Express)</option>
                  <option value="圆通速递 (YTO Express)">圆通速递 (YTO Express)</option>
                  <option value="申通快递 (STO Express)">申通快递 (STO Express)</option>
                  <option value="极兔速递 (J&T Express)">极兔速递 (J&T Express)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-600 mb-1 block">China Domestic Tracking #</label>
                <input
                  type="text"
                  value={chinaTrackingNum}
                  onChange={(e) => setChinaTrackingNum(e.target.value)}
                  placeholder="e.g. SF14829104819"
                  className="w-full px-3.5 py-2.5 border rounded-xl font-mono text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, "PURCHASING_IN_CHINA", {
                  chinaDomesticCourier: chinaCourier,
                  chinaTrackingNumber: chinaTrackingNum
                })}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: QC Photo & Scale Weighing Desk */}
      {selectedOrder && activeTab === "QC" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 border-b pb-3 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>QC Inspection & Digital Scale for #{selectedOrder.orderNumber}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Gross Weight on Scale (kg)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.05"
                    value={qcWeightKg}
                    onChange={(e) => setQcWeightKg(e.target.value)}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-bold text-sm text-emerald-700"
                  />
                  <span className="font-bold text-slate-500">KG</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">QC Inspection Photos (Viewable by Customer)</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {samplePhotos.map((p, i) => (
                    <img key={i} src={p} alt="QC" className="w-full h-24 object-cover rounded-xl border" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSamplePhotos([...samplePhotos, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"])}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition"
                  >
                    + Add Scale Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setSamplePhotos([...samplePhotos, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"])}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-xs transition"
                  >
                    + Add Detail Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Inspector Notes for Customer</label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, "QC_VERIFIED", {
                  qcPhotos: samplePhotos,
                  qcNotes: qcNotes,
                  weightGrossKg: parseFloat(qcWeightKg) || 1.25
                })}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow"
              >
                Approve QC & Notify Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

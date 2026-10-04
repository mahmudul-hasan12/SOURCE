import React from "react";
import Link from "next/link";
import { Plane, Ship, ShieldCheck, Headphones, MapPin, Phone, Mail, Award, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-cargo-950 text-slate-300 mt-20 border-t border-cargo-800">
      {/* Feature Value Props Corridor */}
      <div className="border-b border-cargo-800/80 bg-cargo-900/50">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cargo-800 border border-cargo-700 rounded-xl text-transit-air flex-shrink-0">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Air Cargo 10–18 Days</h4>
              <p className="text-xs text-slate-400 mt-0.5">Scheduled flights directly from Guangzhou Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-cargo-800 border border-cargo-700 rounded-xl text-indigo-400 flex-shrink-0">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Sea Freight 30–45 Days</h4>
              <p className="text-xs text-slate-400 mt-0.5">Wholesale rates for containers & heavy goods</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-cargo-800 border border-cargo-700 rounded-xl text-qc-emerald flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Guangzhou QC Guarantee</h4>
              <p className="text-xs text-slate-400 mt-0.5">Weighing & photo inspection before departure</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-cargo-800 border border-cargo-700 rounded-xl text-freight-amber flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">50% Advance Protocol</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay 50% to initiate, balance upon BD arrival</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Dual Hubs */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-cargo-900 border border-cargo-700 text-freight-amber font-black text-base w-8 h-8 rounded-lg flex items-center justify-center">
              SB
            </div>
            <span className="font-black text-base text-white tracking-tight">SkySourcing BD</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Your cross-border factory wholesale partner linking Bangladeshi merchants directly to verified manufacturing facilities in China with end-to-end logistics.
          </p>
          <div className="space-y-1.5 text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-freight-amber flex-shrink-0" />
              <span><strong>China Hub:</strong> Baiyun District, Guangzhou</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-transit-air flex-shrink-0" />
              <span><strong>Dhaka Hub:</strong> Sector 3, Uttara, Dhaka-1230</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/" className="hover:text-freight-amber transition">Factory Showcase</Link></li>
            <li><Link href="/warehouse" className="hover:text-freight-amber transition">China Operations Desk</Link></li>
            <li><Link href="/admin" className="hover:text-freight-amber transition">Tariff & Rate Controller</Link></li>
            <li><Link href="/orders/ord-8910/track" className="hover:text-freight-amber transition">Track Consignment</Link></li>
            <li><Link href="/cart" className="hover:text-freight-amber transition">Procurement Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Sourcing Services</h4>
          <ul className="space-y-2 text-slate-400">
            <li><span className="hover:text-freight-amber cursor-default">Direct Factory Sourcing</span></li>
            <li><span className="hover:text-freight-amber cursor-default">OEM / Custom Branding</span></li>
            <li><span className="hover:text-freight-amber cursor-default">Guangzhou Digital Scale QC</span></li>
            <li><span className="hover:text-freight-amber cursor-default">Customs Clearance & Tax Paid</span></li>
            <li><span className="hover:text-freight-amber cursor-default">Steadfast / Pathao Delivery</span></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Supported Payment Gateways</h4>
          <p className="text-slate-400 mb-3">
            Secure two-stage settlements accepted across all major Bangladeshi channels:
          </p>
          <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
            <span className="bg-cargo-900 border border-cargo-700 text-pink-400 px-2 py-1 rounded">bKash</span>
            <span className="bg-cargo-900 border border-cargo-700 text-orange-400 px-2 py-1 rounded">Nagad</span>
            <span className="bg-cargo-900 border border-cargo-700 text-purple-400 px-2 py-1 rounded">Rocket</span>
            <span className="bg-cargo-900 border border-cargo-700 text-sky-400 px-2 py-1 rounded">Visa / Master</span>
            <span className="bg-cargo-900 border border-cargo-700 text-emerald-400 px-2 py-1 rounded">Bank Transfer</span>
          </div>
        </div>
      </div>

      <div className="border-t border-cargo-800 text-center py-4 text-xs text-slate-500 font-mono">
        © 2026 SkySourcing BD • Direct Factory Wholesale & Guangzhou-to-Dhaka Logistics Corridor.
      </div>
    </footer>
  );
}

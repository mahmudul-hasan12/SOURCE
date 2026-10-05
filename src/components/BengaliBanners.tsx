"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Plane, 
  Ship, 
  ShieldCheck, 
  Percent, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  MessageCircle,
  Package,
  Layers,
  Sparkles,
  Truck,
  Shirt,
  Headphones,
  Briefcase,
  Footprints,
  Wrench,
  Home
} from "lucide-react";

/**
 * Clean Logistics Status Card (Replaces heavy 3D globe)
 */
export function HeroLogisticsCard() {
  return (
    <div className="bg-cargo-900/90 border border-cargo-750 rounded-3xl p-5 sm:p-6 text-white shadow-2xl backdrop-blur-md space-y-4">
      {/* Live Hub Header */}
      <div className="flex items-center justify-between border-b border-cargo-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-qc-emerald animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-freight-amber">
            Guangzhou ➜ Dhaka Hub Live
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-cargo-950 px-2.5 py-1 rounded-md border border-cargo-800">
          RMB 1.00 = ৳19.60 BDT
        </span>
      </div>

      {/* Two Freight Options in Bengali & English */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
        {/* Air Express */}
        <div className="bg-cargo-950/80 border border-cargo-750/90 rounded-2xl p-4 space-y-1.5 hover:border-freight-amber/60 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-transit-air flex items-center gap-1.5 font-sans">
              <Plane className="w-4 h-4" />
              <span>এয়ার কার্গো (Air Cargo)</span>
            </span>
            <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded-full font-bold">
              ১০–১৮ দিন
            </span>
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            ৳৭৫০ <span className="text-xs text-slate-400 font-normal">/ কেজি</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            রেগুলার ফ্লাইট • কাস্টমস ডিউটি ও ট্যাক্স সম্পূর্ণ ক্লিয়ারড
          </p>
        </div>

        {/* Sea Freight */}
        <div className="bg-cargo-950/80 border border-cargo-750/90 rounded-2xl p-4 space-y-1.5 hover:border-indigo-400/60 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-sans">
              <Ship className="w-4 h-4" />
              <span>সি ফ্রেইট (Sea Cargo)</span>
            </span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
              ৩০–৪৫ দিন
            </span>
          </div>
          <div className="text-xl font-black text-white tabular-nums">
            ৳২২০ <span className="text-xs text-slate-400 font-normal">/ কেজি</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-tight">
            ভারী ও বাল্ক পণ্যের জন্য সাশ্রয়ী • চট্টগ্রাম বন্দর টু ডোর
          </p>
        </div>
      </div>

      {/* Guaranteed Commitments */}
      <div className="space-y-2 pt-1 border-t border-cargo-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-qc-emerald flex-shrink-0" />
          <span><strong>৫০% অগ্রিম পেমেন্ট:</strong> বাকি ৫০% টাকা বাংলাদেশে পণ্য আসার পর</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-qc-emerald flex-shrink-0" />
          <span><strong>গুয়াংজু ওয়্যারহাউস QC:</strong> বিমানে ওঠার আগেই ওজন ও আসল ছবি ভেরিফিকেশন</span>
        </div>
        <div className="flex items-center gap-2 text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-qc-emerald flex-shrink-0" />
          <span><strong>কোনো লুকানো চার্জ নেই:</strong> পণ্য হাতে পাওয়ার আগ পর্যন্ত সম্পূর্ণ ট্র্যাকিং</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 4 High-Impact Feature Banners in Bengali
 */
export function FeatureBannersBengali() {
  const features = [
    {
      titleBn: "সরাসরি ফ্যাক্টরি পাইকারি রেট",
      titleEn: "1688 Direct Factory Rates",
      descBn: "চীন কারখানার আসল এক্স-ফ্যাক্টরি রেটে পণ্য কিনুন। কোনো মধ্যস্বত্বভোগী বা হিডেন মার্জিন নেই।",
      icon: Layers,
      color: "text-freight-amber",
      bg: "bg-amber-500/10 border-amber-500/30"
    },
    {
      titleBn: "গুয়াংজু ওয়্যারহাউস কোয়ালিটি চেক",
      titleEn: "Pre-Shipment Guangzhou QC",
      descBn: "বাংলাদেশে শিপমেন্টের আগেই আমাদের নিজস্ব গুয়াংজু হাবে ওজন ও হাই-রেজ্যুলেশন ছবি ভেরিফাই করা হয়।",
      icon: ShieldCheck,
      color: "text-qc-emerald",
      bg: "bg-emerald-500/10 border-emerald-500/30"
    },
    {
      titleBn: "১০০% কাস্টমস ক্লিয়ারড ডেলিভারি",
      titleEn: "Zero-Hassle Customs Clearance",
      descBn: "কাস্টমস ট্যাক্স বা ভ্যাট নিয়ে আপনাকে ভাবতে হবে না। এয়ার ও সি ফ্রেইটে সম্পূর্ণ ক্লিয়ারড ডেলিভারি।",
      icon: Truck,
      color: "text-transit-air",
      bg: "bg-sky-500/10 border-sky-500/30"
    },
    {
      titleBn: "৫০% অগ্রিমে নিশ্চিন্ত অর্ডার",
      titleEn: "50% Advance Booking Escrow",
      descBn: "অর্ডার কনফার্ম করতে মাত্র ৫০% অগ্রিম দিন। বাকি ৫০% এবং ফ্রেইট ঢাকায় পণ্য পৌঁছালে পরিশোধযোগ্য।",
      icon: Percent,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs font-bold font-mono text-freight-amber uppercase tracking-wider bg-cargo-900 px-3 py-1 rounded-full border border-cargo-750 inline-block">
          কেন স্কাইসোর্সিং বিডি?
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-cargo-900 tracking-tight">
          চীন থেকে আমদানির সবচেয়ে সহজ ও বিশ্বস্ত মাধ্যম
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          বাংলাদেশের ব্যবসা ও পাইকারি উদ্যোক্তাদের জন্য ১৬৮৮ ও তাওবাও থেকে ঝামেলাহীন ডোর-টু-ডোর সার্ভিস
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-cargo transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feat.bg} ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-cargo-900 leading-snug">
                    {feat.titleBn}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {feat.titleEn}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.descBn}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * 4-Step Order Guide in Bengali
 */
export function HowItWorksBengali() {
  const steps = [
    {
      num: "০১",
      titleBn: "লিংক কপি ও পেস্ট করুন",
      titleEn: "Paste 1688 / Taobao Link",
      descBn: "১৬৮৮ বা তাওবাও অ্যাপ/ওয়েবসাইট থেকে যেকোনো পণ্যের লিংক কপি করে সার্চ বারে পেস্ট করুন।",
      badge: "স্বয়ংক্রিয় অনুবাদ"
    },
    {
      num: "০২",
      titleBn: "তাত্ক্ষণিক বিডিটি রেট দেখুন",
      titleEn: "Instant BDT & Freight Quote",
      descBn: "আমাদের সিস্টেম সরাসরি চীনা কারখানার আসল দাম, হোলসেল টায়ার ও ফ্রেইট রেট টাকায় হিসাব করে দেবে।",
      badge: "কোনো হিডেন ফি নেই"
    },
    {
      num: "০৩",
      titleBn: "৫০% অগ্রিমে কনফার্ম করুন",
      titleEn: "50% Advance Order Booking",
      descBn: "বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে ৫০% অগ্রিম দিয়ে অর্ডার লক করুন। পণ্য চীনে বুক হবে।",
      badge: "নিরাপদ পেমেন্ট"
    },
    {
      num: "০৪",
      titleBn: "ঢাকায় পণ্য হাতে বুঝে নিন",
      titleEn: "Doorstep Delivery in BD",
      descBn: "গুয়াংজু ওয়্যারহাউসে ওজন ও ছবি চেকের পর কাস্টমস ক্লিয়ার হয়ে পণ্য সরাসরি আপনার ঠিকানায় পৌঁছাবে।",
      badge: "ডোর-টু-ডোর ডেলিভারি"
    }
  ];

  return (
    <section className="bg-white border-y border-slate-200/80 py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold font-mono text-qc-emerald uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            সহজ ৪ ধাপের প্রসেস
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-cargo-900 tracking-tight">
            কীভাবে চীন থেকে পণ্য অর্ডার করবেন?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            কোনো জটিলতা ছাড়াই মাত্র কয়েকটি ক্লিকে ১৬৮৮ বা তাওবাও থেকে পণ্য আপনার কাছে পৌঁছাবে
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((st, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 relative group hover:border-cargo-700 hover:bg-white transition shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-freight-amber bg-cargo-950 px-2.5 py-1 rounded-lg">
                  ধাপ {st.num}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {st.badge}
                </span>
              </div>
              <h3 className="font-bold text-sm text-cargo-900">
                {st.titleBn}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {st.descBn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Category Sourcing Shortcuts in Bengali
 */
export function CategoryShortcutsBengali() {
  const categories = [
    {
      nameBn: "পোশাক ও ফেব্রিক",
      nameEn: "Garments & Textiles",
      query: "garments",
      icon: Shirt,
      examples: "হুডি, টি-শার্ট, ডেনিম, জ্যাকেট"
    },
    {
      nameBn: "ইলেকট্রনিক্স ও গ্যাজেট",
      nameEn: "Electronics & Audio",
      query: "electronics",
      icon: Headphones,
      examples: "ইয়ারবাড, চার্জার, স্মার্টওয়াচ"
    },
    {
      nameBn: "ব্যাগ ও লাগেজ",
      nameEn: "Bags & Backpacks",
      query: "bag",
      icon: Briefcase,
      examples: "ল্যাপটপ ব্যাগ, ট্রাভেল ব্যাগ"
    },
    {
      nameBn: "জুতো ও ফুটওয়্যার",
      nameEn: "Shoes & Footwear",
      query: "shoes",
      icon: Footprints,
      examples: "স্নিকার্স, লেদার শুজ, স্যান্ডেল"
    },
    {
      nameBn: "যন্ত্রপাতি ও হার্ডওয়্যার",
      nameEn: "Tools & Hardware",
      query: "industrial",
      icon: Wrench,
      examples: "অ্যালুমিনিয়াম প্রোফাইল, টুলস"
    },
    {
      nameBn: "হোম ও কিচেন",
      nameEn: "Home & Lifestyle",
      query: "home",
      icon: Home,
      examples: "ওয়াল প্যানেল, ডেকোরেশন"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-5 bg-freight-amber rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-cargo-900 tracking-tight">
              জনপ্রিয় সোর্সিং ক্যাটাগরি
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            চীনের সবচেয়ে জনপ্রিয় পাইকারি মার্কেট ও ফ্যাক্টরি হাব থেকে সরাসরি খুঁজুন
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-auto border border-slate-200">
          ১৬৮৮ ও তাওবাও ভেরিফাইড হাব
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <Link
              key={idx}
              href={`/search?q=${encodeURIComponent(cat.query)}`}
              className="bg-white border border-slate-200/90 hover:border-freight-amber hover:shadow-cargo rounded-2xl p-4 text-center transition group flex flex-col items-center justify-between space-y-2 btn-tactile"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-cargo-900 group-hover:bg-cargo-900 group-hover:text-freight-amber transition">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-cargo-900 group-hover:text-transit-air transition">
                  {cat.nameBn}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  {cat.nameEn}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 line-clamp-1">
                {cat.examples}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Interactive Collapsible FAQ in Bengali
 */
export function FaqAccordionBengali() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "কাস্টমস ট্যাক্স বা শুল্ক কি আমাকে আলাদাভাবে দিতে হবে?",
      a: "না! আমাদের নির্ধারিত ফ্রেইট চার্জের (এয়ার ৳৭৫০/কেজি, সি ৳২২০/কেজি) মধ্যেই সম্পূর্ণ কাস্টমস শুল্ক, ভ্যাট ও ক্লিয়ারেন্স অন্তর্ভুক্ত। পণ্য বাংলাদেশে পৌঁছার পর কোনো গোপন বা অতিরিক্ত কাস্টমস ফি নেই।"
    },
    {
      q: "সর্বনিম্ন কত টাকার বা কত পিস পণ্য অর্ডার করা যাবে?",
      a: "১৬৮৮ বা তাওবাও-এর প্রতিটি ফ্যাক্টরির নিজস্ব মিনিমাম অর্ডার কোয়ান্টিটি (MOQ) থাকে। সাধারণত বেশিরভাগ পণ্যের ক্ষেত্রে ২ পিস বা ৫ পিস থেকেই অর্ডার করা সম্ভব। লিংক পেস্ট করলে আপনি নিজেই সর্বনিম্ন কোয়ান্টিটি দেখতে পাবেন।"
    },
    {
      q: "৫০% অগ্রিম দেওয়ার পর বাকি টাকা কখন দিতে হবে?",
      a: "অর্ডার কনফার্ম করার সময় পণ্যের মূল্যের ৫০% অগ্রিম পরিশোধ করতে হবে। বাকি ৫০% টাকা এবং পণ্যের ওজনভিত্তিক আন্তর্জাতিক ফ্রেইট চার্জ পণ্যটি ঢাকায় আমাদের ওয়্যারহাউসে পৌঁছানোর পর ডেলিভারির সময় পরিশোধ করবেন।"
    },
    {
      q: "পণ্যের কোয়ালিটি বা সঠিক সাইজ/কালার কীভাবে নিশ্চিত করা হয়?",
      a: "চীন কারখানা থেকে পণ্য আমাদের গুয়াংজু ওয়্যারহাউসে আসার পর আমাদের টিম প্রতিটি বক্স আনপ্যাক করে ওজন যাচাই করে এবং ছবি তুলে সিস্টেমে আপলোড করে। কোনো ত্রুটি বা ভুল পণ্য আসলে বিমানে তোলার আগেই তা কারখানায় রিটার্ন বা রিপ্লেস করা হয়।"
    },
    {
      q: "পেমেন্ট কীভাবে করতে পারব?",
      a: "আপনি বিকাশ (bKash), নগদ (Nagad), অথবা সরাসরি আমাদের বাংলাদেশি ব্যাংক অ্যাকাউন্টের মাধ্যমে ঘরে বসেই ৫০% অগ্রিম ও ডেলিভারির সময় বাকি পেমেন্ট সম্পন্ন করতে পারবেন।"
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8 space-y-2">
        <span className="text-xs font-bold font-mono text-transit-air uppercase tracking-wider bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
          সাধারণ জিজ্ঞাসা
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-cargo-900 tracking-tight">
          সচরাচর জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          চীন থেকে আমদানি করার ক্ষেত্রে আপনার মনের যেকোনো প্রশ্নের দ্রুত সমাধান
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-cargo-900 hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-freight-amber flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-cargo-900" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Direct WhatsApp & Sourcing Assistance Banner
 */
export function WhatsAppSupportBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-gradient-to-r from-cargo-950 via-cargo-900 to-cargo-950 border border-cargo-750 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-freight-amber/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-xs px-3 py-1 rounded-full font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>সরাসরি সোর্সিং কনসালটেশন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            কোনো পণ্যের লিংক পাচ্ছেন না বা বিশেষ কোনো পণ্য খুঁজতে চান?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            পণ্যের ছবি বা স্পেসিফিকেশন আমাদের হোয়াটসঅ্যাপে পাঠান। আমাদের গুয়াংজু সোর্সিং টিম সরাসরি কারখানা খুঁজে আপনাকে সেরা রেট জানিয়ে দেবে।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 flex-shrink-0">
          <a
            href="https://wa.me/8801700000000?text=Hello%20SkySourcing%20BD,%20I%20want%20to%20source%20products%20from%20China"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg btn-tactile"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span>WhatsApp-এ মেসেজ দিন</span>
          </a>
          <Link
            href="/warehouse"
            className="w-full sm:w-auto bg-cargo-800 hover:bg-cargo-700 active:scale-95 text-white font-semibold px-5 py-3.5 rounded-2xl text-xs transition border border-cargo-600 flex items-center justify-center gap-1.5 btn-tactile"
          >
            <Package className="w-4 h-4 text-freight-amber" />
            <span>ওয়্যারহাউস সার্ভিস</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

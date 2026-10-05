import React from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Percent
} from "lucide-react";
import { 
  HeroLogisticsCard, 
  FeatureBannersBengali, 
  HowItWorksBengali, 
  CategoryShortcutsBengali, 
  FaqAccordionBengali, 
  WhatsAppSupportBanner 
} from "@/components/BengaliBanners";

export default function HomePage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* Streamlined Hero Section */}
      <section className="bg-cargo-950 text-white pt-8 pb-12 sm:pt-14 sm:pb-16 px-4 relative overflow-hidden border-b border-cargo-850">
        {/* Editorial Cargo Port Background Cover Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 sm:opacity-90 pointer-events-none transition-opacity duration-700"
          style={{ backgroundImage: "url('/hero-cover.jpg')" }}
        />
        {/* Directional contrast vignette: keeps left text crisp while letting illuminated cargo ships and port cranes shine through */}
        <div className="absolute inset-0 bg-gradient-to-r from-cargo-950/95 via-cargo-950/75 to-cargo-950/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-cargo-950/95 via-transparent to-cargo-950/60 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column (7 cols): Bengali Value Prop & Sourcing Omnibar */}
            <div className="lg:col-span-7 space-y-5 bg-cargo-950/60 p-4 sm:p-7 rounded-3xl backdrop-blur-md border border-cargo-750/40 shadow-2xl">
              {/* Corridor Status Strip in Bengali & English */}
              <div className="inline-flex items-center gap-2 bg-cargo-900/90 border border-cargo-700 px-3.5 py-1.5 rounded-full text-xs font-mono shadow-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-qc-emerald animate-pulse" />
                <span className="text-freight-amber font-semibold">গুয়াংজু ওয়্যারহাউস লাইভ</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">চীন থেকে সরাসরি পাইকারি আমদানি</span>
              </div>

              {/* High-Impact Bengali Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.18] text-white">
                চীন থেকে সরাসরি{" "}
                <span className="text-freight-amber underline decoration-freight-amber/35 decoration-4 underline-offset-4">
                  ফ্যাক্টরি রেটে
                </span>{" "}
                আমদানি করুন
              </h1>

              {/* Subtext in natural Bengali */}
              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                ১৬৮৮ (1688) বা তাওবাও (Taobao)-এর যেকোনো লিংক পেস্ট করুন — সাথে সাথে জানুন বাংলাদেশি টাকায় মোট মূল্য, এয়ার/সি ফ্রেইট ও ডেলিভারি সময়। কোনো লুকানো খরচ নেই।
              </p>

              {/* Universal Sourcing Omnibar */}
              <div className="bg-cargo-900/95 border border-cargo-700/90 rounded-2xl p-3 sm:p-4 shadow-cargo space-y-3">
                <form action="/search" method="GET" className="space-y-3">
                  <div className="flex items-center bg-cargo-950/90 border border-cargo-700 rounded-xl overflow-hidden focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 transition p-1.5">
                    <input
                      id="omnibar-input"
                      type="text"
                      name="url"
                      placeholder="এখানে ১৬৮৮ বা তাওবাও পণ্যের লিংক পেস্ট করুন (Paste 1688/Taobao link)..."
                      className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none min-h-[44px]"
                    />
                    <button
                      type="submit"
                      className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black px-5 py-2.5 rounded-lg text-xs sm:text-sm transition flex items-center gap-1.5 flex-shrink-0 shadow-xs btn-tactile min-h-[44px]"
                    >
                      <Search className="w-4 h-4 text-cargo-950" />
                      <span>যাচাই করুন</span>
                    </button>
                  </div>

                  {/* Sample Ready-to-Test Links */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
                    <span className="text-slate-500 font-mono text-[11px]">টেস্ট করার লিংক:</span>
                    <Link 
                      href="/search?url=https%3A%2F%2Fdetail.1688.com%2Foffer%2F895199300568.html" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
                    >
                      <span>কটন ওয়ার্কস্যুট</span>
                      <ArrowRight className="w-3 h-3 text-freight-amber/70" />
                    </Link>
                    <Link 
                      href="/search?url=https%3A%2F%2Fdetail.1688.com%2Foffer%2F888899990001.html" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
                    >
                      <span>ভিন্টেজ ডেনিম জিন্স</span>
                      <ArrowRight className="w-3 h-3 text-freight-amber/70" />
                    </Link>
                    <Link 
                      href="/search?url=https%3A%2F%2Fitem.taobao.com%2Fitem.htm%3Fid%3D777788889999" 
                      className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
                    >
                      <span>ANC ব্লুটুথ ইয়ারবাড</span>
                      <ArrowRight className="w-3 h-3 text-freight-amber/70" />
                    </Link>
                  </div>
                </form>

                {/* Trade Guarantees Strip */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-cargo-800/80 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-cargo-800 text-freight-amber rounded-lg flex-shrink-0 mt-0.5">
                      <Percent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">৫০% অগ্রিম পেমেন্ট</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">বাকি টাকা বাংলাদেশে পণ্য পৌঁছানোর পর।</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 bg-cargo-800 text-qc-emerald rounded-lg flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">গুয়াংজু স্কেল QC</span>
                      <span className="text-[11px] text-slate-400 leading-tight block">প্রাক-শিপমেন্ট ওজন ও আসল ছবি ভেরিফিকেশন।</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Live Logistics Status Card (Replaces 3D Globe) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <HeroLogisticsCard />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Guarantee Banners in Bengali */}
      <FeatureBannersBengali />

      {/* Category Sourcing Shortcuts in Bengali */}
      <CategoryShortcutsBengali />

      {/* 4-Step Order Guide in Bengali */}
      <HowItWorksBengali />

      {/* Direct WhatsApp Sourcing Support Banner */}
      <WhatsAppSupportBanner />

      {/* Interactive FAQ in Bengali */}
      <FaqAccordionBengali />
    </div>
  );
}

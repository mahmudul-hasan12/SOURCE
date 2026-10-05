import React from "react";
import { 
  HeroLogisticsCard, 
  FeatureBannersBengali, 
  HowItWorksBengali, 
  CategoryShortcutsBengali, 
  FaqAccordionBengali, 
  WhatsAppSupportBanner 
} from "@/components/BengaliBanners";
import { HeroOmnibarClient } from "@/components/HeroOmnibarClient";

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

              {/* Universal Sourcing Omnibar with Instant Quotation & WhatsApp RFQ */}
              <HeroOmnibarClient />
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

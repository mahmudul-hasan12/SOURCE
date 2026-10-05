"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  ClipboardPaste, 
  ArrowRight, 
  Percent, 
  ShieldCheck, 
  Sparkles,
  Layers
} from "lucide-react";
import { LinkQuotationModal } from "./LinkQuotationModal";

export function HeroOmnibarClient() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (val.includes("1688.com") || val.includes("taobao.com") || val.includes("tmall.com") || val.startsWith("http")) {
      setModalUrl(val);
      setIsModalOpen(true);
    } else {
      router.push(`/search?q=${encodeURIComponent(val)}`);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputValue(text.trim());
          if (text.includes("1688.com") || text.includes("taobao.com") || text.includes("tmall.com") || text.startsWith("http")) {
            setModalUrl(text.trim());
            setIsModalOpen(true);
          }
        }
      }
    } catch (err) {
      console.warn("Clipboard access not granted:", err);
    }
  };

  const handleOpenSample = (url: string) => {
    setModalUrl(url);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-cargo-900/95 border border-cargo-700/90 rounded-2xl p-3 sm:p-4 shadow-cargo space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center bg-cargo-950/90 border border-cargo-700 rounded-xl overflow-hidden focus-within:border-freight-amber focus-within:ring-2 focus-within:ring-freight-amber/20 transition p-1.5 gap-1.5">
            <input
              id="omnibar-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="এখানে ১৬৮৮ বা তাওবাও পণ্যের লিংক পেস্ট করুন (Paste 1688/Taobao link)..."
              className="flex-1 px-3 py-2.5 bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none min-h-[44px]"
            />
            
            {/* Quick Clipboard Paste Button */}
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="hidden sm:inline-flex items-center gap-1 bg-cargo-800 hover:bg-cargo-750 text-slate-300 hover:text-white px-2.5 py-2 rounded-lg text-xs font-mono border border-cargo-700 transition"
              title="ক্লিপবোর্ড থেকে লিংক পেস্ট করুন"
            >
              <ClipboardPaste className="w-3.5 h-3.5 text-freight-amber" />
              <span>পেস্ট</span>
            </button>

            {/* Submit / Verify Button */}
            <button
              type="submit"
              className="bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm transition flex items-center gap-1.5 flex-shrink-0 shadow-xs btn-tactile min-h-[44px]"
            >
              <Search className="w-4 h-4 text-cargo-950" />
              <span>যাচাই করুন</span>
            </button>
          </div>

          {/* Sample Ready-to-Test Links */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
            <span className="text-slate-500 font-mono text-[11px]">টেস্ট করার লিংক:</span>
            <button
              type="button"
              onClick={() => handleOpenSample("https://detail.1688.com/offer/895199300568.html")}
              className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
            >
              <span>কটন ওয়ার্কস্যুট</span>
              <ArrowRight className="w-3 h-3 text-freight-amber/70" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenSample("https://detail.1688.com/offer/888899990001.html")}
              className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
            >
              <span>ভিন্টেজ জিন্স</span>
              <ArrowRight className="w-3 h-3 text-freight-amber/70" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenSample("https://item.taobao.com/item.htm?id=777788889999")}
              className="bg-cargo-800/90 hover:bg-cargo-750 px-2 py-0.5 rounded text-freight-amber transition border border-cargo-700/80 font-mono text-[11px] flex items-center gap-1"
            >
              <span>ANC ইয়ারবাড</span>
              <ArrowRight className="w-3 h-3 text-freight-amber/70" />
            </button>
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

      {/* Dynamic Link Quotation & WhatsApp RFQ Modal */}
      {isModalOpen && modalUrl && (
        <LinkQuotationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialUrl={modalUrl}
        />
      )}
    </>
  );
}

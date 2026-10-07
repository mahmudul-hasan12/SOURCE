"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  PackageCheck,
  FileQuestion,
  Plane,
  Ship,
  Sparkles,
} from "lucide-react";

export default function RfqPage() {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("ঢাকা");
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceLink, setReferenceLink] = useState("");
  const [targetQuantity, setTargetQuantity] = useState("50");
  const [targetPriceBdt, setTargetPriceBdt] = useState("");
  const [preferredShipping, setPreferredShipping] = useState<"AIR" | "SEA">("AIR");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRfq, setSubmittedRfq] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle local image upload as data URL for quick preview & submission
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("ছবির সাইজ সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে হবে।");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !phone.trim() || !productTitle.trim()) {
      setErrorMsg("দয়া করে আপনার নাম, মোবাইল নম্বর এবং পণ্যের নাম পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          district,
          productTitle,
          description,
          referenceLink,
          targetQuantity: Number(targetQuantity) || 10,
          targetPriceBdt: targetPriceBdt ? Number(targetPriceBdt) : undefined,
          imageUrl: imageUrl || undefined,
          preferredShipping,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || "সাবমিট করতে সমস্যা হয়েছে।");
      }

      setSubmittedRfq(data.rfq);
    } catch (err: any) {
      setErrorMsg(err.message || "রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsAppConfirmation = () => {
    if (!submittedRfq) return;
    const msg = encodeURIComponent(
      `আসসালামু আলাইকুম! আমি SkySourcing BD-তে কাস্টম সোর্সিং রিকোয়েস্ট সাবমিট করেছি।\n\n` +
      `📋 RFQ ট্র্যাকিং আইডি: ${submittedRfq.id}\n` +
      `📦 পণ্য: ${submittedRfq.productTitle}\n` +
      `🔢 পরিমাণ: ${submittedRfq.targetQuantity} pcs\n` +
      `🚚 শিপিং: ${submittedRfq.preferredShipping === "AIR" ? "এয়ার কার্গো" : "সি ফ্রেইট"}\n` +
      `👤 কাস্টমার: ${submittedRfq.customerName} (${submittedRfq.phone})\n\n` +
      `দয়া করে আমাকে ফ্যাক্টরি রেট ও কোটেশন জানান। ধন্যবাদ!`
    );
    window.open(`https://wa.me/8801755123456?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 pb-24">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-cargo-900 border border-cargo-750 px-3.5 py-1.5 rounded-full text-xs font-mono text-freight-amber">
          <Sparkles className="w-3.5 h-3.5 text-freight-amber" />
          <span>কাস্টম ফ্যাক্টরি ফাইন্ডার (Custom Sourcing Desk)</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-cargo-900 tracking-tight leading-tight">
          পণ্য খুঁজে পাচ্ছেন না? ছবি ও বিবরণ দিন, আমরা কারখানা বের করে দেব!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          ফেসবুক, টিকটক, দারাজ বা যেকোনো জায়গায় দেখা পণ্যের ছবি আপলোড করুন। আমাদের গুয়াংজু সোর্সিং টিম সরাসরি আসল প্রস্তুতকারক ফ্যাক্টরি থেকে ভেরিফায়েড রেট কোটেশন পাঠাবে।
        </p>
      </div>

      {/* 3 Step Process Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-freight-amber flex items-center justify-center font-black font-mono flex-shrink-0">
            ১
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-cargo-900">ছবি ও বিবরণ দিন</h4>
            <p className="text-[11px] text-slate-500">পণ্যের ছবি বা লিংক ও কোয়ান্টিটি পাঠান</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-transit-air flex items-center justify-center font-black font-mono flex-shrink-0">
            ২
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-cargo-900">ফ্যাক্টরি কোটেশন পান</h4>
            <p className="text-[11px] text-slate-500">২৪ ঘণ্টার মধ্যে BDT রেট ও ফ্রেইট হিসাব</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-qc-emerald flex items-center justify-center font-black font-mono flex-shrink-0">
            ৩
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-cargo-900">অর্ডার ও ডোর ডেলিভারি</h4>
            <p className="text-[11px] text-slate-500">QC চেক ও কাস্টমস ক্লিয়ার হয়ে দরজায়</p>
          </div>
        </div>
      </div>

      {submittedRfq ? (
        /* Success Screen */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-cargo text-center max-w-xl mx-auto space-y-5 animate-scale-in">
          <div className="w-16 h-16 bg-emerald-100 text-qc-emerald rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-cargo-900">
              আপনার সোর্সিং রিকোয়েস্ট গৃহীত হয়েছে!
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              RFQ ট্র্যাকিং কোড: <strong className="text-cargo-950 font-bold">{submittedRfq.id}</strong>
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-700 text-left space-y-2 font-mono">
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-sans">পণ্য:</span>
              <span className="font-bold text-cargo-900 truncate max-w-[200px]">{submittedRfq.productTitle}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-sans">পরিমাণ:</span>
              <span className="font-bold">{submittedRfq.targetQuantity} pcs</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-sans">শিপিং:</span>
              <span className="font-bold">{submittedRfq.preferredShipping === "AIR" ? "এয়ার কার্গো" : "সি ফ্রেইট"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-sans">স্ট্যাটাস:</span>
              <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">অ্যাডমিন রিভিউতে আছে</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            আমাদের টিম ফ্যাক্টরির সাথে কথা বলে সর্বোচ্চ ২৪ ঘণ্টার মধ্যে আপনাকে যোগাযোগ করবে। দ্রুত রেট জানতে নিচের বাটনে ক্লিক করে সরাসরি হোয়াটসঅ্যাপে কথা বলুন:
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={openWhatsAppConfirmation}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-xs btn-tactile"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে দ্রুত কোটেশন নিন</span>
            </button>
            <button
              onClick={() => {
                setSubmittedRfq(null);
                setProductTitle("");
                setDescription("");
                setImagePreview(null);
                setImageUrl("");
              }}
              className="px-5 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
            >
              নতুন রিকোয়েস্ট পাঠান
            </button>
          </div>
        </div>
      ) : (
        /* Sourcing Request Form */
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Product Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cargo-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-freight-amber" />
              <span>১. কাঙ্ক্ষিত পণ্যের বিবরণ (Product Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  পণ্যের নাম বা মডেল (Product Name / Title) *
                </label>
                <input
                  type="text"
                  required
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="যেমন: Wireless RGB Gaming Headset, Oversized Hoodie, Leather Wallet..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  টার্গেট কোয়ান্টিটি (Target Quantity / Pcs) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  প্রত্যাশিত বাজেট প্রতি পিস (Target Unit Price BDT - Optional)
                </label>
                <input
                  type="number"
                  value={targetPriceBdt}
                  onChange={(e) => setTargetPriceBdt(e.target.value)}
                  placeholder="e.g. ৳350"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  রেফারেন্স লিংক (ফেসবুক / দারাজ / আলিবাবা লিংক থাকলে দিন - Optional)
                </label>
                <input
                  type="url"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  নির্দিষ্ট বিবরণ, সাইজ, কালার বা ম্যাটেরিয়াল (Detailed Notes)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: কালার ব্ল্যাক ও নেভি ব্লু লাগবে, কাস্টম লোগো প্রিন্ট করতে চাই..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>
            </div>

            {/* Photo Upload Box */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-xs mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setImageUrl("");
                    }}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 text-[10px] shadow hover:bg-rose-700"
                  >
                    ✕
                  </button>
                  <span className="text-[11px] text-emerald-600 block mt-1 font-semibold">ছবি সফলভাবে যুক্ত হয়েছে</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-amber-100 text-freight-amber rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <label className="cursor-pointer text-xs font-bold text-transit-air hover:underline">
                      <span>পণ্যের ছবি আপলোড করুন</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG বা WebP (সর্বোচ্চ 5MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Preferred Shipping Method */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-cargo-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Plane className="w-4 h-4 text-transit-air" />
              <span>২. শিপিং পদ্ধতি নির্বাচন করুন (Shipping Preference)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPreferredShipping("AIR")}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  preferredShipping === "AIR"
                    ? "border-sky-500 bg-sky-50/70 ring-2 ring-sky-300 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-transit-air shadow-xs mt-0.5">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-cargo-900 flex items-center gap-2">
                    <span>এয়ার কার্গো (Air Cargo)</span>
                    <span className="text-[10px] bg-sky-100 text-transit-air px-2 py-0.5 rounded font-mono font-bold">১০–১৮ দিন</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">দ্রুত ডেলিভারি ও মাঝারি ভলিউম পণ্যের জন্য উপযুক্ত (৳৭৫০/কেজি)</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredShipping("SEA")}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  preferredShipping === "SEA"
                    ? "border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-300 shadow-xs"
                    : "border-slate-200 bg-slate-50/40 hover:border-slate-300"
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-500 shadow-xs mt-0.5">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-cargo-900 flex items-center gap-2">
                    <span>সি ফ্রেইট (Sea Freight)</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-mono font-bold">৩০–৪৫ দিন</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">ভারী, বাল্ক বা কন্টেইনার পণ্যের জন্য সবচেয়ে সাশ্রয়ী (৳২২০/কেজি)</p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-cargo-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>৩. আপনার যোগাযোগের তথ্য (Contact Details)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  আপনার পূর্ণ নাম (Your Name) *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  মোবাইল / হোয়াটসঅ্যাপ নম্বর *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  জেলা / শহর (District)
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="যেমন: ঢাকা, চট্টগ্রাম, সিলেট..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-freight-amber focus:border-freight-amber focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-qc-emerald flex-shrink-0" />
              <span>১০০% নিরাপদ • কোনো অগ্রিম পরামর্শ ফি নেই</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 px-8 rounded-2xl text-xs sm:text-sm transition shadow-cargo flex items-center justify-center gap-2 btn-tactile disabled:opacity-60"
            >
              <span>{isSubmitting ? "রিকোয়েস্ট পাঠানো হচ্ছে..." : "সোর্সিং রিকোয়েস্ট সাবমিট করুন"}</span>
              <ArrowRight className="w-4 h-4 text-cargo-950" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

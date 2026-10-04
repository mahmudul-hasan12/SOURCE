"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, AlertCircle, ShieldCheck } from "lucide-react";
import { getClientProducts, getClientProductById } from "@/lib/seed-data";
import { Product } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryUrl = searchParams.get("url") || "";
  const queryText = searchParams.get("q") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [importedProduct, setImportedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsLoading(true);

    if (queryUrl) {
      // URL paste resolver: extract offer identifier without exposing provider names
      const matchOffer = queryUrl.match(/offer\/(\d+)\.html/) || queryUrl.match(/offerId=(\d+)/) || queryUrl.match(/id=(\d+)/);
      const offerId = matchOffer ? matchOffer[1] : `${Date.now()}`;

      // Check if product already exists in memory
      const existing = getClientProductById(offerId);
      if (existing) {
        router.push(`/product/${existing.id}`);
        return;
      }

      // Auto-import / parse simulated factory listing
      const newImport: Product = {
        id: `prod-${offerId}`,
        sourcePlatform: "FACTORY_DIRECT",
        sourceOfferId: offerId,
        url: queryUrl,
        titleCn: "工厂直供商品 (自动化实时解析)",
        titleEn: `Direct Factory Wholesale Item #${offerId}`,
        titleBn: `আমদানিকৃত পাইকারি পণ্য #${offerId}`,
        description: "Direct procurement listing from verified manufacturer wholesale suppliers in China.",
        images: [
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"
        ],
        priceTiers: [
          { range: "2–9 pcs", minQty: 2, priceRmb: 45.0 },
          { range: "10–49 pcs", minQty: 10, priceRmb: 39.0 },
          { range: "50+ pcs", minQty: 50, priceRmb: 34.0 }
        ],
        basePriceRmb: 45.0,
        skus: [
          { id: "sku-auto-1", name: "Standard Model", nameCn: "标准版", priceRmb: 45.0, stock: 5000 },
          { id: "sku-auto-2", name: "Pro Upgrade", nameCn: "升级版", priceRmb: 52.0, stock: 3200 }
        ],
        category: "electronics",
        shopName: "Guangdong Verified Manufacturing Plant",
        location: "Guangdong, China",
        estimatedWeightKg: 0.4,
        minOrderQty: 2
      };

      setImportedProduct(newImport);
      setIsLoading(false);
    } else if (queryText) {
      // Keyword search
      const all = getClientProducts();
      const filtered = all.filter(
        (p) =>
          p.titleEn.toLowerCase().includes(queryText.toLowerCase()) ||
          p.category.toLowerCase().includes(queryText.toLowerCase()) ||
          p.shopName.toLowerCase().includes(queryText.toLowerCase())
      );
      setResults(filtered.length > 0 ? filtered : all);
      setIsLoading(false);
    } else {
      setResults(getClientProducts());
      setIsLoading(false);
    }
  }, [queryUrl, queryText, router]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3 font-mono">
        <div className="w-10 h-10 border-4 border-cargo-900 border-t-freight-amber rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-600">Resolving factory catalog data...</p>
      </div>
    );
  }

  if (importedProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-14 text-center space-y-6">
        <div className="w-16 h-16 bg-cargo-900 text-freight-amber rounded-3xl flex items-center justify-center mx-auto shadow-cargo">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs bg-emerald-100 text-qc-emeraldDark font-mono font-bold px-3 py-1 rounded-full">
            Verified Factory Listing Resolved
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-cargo-900 mt-3 tracking-tight">
            {importedProduct.titleEn}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Lot Reference: #{importedProduct.sourceOfferId}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-md mx-auto flex gap-4 items-center text-left">
          <img
            src={importedProduct.images[0]}
            alt="Product"
            className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
          />
          <div>
            <div className="text-xs font-bold text-slate-500 font-mono">
              Factory Wholesale Tier:
            </div>
            <div className="text-lg font-black text-cargo-900 font-mono mt-0.5 tabular-nums">
              ৳{Math.round(importedProduct.priceTiers[2]?.priceRmb * 17.5 * 1.12).toLocaleString()} BDT
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Supplier: {importedProduct.shopName}
            </div>
          </div>
        </div>

        <Link
          href={`/product/${importedProduct.id}`}
          className="inline-flex items-center gap-2 bg-freight-amber hover:bg-freight-amberHover active:scale-[0.98] text-cargo-950 font-black py-4 px-8 rounded-xl text-sm transition shadow-amber-glow"
        >
          <span>View Tier Pricing & Select Quantity</span>
          <ArrowRight className="w-4 h-4 text-cargo-950" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-cargo-900 tracking-tight">
          Factory Sourcing Results {queryText && `for "${queryText}"`}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 font-mono">
          Showing {results.length} verified manufacturer listings with tiered pricing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-cargo transition flex flex-col justify-between group">
            <div className="aspect-square bg-slate-100 overflow-hidden relative">
              <img 
                src={product.images[0]} 
                alt={product.titleEn} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
              />
              <span className="absolute top-2 left-2 bg-cargo-950 text-freight-amber font-mono font-bold text-[10px] px-2 py-0.5 rounded shadow-xs">
                Direct Factory
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-xs text-cargo-900 line-clamp-2 leading-snug">{product.titleEn}</h3>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-cargo-900 font-black text-sm tabular-nums">
                  ৳{Math.round(product.basePriceRmb * 17.5 * 1.12).toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400">¥{product.basePriceRmb} RMB</span>
              </div>
              <Link
                href={`/product/${product.id}`}
                className="w-full bg-cargo-900 hover:bg-cargo-800 active:scale-[0.98] text-white text-xs font-bold py-2.5 rounded-xl text-center block transition shadow-xs"
              >
                Inspect Wholesale Tiers
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-mono text-slate-400">Searching factory catalog...</div>}>
      <SearchContent />
    </Suspense>
  );
}

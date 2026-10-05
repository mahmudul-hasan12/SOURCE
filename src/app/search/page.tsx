"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, CheckCircle2, PackageCheck } from "lucide-react";
import { getClientProducts } from "@/lib/seed-data";
import { Product } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryUrl = searchParams.get("url") || "";
  const queryText = searchParams.get("q") || "";

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [resolvedProduct, setResolvedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    async function loadSearchData() {
      try {
        if (queryUrl) {
          // Dynamic URL Resolver: query backend API to match catalog or resolve 1688 listing
          const res = await fetch(`/api/products/resolve?url=${encodeURIComponent(queryUrl)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.product) {
              if (!isMounted) return;
              setResolvedProduct(data.product);
              // If already matched in catalog, seamlessly redirect directly to the Product Detail Page
              if (data.redirectUrl) {
                router.replace(data.redirectUrl);
                return;
              }
            }
          }
        } else {
          // Fetch full database catalog for search / browse
          const res = await fetch("/api/products");
          let catalog: Product[] = [];
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
              catalog = data.products;
            }
          }
          if (catalog.length === 0) {
            catalog = getClientProducts();
          }

          if (queryText) {
            const q = queryText.toLowerCase().trim();
            const filtered = catalog.filter(
              (p) =>
                (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
                (p.titleCn && p.titleCn.includes(queryText)) ||
                (p.category && p.category.toLowerCase().includes(q)) ||
                (p.shopName && p.shopName.toLowerCase().includes(q)) ||
                (p.sourceOfferId && p.sourceOfferId.includes(q)) ||
                (p.id && p.id.toLowerCase().includes(q))
            );
            if (isMounted) setResults(filtered.length > 0 ? filtered : catalog);
          } else {
            if (isMounted) setResults(catalog);
          }
        }
      } catch (err) {
        console.error("Search resolver error:", err);
        if (isMounted) setResults(getClientProducts());
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSearchData();

    return () => {
      isMounted = false;
    };
  }, [queryUrl, queryText, router]);

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3 font-mono">
        <div className="w-10 h-10 border-4 border-cargo-900 border-t-freight-amber rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-600">Resolving verified factory catalog listing...</p>
      </div>
    );
  }

  if (resolvedProduct) {
    const tierPrice = resolvedProduct.priceTiers && resolvedProduct.priceTiers.length > 0
      ? resolvedProduct.priceTiers[0].priceRmb
      : resolvedProduct.basePriceRmb;
    const bdtPrice = Math.round(tierPrice * 17.5 * 1.12);

    return (
      <div className="max-w-3xl mx-auto px-4 py-14 text-center space-y-6">
        <div className="w-16 h-16 bg-cargo-900 text-freight-amber rounded-3xl flex items-center justify-center mx-auto shadow-cargo">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-qc-emeraldDark border border-emerald-200/60 font-mono font-bold px-3 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-qc-emerald" />
            Verified Factory Listing Resolved
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-cargo-900 mt-3 tracking-tight">
            {resolvedProduct.titleEn}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Lot Reference: #{resolvedProduct.sourceOfferId}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs max-w-md mx-auto flex gap-4 items-center text-left">
          {resolvedProduct.images && resolvedProduct.images[0] ? (
            <img
              src={resolvedProduct.images[0]}
              alt={resolvedProduct.titleEn}
              className="w-20 h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
              <PackageCheck className="w-8 h-8" />
            </div>
          )}
          <div>
            <div className="text-xs font-bold text-slate-500 font-mono">
              Factory Wholesale Tier:
            </div>
            <div className="text-lg font-black text-cargo-900 font-mono mt-0.5 tabular-nums">
              ৳{bdtPrice.toLocaleString()} BDT
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Supplier: {resolvedProduct.shopName || "Guangdong Verified Factory"}
            </div>
          </div>
        </div>

        <Link
          href={`/product/${resolvedProduct.id}`}
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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {results.map((product) => (
          <div key={product.id} className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-cargo transition flex flex-col justify-between group">
            <Link 
              href={`/product/${product.id}`}
              className="aspect-square bg-slate-100 overflow-hidden relative block cursor-pointer"
            >
              {product.images && product.images[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.titleEn} 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('fallback-product.jpg')) {
                      target.src = '/products/fallback-product.jpg';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <PackageCheck className="w-12 h-12" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-cargo-950 text-freight-amber font-mono font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs">
                Direct Factory
              </span>
            </Link>
            <div className="p-2.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="font-bold text-xs sm:text-sm text-cargo-900 line-clamp-2 leading-tight sm:leading-snug hover:text-transit-air transition cursor-pointer">
                  {product.titleEn}
                </h3>
              </Link>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-cargo-900 font-black text-xs sm:text-sm tabular-nums">
                    ৳{Math.round(product.basePriceRmb * 19.6).toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">¥{product.basePriceRmb}</span>
                </div>
                <Link
                  href={`/product/${product.id}`}
                  className="w-full bg-cargo-900 hover:bg-cargo-800 active:scale-[0.98] text-white text-[11px] sm:text-xs font-bold py-2 sm:py-2.5 rounded-xl text-center block transition shadow-xs btn-tactile min-h-[38px] sm:min-h-[42px] flex items-center justify-center"
                >
                  Inspect Tiers
                </Link>
              </div>
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

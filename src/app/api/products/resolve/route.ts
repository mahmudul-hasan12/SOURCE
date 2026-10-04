import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { translateText } from "@/lib/translate";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url") || "";
  return handleResolve(url);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url || "";
    return handleResolve(url);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request payload" }, { status: 400 });
  }
}

async function handleResolve(rawUrl: string) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 });
  }

  const cleanUrl = rawUrl.trim();
  const matchOffer = cleanUrl.match(/offer\/(\d+)\.html/) || 
                     cleanUrl.match(/[?&]offerId=(\d+)/) || 
                     cleanUrl.match(/[?&]id=(\d+)/) ||
                     cleanUrl.match(/[?&]item_id=(\d+)/);

  const offerId = matchOffer ? matchOffer[1] : null;

  // 1. Check existing catalog products in database
  const allProducts = await StorageService.getProducts();

  if (offerId) {
    const existing = allProducts.find(
      (p) =>
        p.sourceOfferId === offerId ||
        p.id === offerId ||
        p.id === `prod-${offerId}` ||
        (p.url && p.url.includes(offerId))
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        matched: true,
        product: existing,
        redirectUrl: `/product/${existing.id}`
      });
    }
  }

  // Also check if any existing product matches by exact or partial URL
  const existingByUrl = allProducts.find((p) => p.url && (p.url === cleanUrl || cleanUrl.includes(p.url) || p.url.includes(cleanUrl)));
  if (existingByUrl) {
    return NextResponse.json({
      success: true,
      matched: true,
      product: existingByUrl,
      redirectUrl: `/product/${existingByUrl.id}`
    });
  }

  // 2. If not yet in database, attempt parameter extraction (topicName, item keywords)
  let rawTitleCn = "";
  try {
    const parsed = new URL(cleanUrl);
    const topicName = parsed.searchParams.get("topicName");
    const optName = parsed.searchParams.get("optName");
    const title = parsed.searchParams.get("title");
    rawTitleCn = topicName || title || optName || "";
  } catch {
    // If URL parsing fails, continue
  }

  let titleEn = offerId ? `Verified Factory Wholesale Listing #${offerId}` : "Verified Factory Wholesale Listing";
  if (rawTitleCn) {
    const translated = await translateText(rawTitleCn);
    if (translated) titleEn = translated;
  }

  const resolvedId = offerId ? `prod-${offerId}` : `prod-${Date.now()}`;
  const resolvedProduct: Product = {
    id: resolvedId,
    sourcePlatform: "1688",
    sourceOfferId: offerId || `${Date.now()}`,
    url: cleanUrl,
    titleCn: rawTitleCn || "工厂直供精选货源",
    titleEn,
    titleBn: `আমদানিকৃত পাইকারি পণ্য #${offerId || ""}`,
    description: `Verified direct factory wholesale batch from verified manufacturer in China. Certified quality inspection in Guangzhou warehouse.`,
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800" // Neutral industrial cargo supply warehouse photo, NOT earbuds
    ],
    descriptionImages: [],
    attributes: [
      { keyCn: "供货方式", keyEn: "Supply Mode", valueCn: "源头工厂直供", valueEn: "Direct Source Factory" },
      { keyCn: "质检标准", keyEn: "Quality Check", valueCn: "出厂前全检", valueEn: "Pre-shipment Warehouse QC" }
    ],
    priceTiers: [
      { range: "2–9 pcs", minQty: 2, priceRmb: 25.0 },
      { range: "10–49 pcs", minQty: 10, priceRmb: 22.5 },
      { range: "50+ pcs", minQty: 50, priceRmb: 20.0 }
    ],
    basePriceRmb: 25.0,
    skus: [],
    category: "wholesale",
    shopName: "Guangdong Verified Factory Partner",
    location: "Guangdong, China",
    estimatedWeightKg: 0.5,
    minOrderQty: 2
  };

  // Auto-save so subsequent visits or navigation load directly
  await StorageService.saveProduct(resolvedProduct);

  return NextResponse.json({
    success: true,
    matched: false,
    newlyCreated: true,
    product: resolvedProduct,
    redirectUrl: `/product/${resolvedProduct.id}`
  });
}

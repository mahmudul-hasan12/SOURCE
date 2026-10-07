import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { Product, PriceTier, ProductAttribute } from "@/types";
import { translateText, translateProductAttributes, hasChineseCharacters } from "@/lib/translate";

export const dynamic = "force-dynamic";

function sanitizeProductImageUrl(url: any): string {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim();
  if (clean.startsWith("//")) clean = "https:" + clean;
  if (!clean.startsWith("http")) return "";

  // Drop 1x1 dummy, tracking pixels, badges, Alibaba UI sprites, icons
  if (
    clean.includes("data:image") ||
    clean.includes(".gif") ||
    clean.includes("spacer") ||
    clean.includes("placeholder") ||
    clean.includes("blank.png") ||
    clean.includes("pixel") ||
    clean.includes("avatar") ||
    clean.includes("favicon") ||
    clean.includes("icon") ||
    clean.includes("-tps-") ||
    clean.includes("tps-") ||
    clean.includes("tfs/") ||
    clean.includes("badge") ||
    clean.includes("service_") ||
    clean.includes("cert_") ||
    clean.includes("rating") ||
    clean.includes("sprite") ||
    clean.includes("placehold.co")
  ) {
    return "";
  }

  // Canonicalize to single high-res asset
  clean = clean.replace(/\.(?:\d+x\d+|summ|search|b)\.(?:jpg|jpeg|png|webp)$/i, ".jpg")
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)\.jpg$/i, ".jpg")
               .replace(/_\d+x\d+.*\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_b\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_sum\.(?:jpg|jpeg|png|webp)$/i, "")
               .replace(/_\.webp$/i, "")
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)$/i, "");
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || (!body.titleCn && !body.titleEn)) {
      return NextResponse.json({ success: false, message: "Missing product title or details" }, { status: 400 });
    }

    const offerId = body.sourceOfferId || `${Date.now()}`;
    const basePriceRmb = parseFloat(body.basePriceRmb) || 17.0;
    let titleCn = (body.titleCn || body.titleEn || "").trim();

    // 1. Automated Chinese-to-English Translation
    let titleEn = (body.titleEn || "").trim();
    if (!titleEn || titleEn === titleCn || hasChineseCharacters(titleEn)) {
      titleEn = await translateText(titleCn);
    }
    if (!titleEn) titleEn = titleCn;

    // 2. Translate Specifications & Attributes
    let attributes: ProductAttribute[] = [];
    if (Array.isArray(body.attributes) && body.attributes.length > 0) {
      // If already translated with keyEn/valueEn
      if (body.attributes[0].keyEn && body.attributes[0].valueEn) {
        attributes = body.attributes;
      } else {
        attributes = await translateProductAttributes(body.attributes);
      }
    }

    // 3. Translate Description
    let description = (body.description || "").trim();
    const descriptionCn = (body.descriptionCn || description || "").trim();
    if (!description || hasChineseCharacters(description)) {
      if (descriptionCn) {
        description = await translateText(descriptionCn);
      } else {
        description = `${titleEn}. Verified direct factory wholesale batch with certified quality inspection in Guangzhou warehouse.`;
      }
    }

    // 4. Translate SKUs
    let skus = Array.isArray(body.skus) ? body.skus : [];
    if (skus.length > 0) {
      skus = await Promise.all(
        skus.map(async (sku: any, idx: number) => {
          let nameEn = sku.name || sku.nameEn || `Option ${idx + 1}`;
          if (hasChineseCharacters(nameEn)) {
            nameEn = await translateText(nameEn);
          }
          return {
            id: sku.id || `sku_${idx + 1}`,
            name: nameEn,
            nameCn: sku.nameCn || sku.name,
            image: sku.image || "",
            priceRmb: parseFloat(sku.priceRmb) || basePriceRmb,
            stock: parseInt(sku.stock, 10) || 999
          };
        })
      );
    }

    // 5. Clean & Normalize Images (Gallery + Description Photos)
    const defaultImg = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80";
    let rawGallery = (Array.isArray(body.images) ? body.images : [])
      .map(sanitizeProductImageUrl)
      .filter((img: string) => img.length > 0);

    let galleryImages: string[] = Array.from(new Set<string>(rawGallery)).slice(0, 6);
    if (galleryImages.length === 0) galleryImages = [defaultImg];

    const galleryCanonicals = new Set<string>(galleryImages.map((img) => img.split("?")[0]));

    let rawDesc = (Array.isArray(body.descriptionImages) ? body.descriptionImages : [])
      .map(sanitizeProductImageUrl)
      .filter((img: string) => img.length > 0);

    const descCanonicals = new Set<string>();
    const descImages: string[] = [];

    for (const img of rawDesc) {
      const canonical = img.split("?")[0];
      if (!galleryCanonicals.has(canonical) && !descCanonicals.has(canonical)) {
        descCanonicals.add(canonical);
        descImages.push(img);
      }
    }

    // Cap description images to max 16 curated high-res assets
    const curatedDescImages = descImages.slice(0, 16);

    // Enforce white-labeled partner identity (never store raw factory entities)
    const shopName = "Verified Global Partner";

    // 6. Normalize Price Tiers
    let rawTiers = Array.isArray(body.priceTiers) ? body.priceTiers : [];
    let normalizedTiers: PriceTier[] = [];

    if (rawTiers.length > 0) {
      normalizedTiers = rawTiers.map((t: any, idx: number) => {
        const priceVal = parseFloat(t.priceRmb ?? t.price) || basePriceRmb;
        const minQtyVal = parseInt(t.minQty, 10) || (idx === 0 ? (parseInt(body.minOrderQty, 10) || 2) : (idx + 1) * 5);
        return {
          range: t.range || `${minQtyVal}+ pcs`,
          minQty: minQtyVal,
          priceRmb: priceVal > 0 ? priceVal : basePriceRmb
        };
      });
    }

    if (normalizedTiers.length === 0) {
      normalizedTiers = [
        { range: "2–9 pcs", minQty: 2, priceRmb: basePriceRmb },
        { range: "10–49 pcs", minQty: 10, priceRmb: Number((basePriceRmb * 0.9).toFixed(1)) },
        { range: "50+ pcs", minQty: 50, priceRmb: Number((basePriceRmb * 0.82).toFixed(1)) }
      ];
    }

    // 7. Assemble Product Record
    const product: Product = {
      id: `prod-${offerId}`,
      sourcePlatform: body.sourcePlatform || "1688",
      sourceOfferId: offerId,
      url: body.url || `https://detail.1688.com/offer/${offerId}.html`,
      titleCn,
      titleEn,
      descriptionCn,
      description,
      images: galleryImages,
      descriptionImages: curatedDescImages,
      attributes,
      priceTiers: normalizedTiers,
      basePriceRmb: normalizedTiers[0].priceRmb,
      skus,
      category: body.category || "General Wholesale",
      shopName,
      location: "Guangdong Hub",
      estimatedWeightKg: parseFloat(body.estimatedWeightKg) || 0.45,
      minOrderQty: parseInt(body.minOrderQty, 10) || normalizedTiers[0].minQty || 2,
      createdAt: new Date().toISOString()
    };

    await StorageService.saveProduct(product);

    const hostHeader = req.headers.get("host") || "skylinebd.vercel.app";
    const protocol = req.headers.get("x-forwarded-proto") || (hostHeader.includes("localhost") ? "http" : "https");
    const absoluteProductUrl = `${protocol}://${hostHeader}/product/${product.id}`;

    return NextResponse.json(
      {
        success: true,
        message: "Product successfully imported with description photos and translated specifications!",
        product,
        productId: product.id,
        productUrl: absoluteProductUrl
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  } catch (error: any) {
    console.error("API import error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

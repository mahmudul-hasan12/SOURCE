import { NextRequest, NextResponse } from "next/server";
import { StorageService } from "@/lib/db";
import { Product, PriceTier } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await StorageService.getProducts();
  return NextResponse.json({ success: true, products });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.titleEn) {
      return NextResponse.json(
        { success: false, message: "Product title is required" },
        { status: 400 }
      );
    }

    const offerId = body.sourceOfferId || `${Date.now()}`;
    const basePriceRmb = parseFloat(body.basePriceRmb) || 45.0;

    let normalizedTiers: PriceTier[] = [];
    if (Array.isArray(body.priceTiers) && body.priceTiers.length > 0) {
      normalizedTiers = body.priceTiers.map((t: any, idx: number) => ({
        range: t.range || `${t.minQty || (idx + 1) * 2}+ pcs`,
        minQty: parseInt(t.minQty, 10) || (idx === 0 ? 2 : (idx + 1) * 5),
        priceRmb: parseFloat(t.priceRmb ?? t.price) || basePriceRmb
      }));
    } else {
      normalizedTiers = [
        { range: "2–9 pcs", minQty: 2, priceRmb: basePriceRmb },
        { range: "10–49 pcs", minQty: 10, priceRmb: Number((basePriceRmb * 0.9).toFixed(1)) },
        { range: "50+ pcs", minQty: 50, priceRmb: Number((basePriceRmb * 0.82).toFixed(1)) }
      ];
    }

    const newProduct: Product = {
      id: body.id || `prod-custom-${offerId}`,
      sourcePlatform: body.sourcePlatform || "Direct Factory",
      sourceOfferId: offerId,
      url: body.url || "",
      titleCn: body.titleCn || body.titleEn,
      titleEn: body.titleEn,
      titleBn: body.titleBn || "",
      description: body.description || "Direct factory wholesale supply with verified pre-shipment inspection.",
      images: Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"],
      priceTiers: normalizedTiers,
      basePriceRmb: normalizedTiers[0].priceRmb,
      skus: Array.isArray(body.skus) ? body.skus : [
        { id: `sku-1`, nameEn: "Standard Factory Finish", nameCn: "标准版", priceRmb: normalizedTiers[0].priceRmb, stock: 1000 }
      ],
      category: body.category || "general",
      shopName: body.shopName || "Guangdong Direct Partner Factory",
      location: body.location || "Guangzhou, China",
      estimatedWeightKg: parseFloat(body.estimatedWeightKg) || 0.35,
      minOrderQty: parseInt(body.minOrderQty, 10) || normalizedTiers[0].minQty || 2,
      isSensitiveCargo: Boolean(body.isSensitiveCargo),
      createdAt: new Date().toISOString()
    };

    await StorageService.saveProduct(newProduct);

    return NextResponse.json({
      success: true,
      message: "Product created and published to store successfully!",
      product: newProduct,
      productId: newProduct.id,
      productUrl: `/product/${newProduct.id}`
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

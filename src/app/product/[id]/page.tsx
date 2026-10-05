import React from "react";
import { StorageService } from "@/lib/db";
import { getClientProductById } from "@/lib/seed-data";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

function sanitizeForCustomer(p: Product): Product {
  return {
    ...p,
    sourcePlatform: "FACTORY_DIRECT",
    url: "",
    images: (p.images || []).map((img) => (typeof img === "string" ? img.replace(/1688\+Product/g, "Factory+Direct") : "")).filter(Boolean),
    descriptionImages: (p.descriptionImages || []).map((img) => (typeof img === "string" ? img.replace(/1688\+Product/g, "Factory+Direct") : "")).filter(Boolean)
  };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params?.id;
  const rawProduct = (await StorageService.getProductById(productId)) || getClientProductById(productId);
  const product = rawProduct ? sanitizeForCustomer(rawProduct) : null;

  return <ProductDetailClient productId={productId} initialProduct={product} />;
}

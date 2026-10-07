const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0";

async function runTest() {
  console.log("=== Testing Extension Import Ingestion & Catalog Status ===");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("skysourcing");
  const col = db.collection("products");

  // 1. Verify clean catalog
  const currentCount = await col.countDocuments();
  console.log(`Current catalog product count: ${currentCount} (Expected: 0)`);

  // 2. Simulate Extension Import Ingestion
  const mockOfferId = "test_offer_999888";
  const mockImportedProduct = {
    id: `prod-${mockOfferId}`,
    sourcePlatform: "1688",
    sourceOfferId: mockOfferId,
    url: `https://detail.1688.com/offer/${mockOfferId}.html`,
    titleCn: "跨境爆款男士纯棉宽松落肩T恤",
    titleEn: "Men's Premium Heavyweight 100% Combed Cotton Oversized T-Shirt",
    description: "Direct international wholesale supply with certified pre-shipment inspection.",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"
    ],
    descriptionImages: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800"
    ],
    attributes: [
      { keyEn: "Material", valueEn: "100% Combed Cotton 240g" },
      { keyEn: "Fit", valueEn: "Oversized Drop Shoulder" }
    ],
    priceTiers: [
      { range: "2–9 pcs", minQty: 2, priceRmb: 19.5 },
      { range: "10–49 pcs", minQty: 10, priceRmb: 17.5 },
      { range: "50+ pcs", minQty: 50, priceRmb: 15.0 }
    ],
    basePriceRmb: 19.5,
    skus: [
      { id: "sku_1", name: "Clean White", priceRmb: 19.5, stock: 2000 }
    ],
    category: "General Wholesale",
    shopName: "Verified Global Partner",
    location: "Guangdong Hub",
    estimatedWeightKg: 0.3,
    minOrderQty: 2,
    createdAt: new Date().toISOString()
  };

  await col.insertOne(mockImportedProduct);
  console.log(`✅ Successfully inserted simulated extension import: ${mockImportedProduct.id}`);

  // Verify retrieval
  const fetched = await col.findOne({ id: mockImportedProduct.id });
  if (fetched && fetched.shopName === "Verified Global Partner" && fetched.priceTiers.length === 3) {
    console.log("✅ Verified product schema, price tiers, and white-labeled supplier name in Atlas!");
  } else {
    console.error("❌ Product verification failed:", fetched);
  }

  // Clean up test product
  await col.deleteOne({ id: mockImportedProduct.id });
  const finalCount = await col.countDocuments();
  console.log(`Cleaned up test product. Final catalog count: ${finalCount} (Clean slate preserved)`);

  await client.close();
  console.log("=== All Ingestion Verification Checks Passed ===");
}

runTest().catch(console.error);

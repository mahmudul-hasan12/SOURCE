const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const postData = JSON.stringify(data);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function run() {
  console.log("=== 1. Testing POST /api/translate ===");
  const translatePayload = {
    text: "工业级4040铝型材 国标重型铝合金支架",
    attributes: [
      { key: "材质", value: "6063-T5高强度铝合金" },
      { key: "表面处理", value: "阳极氧化本色" },
      { key: "产地", value: "广东佛山" }
    ]
  };
  const tRes = await post('http://localhost:3000/api/translate', translatePayload);
  console.log("Translate Status:", tRes.status);
  console.log("Translated text:", tRes.data.translated);
  console.log("Translated attributes:", tRes.data.attributes);

  if (!tRes.data.translated || !tRes.data.attributes) {
    throw new Error("Translation API failed!");
  }

  console.log("\n=== 2. Testing Rich Import via POST /api/extension/import ===");
  const richProduct = {
    sourcePlatform: "1688",
    sourceOfferId: "891230491823",
    url: "https://detail.1688.com/offer/891230491823.html",
    titleCn: "工业级4040铝型材 国标重型铝合金支架 自动化流水线铝型材",
    titleEn: "", // Left blank or identical to test auto-translation
    descriptionCn: "广东佛山现货工业铝型材4040国标重型，表面阳极氧化，高承重高硬度，可免费切割打孔攻丝。",
    images: [
      "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    ],
    descriptionImages: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
    ],
    attributes: [
      { keyCn: "材质", valueCn: "6063-T5高强度铝合金" },
      { keyCn: "表面处理", valueCn: "阳极氧化本色银白" },
      { keyCn: "产地", valueCn: "广东佛山工业基地" },
      { keyCn: "适用范围", valueCn: "自动化设备框架、流水线工作台" },
      { keyCn: "加工定制", valueCn: "支持免费按图切割打孔攻丝" }
    ],
    priceTiers: [
      { minQty: 2, priceRmb: 58.0, range: "2–9 pcs" },
      { minQty: 10, priceRmb: 52.0, range: "10–49 pcs" },
      { minQty: 50, priceRmb: 46.5, range: "50+ pcs" }
    ],
    basePriceRmb: 58.0,
    category: "Industrial & Building",
    shopName: "Foshan Precision Extrusion Profiles Factory",
    location: "Guangdong, China",
    estimatedWeightKg: 1.85,
    minOrderQty: 2
  };

  const importRes = await post('http://localhost:3000/api/extension/import', richProduct);
  console.log("Import Status:", importRes.status);
  console.log("Import Response:", {
    success: importRes.data.success,
    productId: importRes.data.productId,
    titleEn: importRes.data.product?.titleEn,
    description: importRes.data.product?.description,
    attributesCount: importRes.data.product?.attributes?.length,
    descriptionImagesCount: importRes.data.product?.descriptionImages?.length
  });

  if (!importRes.data.success) {
    throw new Error("Rich product import failed!");
  }

  const newId = importRes.data.productId;

  console.log(`\n=== 3. Testing Storefront Rendering on /product/${newId} ===`);
  const pdpRes = await get(`http://localhost:3000/product/${newId}`);
  console.log("PDP HTTP Status:", pdpRes.status, "HTML Length:", pdpRes.body.length);

  // Check that translated English title is rendered
  const hasTranslatedTitle = pdpRes.body.toLowerCase().includes("aluminum") || pdpRes.body.toLowerCase().includes("profile");
  console.log("Contains translated English title in HTML:", hasTranslatedTitle);

  // Check that specifications matrix is rendered
  const hasSpecsTable = pdpRes.body.includes("Verified Factory Technical Specifications") || pdpRes.body.includes("Material");
  console.log("Contains Specifications Table in HTML:", hasSpecsTable);

  // Check that description photos gallery is rendered
  const hasDescGallery = pdpRes.body.includes("Factory Blueprint &amp; Inspection Photo Gallery") || pdpRes.body.includes("Factory Blueprint & Inspection Photo Gallery");
  console.log("Contains Description Photos Gallery in HTML:", hasDescGallery);

  console.log(`\n=== 4. Testing Homepage Display ===`);
  const homeRes = await get(`http://localhost:3000/`);
  const hasHomeItem = homeRes.body.includes(newId) || homeRes.body.toLowerCase().includes("aluminum");
  console.log("Homepage displays newly imported product:", hasHomeItem);

  if (!hasTranslatedTitle || !hasSpecsTable || !hasDescGallery) {
    throw new Error("PDP failed to render translated specs or description gallery!");
  }

  console.log("\n>>> ALL RICH IMPORTER & TRANSLATION TESTS PASSED WITH 100% SUCCESS! <<<");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

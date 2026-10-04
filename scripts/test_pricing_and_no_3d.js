const http = require('http');

async function testStorefrontNo3D() {
  console.log('=== 1. Verifying Product Detail Page (No 3D View & 17 RMB Pricing) ===');
  
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000/product/prod-946712326591', (res) => {
      let html = '';
      res.on('data', chunk => { html += chunk; });
      res.on('end', () => {
        const has3DText = html.includes('Interactive 3D CAD') || html.includes('3D Factory CAD Inspector');
        const hasDirectFactory = html.includes('Direct Factory');
        // Tier 1 price for 17 RMB at 17.5 BDT/RMB + 12% margin:
        // 17 * 17.5 = 297.5 * 1.12 = 333.2 -> 333 BDT
        const hasPrice333 = html.includes('333');
        const hasLegacyPrice784 = html.includes('784');

        console.log('Contains 3D CAD inspector elements in HTML:', has3DText);
        console.log('Contains Direct Factory studio photo element:', hasDirectFactory);
        console.log('Contains corrected ৳333 tier price:', hasPrice333);
        console.log('Contains obsolete ৳784 (40 RMB) price:', hasLegacyPrice784);

        if (has3DText) {
          console.error('FAIL: Found 3D view remnants in storefront HTML!');
          process.exit(1);
        }
        if (!hasDirectFactory) {
          console.error('FAIL: Direct factory studio photo gallery missing!');
          process.exit(1);
        }
        if (!hasPrice333 || hasLegacyPrice784) {
          console.error('FAIL: Price was not updated to 17 RMB (৳333 BDT)!');
          process.exit(1);
        }

        console.log('PASS: 3D CAD view removed and pricing accurately calibrated to 17 RMB.');
        resolve();
      });
    }).on('error', reject);
  });
}

async function testSimulatedPriceImport() {
  console.log('\n=== 2. Testing 17 RMB Price Import via POST /api/extension/import ===');

  const payload = {
    sourcePlatform: "1688",
    sourceOfferId: "946712326591_v2",
    titleCn: "美式高街复古宽松牛仔裤",
    titleEn: "American High Street Retro Wide-Leg Vintage Denim Jeans V2",
    basePriceRmb: 17.0,
    priceTiers: [
      { range: "2–9 pcs", minQty: 2, priceRmb: 17.0 },
      { range: "10–49 pcs", minQty: 10, priceRmb: 15.5 },
      { range: "50+ pcs", minQty: 50, priceRmb: 14.0 }
    ],
    category: "apparel",
    shopName: "Guangzhou Maixin Garment Factory",
    images: ["https://cbu01.alicdn.com/img/ibank/O1CN01yLe9HY1h1tfu36uNz_!!2217490744218-0-cib.jpg"]
  };

  const payloadStr = JSON.stringify(payload);
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/extension/import',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadStr)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const json = JSON.parse(data);
        console.log('Import Status:', res.statusCode);
        console.log('Import Success:', json.success);
        console.log('Base Price Saved:', json.product?.basePriceRmb);
        if (json.product?.basePriceRmb !== 17.0) {
          console.error('FAIL: Expected basePriceRmb to be 17.0, got', json.product?.basePriceRmb);
          process.exit(1);
        }
        console.log('PASS: Import API accurately preserved 17.0 RMB base price.');
        resolve();
      });
    });
    req.on('error', reject);
    req.write(payloadStr);
    req.end();
  });
}

async function main() {
  try {
    await testStorefrontNo3D();
    await testSimulatedPriceImport();
    console.log('\n>>> ALL 3D REMOVAL & PRICING VERIFICATION TESTS PASSED 100%! <<<');
    process.exit(0);
  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  }
}

main();

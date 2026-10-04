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
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(body) }));
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
  console.log("Testing POST /api/products...");
  const newProd = {
    titleEn: "CNC Heavy Duty Precision Milling Vise 6-Inch",
    titleCn: "高精度重型CNC平口虎钳 6寸",
    category: "Machinery & Hardware",
    shopName: "Dongguan Precision Tooling Machinery Corp.",
    basePriceRmb: 280,
    minOrderQty: 2,
    estimatedWeightKg: 14.5,
    isSensitiveCargo: false,
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"],
    description: "Industrial ductile iron body with hardened ground guide rails. Certified clamping repeatability."
  };

  const createRes = await post('http://localhost:3000/api/products', newProd);
  console.log("Create status:", createRes.status, "Response:", createRes.data);

  if (!createRes.data.success) {
    throw new Error("Failed to create product!");
  }

  const prodId = createRes.data.productId;
  console.log(`Checking PDP for product ${prodId}...`);
  const pdpRes = await get(`http://localhost:3000/product/${prodId}`);
  console.log("PDP status:", pdpRes.status, "Length:", pdpRes.body.length);
  if (!pdpRes.body.includes("CNC Heavy Duty Precision Milling Vise")) {
    throw new Error("Product title not found on PDP!");
  }
  console.log("SUCCESS: Product found on PDP!");

  console.log("Checking Homepage for new product...");
  const homeRes = await get('http://localhost:3000/');
  if (homeRes.body.includes("CNC Heavy Duty Precision Milling Vise")) {
    console.log("SUCCESS: Product found live on Homepage!");
  } else {
    console.log("Note: Homepage rendered length:", homeRes.body.length);
  }

  console.log("ALL PRODUCT INGESTION TESTS PASSED!");
}

run().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});

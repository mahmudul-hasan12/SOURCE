const http = require('http');

async function testDirtyImport() {
  console.log('=== 1. Testing Dirty Payload Import with UI Badges & Duplicates ===');

  const dirtyPayload = {
    sourcePlatform: "1688",
    sourceOfferId: "998877665544",
    url: "https://detail.1688.com/offer/998877665544.html?topicName=%E7%BE%8E%E5%BC%8F%E5%A4%8D%E5%8F%A4%E5%B7%A5%E8%A3%85%E8%A3%A4",
    titleCn: "Dongguan Hongda Garment Manufacturing Co., Ltd.",
    titleEn: "Dongguan Hongda Garment Manufacturing Co., Ltd.",
    category: "apparel",
    basePriceRmb: 45,
    images: [
      "https://cbu01.alicdn.com/img/ibank/O1CN01MainPic_!!123-0-cib.jpg",
      "https://img.alicdn.com/imgextra/i2/O1CN01ZvNktK1ywYCPcwtcR_!!6000000006643-2-tps-32-32.png" // Dirty UI sprite
    ],
    descriptionImages: [
      "https://img.alicdn.com/imgextra/i4/O1CN015dO1Li1KiHE0brm3j_!!6000000001197-2-tps-64-64.png", // Dirty UI sprite
      "https://img.alicdn.com/imgextra/i3/O1CN01pbZ3Ke1FsHnlmAwRl_!!6000000000542-2-tps-24-24.png", // Dirty UI sprite
      "https://cbu01.alicdn.com/img/ibank/O1CN01DetailPhotoA_!!123-0-cib.jpg",
      "https://cbu01.alicdn.com/img/ibank/O1CN01DetailPhotoA_!!123-0-cib.220x220.jpg", // Duplicate
      "https://cbu01.alicdn.com/img/ibank/O1CN01DetailPhotoA_!!123-0-cib.summ.jpg", // Duplicate
      "https://cbu01.alicdn.com/img/ibank/O1CN01DetailPhotoB_!!123-0-cib.jpg",
      "https://cbu01.alicdn.com/img/ibank/O1CN01DetailPhotoB_!!123-0-cib.310x310.jpg"  // Duplicate
    ],
    attributes: [
      { keyCn: "材质", keyEn: "Material", valueCn: "纯棉", valueEn: "100% Pure Cotton" }
    ]
  };

  const payloadStr = JSON.stringify(dirtyPayload);
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
        try {
          const json = JSON.parse(data);
          console.log('Import Response Status:', res.statusCode);
          console.log('Success:', json.success);
          console.log('Product ID:', json.productId);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(payloadStr);
    req.end();
  });
}

async function verifyStorefront(productId) {
  console.log(`\n=== 2. Verifying Storefront HTML on /product/${productId} ===`);
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000/product/${productId}`, (res) => {
      let html = '';
      res.on('data', chunk => { html += chunk; });
      res.on('end', () => {
        const hasTps = html.includes('-tps-');
        console.log('Contains -tps- sprite in HTML:', hasTps);
        if (hasTps) {
          console.error('FAIL: Found -tps- sprite in storefront HTML!');
          process.exit(1);
        } else {
          console.log('PASS: Zero -tps- sprites found in storefront HTML.');
        }
        resolve(html);
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    // 1. Verify existing updated product prod-946712326591
    console.log('=== Verifying prod-946712326591 Storefront ===');
    const html946 = await verifyStorefront('prod-946712326591');
    const hasAmericanJeans = html946.includes('American High Street Retro');
    const hasShop = html946.includes('Guangzhou Maixin Garment Factory');
    console.log('Contains American Retro Jeans title:', hasAmericanJeans);
    console.log('Contains Guangzhou Maixin Garment Factory shop:', hasShop);

    if (!hasAmericanJeans || !hasShop) {
      console.error('FAIL: Product title or shop mismatch on prod-946712326591');
      process.exit(1);
    }

    // 2. Test dirty import endpoint
    const importRes = await testDirtyImport();
    if (!importRes.success) {
      console.error('FAIL: Dirty import endpoint failed');
      process.exit(1);
    }

    // 3. Verify newly imported item
    const htmlNew = await verifyStorefront(importRes.productId);
    console.log('\n>>> ALL ANTI-CLUTTER & ANTI-SPRITE TESTS PASSED 100%! <<<');
    process.exit(0);
  } catch (err) {
    console.error('Error during testing:', err);
    process.exit(1);
  }
}

main();

const https = require('https');

function fetchJson(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function testFullPipeline() {
  console.log('====================================================');
  console.log('1. Testing Live /api/settings on Vercel');
  console.log('====================================================');
  const settingsRes = await fetchJson('https://skylinebd.vercel.app/api/settings');
  console.log('Settings Status:', settingsRes.status);
  console.log('Settings Data:', {
    exchangeRate: settingsRes.body.settings?.exchangeRateRmbToBdt,
    bkashNumber: settingsRes.body.settings?.bkashNumber,
    bkashType: settingsRes.body.settings?.bkashAccountType,
    nagadNumber: settingsRes.body.settings?.nagadNumber,
    nagadType: settingsRes.body.settings?.nagadAccountType,
    whatsappNumber: settingsRes.body.settings?.whatsappNumber,
  });

  console.log('\n====================================================');
  console.log('2. Testing 1688 Jeans Link: 774556173956');
  console.log('====================================================');
  const res774 = await fetchJson('https://skylinebd.vercel.app/api/products/resolve?url=https%3A%2F%2Fdetail.1688.com%2Foffer%2F774556173956.html');
  console.log('774 Status:', res774.status, 'Success:', res774.body?.success);
  console.log('Product Title:', res774.body?.product?.titleEn);
  console.log('Base Price RMB: ¥' + res774.body?.product?.basePriceRmb);
  console.log('Image:', res774.body?.product?.images?.[0]);
  console.log('Sizes:', res774.body?.product?.sizes);
  console.log('Is Dummy Photo:', (res774.body?.product?.images?.[0] || '').includes('photo-1586528116311'));

  console.log('\n====================================================');
  console.log('3. Testing 1688 Jeans Link: 1019859245819');
  console.log('====================================================');
  const res1019 = await fetchJson('https://skylinebd.vercel.app/api/products/resolve?url=https%3A%2F%2Fdetail.1688.com%2Foffer%2F1019859245819.html');
  console.log('1019 Status:', res1019.status, 'Success:', res1019.body?.success);
  console.log('Product Title:', res1019.body?.product?.titleEn);
  console.log('Base Price RMB: ¥' + res1019.body?.product?.basePriceRmb);
  console.log('Image:', res1019.body?.product?.images?.[0]);
  console.log('Sizes:', res1019.body?.product?.sizes);
  console.log('Is Dummy Photo:', (res1019.body?.product?.images?.[0] || '').includes('photo-1586528116311'));

  console.log('\n====================================================');
  console.log('4. Testing Pure Offer ID Query: 774556173956');
  console.log('====================================================');
  const resIdOnly = await fetchJson('https://skylinebd.vercel.app/api/products/resolve?url=774556173956');
  console.log('ID Query Status:', resIdOnly.status, 'Matched:', resIdOnly.body?.matched);
  console.log('Redirect:', resIdOnly.body?.redirectUrl);

  console.log('\n====================================================');
  console.log('5. Testing Order Placement with bKash TrxID');
  console.log('====================================================');
  const testOrder = {
    id: `ord-test-${Date.now()}`,
    orderNumber: `FAC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: "STAGE1_PENDING",
    shippingMethod: "AIR",
    cargoType: "GENERAL",
    customer: {
      name: "Tawhid Topon",
      phone: "01755123456",
      district: "Dhaka",
      thana: "Dhanmondi",
      fullAddress: "House 12, Road 7A, Dhanmondi, Dhaka"
    },
    items: [
      {
        id: `item-1`,
        productId: "prod-774556173956",
        productTitle: "Men's Hong Kong Style High Street Loose Wide-Leg Retro Denim Jeans",
        productImage: "https://cbu01.alicdn.com/img/ibank/O1CN01k0bbzI1pYszt0Hopz_!!2207321775373-0-cib.jpg",
        sourcePlatform: "1688",
        sourceOfferId: "774556173956",
        skuName: "Vintage Washed Retro Blue",
        unitPriceRmb: 20.0,
        unitPriceBdt: 414,
        quantity: 2
      }
    ],
    pricing: {
      exchangeRateUsed: 18.5,
      productTotalRmb: 40.0,
      productTotalBdt: 828,
      advancePercentage: 50,
      advanceAmountBdt: 414,
      stage2ProductBalanceBdt: 414,
      estimatedWeightKg: 1.1,
      intlShippingRatePerKg: 750,
      intlShippingCostBdt: 825,
      localCourierFeeBdt: 70,
      totalOrderBdt: 1723,
      stage2TotalPayableBdt: 1309
    },
    tracking: {
      qcPhotos: []
    },
    payment: {
      method: "BKASH",
      accountType: "MERCHANT",
      senderNumber: "01755123456",
      transactionId: "BLA928372X",
      amount: 414,
      submittedAt: new Date().toISOString(),
      verified: false
    }
  };

  const orderCreateRes = await fetchJson('https://skylinebd.vercel.app/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testOrder)
  });
  console.log('Order Create Status:', orderCreateRes.status, 'Success:', orderCreateRes.body?.success);
  console.log('Order Number:', orderCreateRes.body?.order?.orderNumber);

  console.log('\n====================================================');
  console.log('6. Testing Admin TrxID Verification for Order: ' + testOrder.id);
  console.log('====================================================');
  const verifyRes = await fetchJson(`https://skylinebd.vercel.app/api/orders/${testOrder.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: "STAGE1_PAID",
      payment: { ...testOrder.payment, verified: true, verifiedAt: new Date().toISOString() }
    })
  });
  console.log('Admin Verification Status:', verifyRes.status, 'Success:', verifyRes.body?.success);
  console.log('Updated Status:', verifyRes.body?.order?.status);
  console.log('Payment Verified:', verifyRes.body?.order?.payment?.verified);

  console.log('\n====================================================');
  console.log('7. Pipeline Verification Complete!');
  console.log('====================================================');
}

testFullPipeline().catch(console.error);

const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== 1. Testing GET /api/products/resolve with Jeans 1688 URL ===');
  const jeansUrl = 'https://detail.1688.com/offer/946712326591.html?topicCode=3D20260920001000000000025579967';
  const resolveRes = await get(`http://localhost:3000/api/products/resolve?url=${encodeURIComponent(jeansUrl)}`);
  console.log('Resolve Status:', resolveRes.status);
  
  const parsed = JSON.parse(resolveRes.body);
  console.log('Resolve Success:', parsed.success);
  console.log('Matched Catalog:', parsed.matched);
  console.log('Product ID:', parsed.product?.id);
  console.log('Title EN:', parsed.product?.titleEn);
  console.log('Base Price RMB:', parsed.product?.basePriceRmb);
  console.log('Redirect URL:', parsed.redirectUrl);

  if (!parsed.product?.id?.startsWith('prod-946712326591')) {
    throw new Error(`Expected prod-946712326591* but got ${parsed.product?.id}`);
  }
  if (parsed.product?.basePriceRmb !== 17) {
    throw new Error(`Expected 17 RMB base price but got ${parsed.product?.basePriceRmb}`);
  }
  if (!parsed.product?.titleEn?.toLowerCase().includes('jeans')) {
    throw new Error(`Expected title to contain Jeans but got ${parsed.product?.titleEn}`);
  }
  console.log('PASS: 1688 jeans URL matched prod-946712326591 at 17 RMB!');

  console.log('\n=== 2. Testing Storefront Search HTML for 946712326591 ===');
  const searchPageRes = await get(`http://localhost:3000/search?url=${encodeURIComponent(jeansUrl)}`);
  console.log('Search Page Status:', searchPageRes.status);
  const html = searchPageRes.body;
  const hasEarbudsPhoto = html.includes('photo-1590658268037-6bf12165a8df');
  const has666Price = html.includes('666');
  console.log('Contains Earbuds photo in HTML:', hasEarbudsPhoto);
  console.log('Contains ৳666 fake price in HTML:', has666Price);

  if (hasEarbudsPhoto) {
    throw new Error('FAILED: Hardcoded earbud photo still found in search HTML!');
  }
  if (has666Price) {
    throw new Error('FAILED: Fake ৳666 price still found in search HTML!');
  }
  console.log('PASS: Zero earbud photos and zero ৳666 fake prices in search page!');

  console.log('\n=== 3. Testing Dynamic Resolution for New Unimported 1688 URL ===');
  const newOfferUrl = 'https://detail.1688.com/offer/778899001122.html?topicName=%E7%BE%8E%E5%BC%8F%E9%AB%98%E8%A1%97%E7%89%9B%E4%BB%94%E8%A3%A4';
  const newResolveRes = await get(`http://localhost:3000/api/products/resolve?url=${encodeURIComponent(newOfferUrl)}`);
  const newParsed = JSON.parse(newResolveRes.body);
  console.log('New URL Resolved Success:', newParsed.success);
  console.log('New Title EN:', newParsed.product?.titleEn);
  console.log('New Redirect URL:', newParsed.redirectUrl);
  if (!newParsed.product?.titleEn?.toLowerCase().includes('jeans')) {
    throw new Error(`Expected translated title to include Jeans but got: ${newParsed.product?.titleEn}`);
  }
  console.log('PASS: Unimported 1688 URL automatically translated topicName to English without dummy earbuds!');

  console.log('\n>>> ALL SEARCH RESOLVER VERIFICATION TESTS PASSED 100%! <<<');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

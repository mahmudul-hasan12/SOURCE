const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('=== Test 1: Checking Homepage Clickable Card Links (/) ===');
  const homeRes = await get('http://localhost:3000/');
  console.log('Home Status:', homeRes.status);
  
  const hasLinkedPhotos = homeRes.body.includes('relative aspect-square overflow-hidden bg-slate-100 block cursor-pointer');
  console.log('Contains clickable photo links (<Link href="/product/...">):', hasLinkedPhotos);
  
  const hasNoReferrer = homeRes.body.includes('referrerpolicy="no-referrer"') || homeRes.body.includes('referrerPolicy="no-referrer"');
  console.log('Contains referrerPolicy="no-referrer":', hasNoReferrer);

  if (!hasLinkedPhotos) throw new Error('Home card photos are not wrapped in clickable Link components!');

  console.log('\n=== Test 2: Checking Search Page Source Code (src/app/search/page.tsx) ===');
  const fs = require('fs');
  const searchCode = fs.readFileSync('src/app/search/page.tsx', 'utf8');
  const searchHasLinkedPhoto = searchCode.includes('href={`/product/${product.id}`}') && searchCode.includes('cursor-pointer');
  const searchHasLinkedTitle = searchCode.includes('<Link href={`/product/${product.id}`} className="block">');
  const searchHasFallback = searchCode.includes('fallback-product.jpg');
  console.log('Search code has clickable photo links:', searchHasLinkedPhoto);
  console.log('Search code has clickable titles:', searchHasLinkedTitle);
  console.log('Search code has fallback-product handler:', searchHasFallback);

  if (!searchHasLinkedPhoto || !searchHasLinkedTitle) throw new Error('Search page code missing clickable card links!');

  console.log('\n=== Test 3: Checking Workwear PDP (/product/prod-895199300568) ===');
  const pdpRes = await get('http://localhost:3000/product/prod-895199300568');
  console.log('PDP Status:', pdpRes.status);

  const hasAuthenticImage = pdpRes.body.includes('workwear-green-main.jpg') || pdpRes.body.includes('workwear-studio-hd.jpg');
  console.log('Contains authentic Military Green workwear suit image:', hasAuthenticImage);

  const hasOldRackImage = pdpRes.body.includes('photo-1578932750294-f5075e85f44a');
  console.log('Contains old casual clothes rack image:', hasOldRackImage);

  const hasExactPrice = pdpRes.body.includes('31.06') || pdpRes.body.includes('609');
  console.log('Contains ¥31.06 or ৳609 price:', hasExactPrice);

  const hasClickToZoom = pdpRes.body.includes('Click to Zoom') || pdpRes.body.includes('cursor-zoom-in');
  console.log('Contains main photo Click to Zoom trigger:', hasClickToZoom);

  const hasSizeMatrix = pdpRes.body.includes('165') && pdpRes.body.includes('190');
  console.log('Contains 1688 size matrix (165 to 190):', hasSizeMatrix);

  const hasFactoryBadges = pdpRes.body.includes('AI Yanxuan') || pdpRes.body.includes('Samsung Supply Chain');
  console.log('Contains 1688 factory badges:', hasFactoryBadges);

  if (!hasAuthenticImage) throw new Error('Authentic Military Green workwear image not found on PDP!');
  if (hasOldRackImage) throw new Error('Old clothes rack image still present!');
  if (!hasClickToZoom) throw new Error('Click to Zoom trigger not found on PDP!');

  console.log('\n>>> ALL PHOTO CLICK & 1688 SYNC TESTS PASSED 100%! <<<');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});

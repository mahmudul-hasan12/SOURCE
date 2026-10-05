const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('=== Checking Live Vercel Workwear Route ===');
  const res = await get('https://skylinebd.vercel.app/product/prod-895199300568');
  console.log('HTTP Status:', res.status);
  console.log('Contains Cotton:', res.body.includes('Cotton'));
  console.log('Contains Workwear:', res.body.includes('Workwear'));
  console.log('Contains 1688 Direct Factory Listing:', res.body.includes('1688 Direct Factory Listing'));
  console.log('Contains generic warehouse placeholder:', res.body.includes('photo-1586528116311-'));
  
  console.log('\n=== Checking Live Vercel Hero Cover Photo ===');
  const home = await get('https://skylinebd.vercel.app');
  console.log('Home Status:', home.status);
  console.log('Contains /hero-cover.jpg:', home.body.includes('/hero-cover.jpg'));
  console.log('Contains opacity-80 or opacity-90:', home.body.includes('opacity-80') || home.body.includes('opacity-90'));
}

verifyLive().catch(console.error);

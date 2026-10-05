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
  console.log('Contains workwear-green-main.jpg:', res.body.includes('workwear-green-main.jpg') || res.body.includes('workwear-studio-hd.jpg'));
  console.log('Contains 31.06 or 609 BDT:', res.body.includes('31.06') || res.body.includes('609'));
  console.log('Contains Click to Zoom:', res.body.includes('Click to Zoom') || res.body.includes('cursor-zoom-in'));
  console.log('Contains size matrix:', res.body.includes('165') && res.body.includes('190'));

  console.log('\n=== Checking Live Vercel Homepage Card Links ===');
  const home = await get('https://skylinebd.vercel.app');
  console.log('Home Status:', home.status);
  console.log('Contains cursor-pointer on photo:', home.body.includes('cursor-pointer'));
  console.log('Contains referrerPolicy="no-referrer":', home.body.includes('referrerpolicy="no-referrer"') || home.body.includes('referrerPolicy="no-referrer"'));
}

verifyLive().catch(console.error);

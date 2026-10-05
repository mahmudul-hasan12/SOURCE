const https = require('https');

function fetchMobile1688(offerId) {
  return new Promise((resolve, reject) => {
    const url = `https://m.1688.com/offer/${offerId}.html`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const offerId = '895199300568';
  console.log(`Fetching m.1688.com for offer ${offerId}...`);
  const html = await fetchMobile1688(offerId);
  console.log('HTML Length:', html.length);
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  console.log('Title:', title);

  // Extract images
  const rawUrls = html.match(/https?:\/\/[a-zA-Z0-9_\-\.]+\.alicdn\.com\/img\/[^"'\s<>\\]+/g) || [];
  const cleanedImages = Array.from(new Set(rawUrls.map(u => {
    return u.replace(/_\.webp$/i, '').replace(/\.(?:220x220|310x310|400x400|summ|b)\.jpg$/i, '.jpg');
  }))).filter(u => !u.includes('-tps-') && !u.includes('badges'));

  console.log('Found product images:', cleanedImages.length);
  console.log('First 5 images:', cleanedImages.slice(0, 5));

  // Extract prices
  const priceMatches = html.match(/"price":\s*"([0-9\.]+)"/g) || 
                       html.match(/"refPrice":\s*"([0-9\.]+)"/g) ||
                       html.match(/"discountPrice":\s*"([0-9\.]+)"/g) ||
                       html.match(/¥\s*([0-9\.]+)/g) || [];
  console.log('Found prices:', priceMatches.slice(0, 5));
}

run();

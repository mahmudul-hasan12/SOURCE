const https = require('https');

https.get('https://m.1688.com/offer/895199300568.html', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
  }
}, res => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('HTML size:', html.length);
    // Find all image URLs from alicdn
    const alicdnImages = [...new Set([...html.matchAll(/https:\/\/[^"'\s]+\.(?:cbu01\.alicdn\.com|alicdn\.com)[^"'\s]*\.(?:jpg|png|jpeg)/gi)].map(m => m[0]))];
    console.log('Total Alicdn images found:', alicdnImages.length);
    console.log('Top 5 images:', alicdnImages.slice(0, 5));

    // Look for prices
    const prices = [...html.matchAll(/(?:¥|￥|&yen;|price['":\s]+)([0-9]+(?:\.[0-9]+)?)/gi)].map(m => m[1]);
    console.log('Found prices:', [...new Set(prices)].slice(0, 10));

    // Look for title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

    // Look for script tags with JSON
    const scriptMatches = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gis)].map(m => m[1]);
    console.log('Total scripts:', scriptMatches.length);
    for (const s of scriptMatches) {
      if (s.includes('sku') || s.includes('price') || s.includes('image')) {
        console.log('Script with product data found, length:', s.length);
        const skuMatches = [...s.matchAll(/"name":\s*"([^"]+)"/g)].map(m => m[1]);
        if (skuMatches.length) console.log('SKU names in script:', skuMatches.slice(0, 5));
        const priceMatches = [...s.matchAll(/"price":\s*"([^"]+)"/g)].map(m => m[1]);
        if (priceMatches.length) console.log('Prices in script:', priceMatches.slice(0, 5));
      }
    }
  });
});

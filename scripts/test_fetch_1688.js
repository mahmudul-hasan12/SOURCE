const https = require('https');

async function testFetch(targetUrl) {
  console.log(`Testing fetch for: ${targetUrl}`);
  return new Promise((resolve) => {
    const req = https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      timeout: 8000
    }, (res) => {
      console.log('Status:', res.statusCode);
      console.log('Location:', res.headers.location);
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Data length:', data.length);
        const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
        console.log('Title:', titleMatch ? titleMatch[1] : 'No title tag');
        
        // Search for og:image or cbu01 / alicdn images or window.__INIT_DATA
        const ogImage = data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        console.log('OG Image:', ogImage ? ogImage[1] : 'None');

        const images = [...data.matchAll(/https:\/\/[^"'\s]+\.(?:cbu01\.alicdn\.com|alicdn\.com)[^"'\s]*\.(?:jpg|png|jpeg)/gi)].map(m => m[0]);
        console.log('Found Alicdn images:', images.slice(0, 3));

        resolve({ status: res.statusCode, location: res.headers.location, dataLength: data.length });
      });
    });

    req.on('error', (e) => {
      console.error('Fetch error:', e.message);
      resolve(null);
    });
  });
}

async function run() {
  await testFetch('https://detail.1688.com/offer/895199300568.html');
  await testFetch('https://m.1688.com/offer/895199300568.html');
}

run();

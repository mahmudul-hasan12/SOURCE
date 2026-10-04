const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log("Checking 1688 offer page response...");
  const offerId = '982144879342';
  
  // Test desc URL pattern
  const descUrl = `https://desc.1688.com/open/getDesc.htm?offerId=${offerId}`;
  console.log("Testing descUrl:", descUrl);
  try {
    const descRes = await fetchUrl(descUrl);
    console.log("descUrl status:", descRes.status, "location:", descRes.headers.location);
    if (descRes.headers.location) {
      const redirected = await fetchUrl(descRes.headers.location);
      console.log("Redirected status:", redirected.status, "length:", redirected.data.length);
      const imgs = redirected.data.match(/https?:[^"'\s>]+\.(?:jpg|png|webp)/gi) || [];
      console.log("Found images after redirect:", imgs.length, imgs.slice(0, 5));
    }
  } catch (e) {
    console.error("Error fetching descUrl:", e.message);
  }
}

run();

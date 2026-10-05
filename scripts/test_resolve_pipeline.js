const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== Testing 1688 Workwear Link Resolution ===');
  const res1 = await post('http://localhost:3000/api/products/resolve', {
    url: 'https://detail.1688.com/offer/895199300568.html'
  });
  console.log('Match status:', res1.status, 'Matched:', res1.body.matched, 'Title:', res1.body.product.titleEn);
  console.log('Redirect:', res1.body.redirectUrl);
  console.log('Images[0]:', res1.body.product.images[0]);

  console.log('\n=== Testing New 1688 Denim URL with topicName ===');
  const res2 = await post('http://localhost:3000/api/products/resolve', {
    url: 'https://detail.1688.com/offer/888899990001.html?topicName=%E7%BE%8E%E5%BC%8F%E5%A4%8D%E5%8F%A4%E7%89%9B%E4%BB%94%E8%A3%A4'
  });
  console.log('Status:', res2.status, 'Title:', res2.body.product.titleEn);
  console.log('Category:', res2.body.product.category, 'Price RMB:', res2.body.product.basePriceRmb);
  console.log('Images[0]:', res2.body.product.images[0]);
  console.log('Redirect:', res2.body.redirectUrl);

  console.log('\n=== Testing Taobao Earbuds URL ===');
  const res3 = await post('http://localhost:3000/api/products/resolve', {
    url: 'https://item.taobao.com/item.htm?id=777788889999&title=%E8%93%9D%E7%89%99%E9%99%8D%E5%99%AA%E8%80%B3%E6%9C%BA'
  });
  console.log('Status:', res3.status, 'Title:', res3.body.product.titleEn);
  console.log('Category:', res3.body.product.category, 'Price RMB:', res3.body.product.basePriceRmb);
  console.log('Sensitive:', res3.body.product.isSensitiveCargo);
}

run().catch(console.error);

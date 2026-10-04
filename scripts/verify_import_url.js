const http = require('http');

const req = http.request('http://localhost:3000/api/extension/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const data = JSON.parse(b);
    console.log('Returned productUrl:', data.productUrl);
    if (!data.productUrl.startsWith('http://') && !data.productUrl.startsWith('https://')) {
      console.error('FAIL: productUrl is not an absolute HTTP URL!');
      process.exit(1);
    }
    console.log('SUCCESS: productUrl is an absolute HTTP URL!');
  });
});

req.write(JSON.stringify({ titleCn: '测试产品', sourceOfferId: 'test_verify_url' }));
req.end();

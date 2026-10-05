const https = require('https');

https.get('https://m.1688.com/offer/895199300568.html', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Response content:\n', d));
});

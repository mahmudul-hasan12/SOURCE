const https = require('https');

https.get('https://skylinebd.vercel.app/orders/ord-8910/track', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const scripts = body.match(/src="[^"]+chunks[^"]+"/g) || [];
    console.log('Scripts:', scripts);
    for (const s of scripts) {
      if (s.includes('track')) {
        const src = s.replace('src="', '').replace('"', '');
        https.get('https://skylinebd.vercel.app' + src, r2 => {
          let b2 = '';
          r2.on('data', c => b2 += c);
          r2.on('end', () => {
            console.log('Chunk length:', b2.length);
            console.log('Has TrxID review:', b2.includes('TrxID Review') || b2.includes('TrxID'));
            console.log('Has Payment Verified:', b2.includes('Payment Verified') || b2.includes('পেমেন্ট'));
          });
        });
      }
    }
  });
});

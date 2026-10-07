async function testEndpoints() {
  const offerId = '1019859245819';
  const urls = [
    'https://m.1688.com/offer/' + offerId + '.html',
    'https://detail.1688.com/offer/' + offerId + '.html',
    'https://qr.1688.com/share.html?offerId=' + offerId,
    'https://air.1688.com/app/cbu-wireless-detail/index.html?offerId=' + offerId,
    'https://h5api.m.1688.com/h5/mtop.1688.trade.service.detail/1.0/?data=' + encodeURIComponent(JSON.stringify({ offerId }))
  ];
  for (const u of urls) {
    try {
      const res = await fetch(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Referer': 'https://m.1688.com/'
        }
      });
      const text = await res.text();
      console.log(u.slice(0, 50), '=> status:', res.status, 'len:', text.length, 'has rgv587:', text.includes('rgv587'), 'has x5sec:', text.includes('x5secdata'));
      if (text.length > 3000 && !text.includes('x5secdata')) {
        console.log('Sample text:', text.slice(0, 200));
      }
    } catch(e) {
      console.log(u.slice(0, 50), '=> err:', e.message);
    }
  }
}
testEndpoints();

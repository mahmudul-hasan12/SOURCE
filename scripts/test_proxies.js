async function testProxies() {
  const offerId = '1019859245819';
  const target = `https://m.1688.com/offer/${offerId}.html`;

  const proxies = [
    { name: 'allorigins', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}` },
    { name: 'codetabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}` },
    { name: 'corsproxy_io', url: `https://corsproxy.io/?${encodeURIComponent(target)}` },
    { name: 'freeboard', url: `https://thingproxy.freeboard.io/fetch/${target}` },
  ];

  for (const p of proxies) {
    try {
      console.log('Testing', p.name, '...');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(p.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const text = await res.text();
      console.log(p.name, 'Status:', res.status, 'Len:', text.length, 'has x5sec:', text.includes('x5secdata'), 'has title:', text.includes('迈鑫') || text.includes('牛仔裤'));
    } catch (e) {
      console.log(p.name, 'Failed:', e.message);
    }
  }
}

testProxies();

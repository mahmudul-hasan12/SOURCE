async function parse() {
  const offerId = '1019859245819';
  const res = await fetch(`https://m.1688.com/offer/${offerId}.html`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Referer': 'https://m.1688.com/'
    }
  });
  const html = await res.text();
  console.log('Status:', res.status, 'Len:', html.length);
  if (html.length < 3000) {
    console.log('Short response, preview:', html.slice(0, 300));
    return;
  }
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1] || '';
  console.log('Title:', title);
  const imgs = Array.from(html.matchAll(/https:\/\/[^"'\s]+\.(?:cbu01\.alicdn\.com|alicdn\.com)[^"'\s]*\.(?:jpg|png|jpeg)/gi))
    .map(m => m[0])
    .filter(u => !u.includes('-tps-') && !u.includes('tfs/') && !u.includes('badge') && !u.includes('spacer'));
  console.log('Images:', Array.from(new Set(imgs)).slice(0, 5));
  
  const prices = [];
  const pMatches = Array.from(html.matchAll(/"price"\s*:\s*"?([0-9.]+)"?/g));
  for (const m of pMatches) {
    prices.push(m[1]);
  }
  console.log('Prices:', Array.from(new Set(prices)));
}
parse();

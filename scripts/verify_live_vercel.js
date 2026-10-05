async function verifyLive() {
  const routes = [
    'https://skylinebd.vercel.app',
    'https://skylinebd.vercel.app/product/prod-whl-001',
    'https://skylinebd.vercel.app/cart',
    'https://skylinebd.vercel.app/checkout',
    'https://skylinebd.vercel.app/warehouse'
  ];

  for (const url of routes) {
    try {
      const res = await fetch(url);
      console.log(`[${url}] Status: ${res.status}`);
    } catch (e) {
      console.error(`[${url}] Error:`, e.message);
    }
  }
}
verifyLive();

const http = require('http');

const urls = [
  '/',
  '/product/prod-whl-001',
  '/cart',
  '/checkout',
  '/orders/ORD-89214-BD/track',
  '/warehouse'
];

let completed = 0;
let hadError = false;

urls.forEach(path => {
  const req = http.get(`http://localhost:3000${path}`, res => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
      let leaks = [];
      if (path !== '/warehouse') {
        leaks = data.match(/1688|taobao|tmall/gi) || [];
      }
      console.log(`[ROUTE] ${path} -> HTTP ${res.statusCode} | Size: ${data.length} bytes | Supplier Leaks: ${leaks.length}`);
      if (leaks.length > 0) {
        console.error(`  LEAK DETECTED in ${path}:`, leaks);
        hadError = true;
      }
      if (res.statusCode !== 200) {
        console.error(`  NON-200 STATUS in ${path}: ${res.statusCode}`);
        hadError = true;
      }
      completed++;
      if (completed === urls.length) {
        console.log(`\nAll ${urls.length} routes verified. Result: ${hadError ? 'FAILED' : 'ALL PASSED CLEANLY'}`);
        process.exit(hadError ? 1 : 0);
      }
    });
  });

  req.on('error', err => {
    console.error(`Error requesting ${path}:`, err.message);
    hadError = true;
    completed++;
    if (completed === urls.length) {
      process.exit(1);
    }
  });
});

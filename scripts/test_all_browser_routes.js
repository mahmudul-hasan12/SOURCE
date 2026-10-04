const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const urls = [
  'http://localhost:3000',
  'http://localhost:3000/product/prod-whl-001',
  'http://localhost:3000/cart',
  'http://localhost:3000/checkout',
  'http://localhost:3000/orders/ORD-89214-BD/track'
];
let allClean = true;

for (const u of urls) {
  try {
    const os = require('os');
    const path = require('path');
    const tempDir = path.join(os.tmpdir(), 'chrome_headless_' + Date.now());
    const output = execSync(`"${chromePath}" --headless --no-sandbox --disable-gpu --disable-extensions --disable-crash-reporter --user-data-dir="${tempDir}" --virtual-time-budget=2000 --dump-dom "${u}"`, { encoding: 'utf8', timeout: 35000 });
    const hasError = output.includes('Application error');
    console.log(`[CHROME BROWSER TEST] ${u} -> Length: ${output.length} | Has Error: ${hasError}`);
    if (hasError) allClean = false;
  } catch (err) {
    console.error(`Failed on ${u}:`, err.message);
    allClean = false;
  }
}

if (allClean) {
  console.log('\n>>> SUCCESS: All routes rendered in headless Chrome with ZERO client-side exceptions! <<<');
  process.exit(0);
} else {
  console.error('\n>>> FAILED: One or more routes encountered an Application error! <<<');
  process.exit(1);
}

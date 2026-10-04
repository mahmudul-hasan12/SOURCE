const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = 'http://localhost:3000/product/prod-982144879342';

try {
  const output = execSync(`"${chromePath}" --headless --disable-gpu --virtual-time-budget=3000 --dump-dom "${url}"`, { encoding: 'utf8' });
  console.log('PDP length:', output.length);
  if (output.includes('Application error')) {
    console.error('ERROR: Application error on newly imported product!');
  } else if (output.includes('PU Lightweight Architectural Cultural Stone') || output.includes('Foshan')) {
    console.log('SUCCESS: Translated PU Stone product found in rendered DOM!');
  } else if (output.includes('2026 ANC Active Noise')) {
    console.log('WARNING: Fallback product (prod-whl-001) shown instead of imported product!');
  } else {
    console.log('Neither found, output preview:', output.substring(0, 500));
  }
} catch (e) {
  console.error(e.message);
}

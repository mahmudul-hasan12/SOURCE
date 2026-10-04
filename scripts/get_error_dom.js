const { execSync } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const output = execSync(`"${chromePath}" --headless --disable-gpu --virtual-time-budget=3000 --dump-dom http://localhost:3000`, { encoding: 'utf8' });

const idx = output.indexOf('Application error');
if (idx !== -1) {
  console.log('SURROUNDING HTML:\n', output.substring(Math.max(0, idx - 400), idx + 800));
} else {
  console.log('No Application error found in output.');
}

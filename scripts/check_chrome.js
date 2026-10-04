const { execSync } = require('child_process');
const fs = require('fs');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
];

for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    console.log('Found chrome at:', p);
    try {
      const output = execSync(`"${p}" --headless --disable-gpu --virtual-time-budget=5000 --dump-dom http://localhost:3000`, { encoding: 'utf8', timeout: 15000 });
      console.log('Output length:', output.length);
      if (output.includes('Application error')) {
        console.error('CRITICAL: DOM contains "Application error"!');
      } else {
        console.log('DOM rendered cleanly without Application error');
      }
    } catch (err) {
      console.error('Error running chrome:', err.message);
      if (err.stdout) console.log('Stdout:', err.stdout.substring(0, 500));
      if (err.stderr) console.error('Stderr:', err.stderr);
    }
    break;
  }
}

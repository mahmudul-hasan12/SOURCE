const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const proc = spawn(chromePath, [
  '--headless',
  '--disable-gpu',
  '--enable-logging=stderr',
  '--v=1',
  'http://localhost:3000'
]);

proc.stdout.on('data', d => console.log('STDOUT:', d.toString()));
proc.stderr.on('data', d => console.log('STDERR:', d.toString()));

setTimeout(() => {
  proc.kill();
  process.exit(0);
}, 5000);

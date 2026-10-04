const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const chrome = spawn(chromePath, [
  '--headless',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  'http://localhost:3000'
]);

setTimeout(async () => {
  try {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        console.log('Pages:', pages);
        if (pages[0] && pages[0].webSocketDebuggerUrl) {
          // Connect to ws
          const WebSocket = require('net'); // we don't have ws package, but let's see if we can read console logs or stderr
        }
      });
    });
  } catch (e) {
    console.error(e);
  }
}, 2000);

setTimeout(() => {
  chrome.kill();
  process.exit(0);
}, 6000);

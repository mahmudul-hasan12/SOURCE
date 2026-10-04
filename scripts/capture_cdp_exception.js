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
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const pages = JSON.parse(data);
        const page = pages.find(p => p.type === 'page');
        if (!page) {
          console.log('No page found');
          return;
        }
        console.log('Connecting to WS:', page.webSocketDebuggerUrl);
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        
        ws.onopen = () => {
          console.log('WS connected. Enabling Runtime and Log...');
          ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Log.enable' }));
          ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          ws.send(JSON.stringify({ id: 4, method: 'Page.reload' }));
        };

        ws.onmessage = (evt) => {
          const msg = JSON.parse(evt.data);
          if (msg.method === 'Runtime.exceptionThrown') {
            console.error('\n>>> EXCEPTION THROWN:', JSON.stringify(msg.params.exceptionDetails, null, 2));
          } else if (msg.method === 'Runtime.consoleAPICalled') {
            console.log('Console', msg.params.type, ':', msg.params.args.map(a => a.value || a.description).join(' '));
          }
        };
      });
    });
  } catch (err) {
    console.error('HTTP error:', err);
  }
}, 1500);

setTimeout(() => {
  chrome.kill();
  process.exit(0);
}, 6000);

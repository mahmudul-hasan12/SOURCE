const http = require('http');

http.get('http://localhost:3000/product/prod-whl-001', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const matches = b.match(/(.{0,60}(?:1688|taobao|tmall).{0,60})/gi);
    console.log("Matches found in /product/prod-whl-001:", matches);
  });
});

http.get('http://localhost:3000/', res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    const matches = b.match(/(.{0,60}(?:1688|taobao|tmall).{0,60})/gi);
    console.log("Matches found in /:", matches);
  });
});

const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\TAWHID TOPON\\.gemini\\antigravity\\brain\\e64942f9-1e64-4853-97f6-34e879d0e30d\\editorial_cargo_hub_1791105950761.jpg';
const dest = path.join(__dirname, '..', 'public', 'hero-cover.jpg');

fs.copyFileSync(src, dest);
console.log('New editorial cover photo copied to:', dest, 'Size:', fs.statSync(dest).size, 'bytes');

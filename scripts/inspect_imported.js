const fs = require('fs');
const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const p = prods.find(x => x.id === 'prod-946712326591');

if (!p) {
  console.log('Product not found in data/products.json');
  process.exit(1);
}

console.log('Title CN:', p.titleCn);
console.log('Title EN:', p.titleEn);
console.log('Total Description Images:', p.descriptionImages.length);

const tpsIcons = p.descriptionImages.filter(x => x.includes('-tps-'));
console.log('TPS Icon count:', tpsIcons.length);
console.log('First 5 TPS icons:', tpsIcons.slice(0, 5));

const ibankPhotos = p.descriptionImages.filter(x => x.includes('ibank') || x.includes('cib'));
console.log('IBank photos count:', ibankPhotos.length);
console.log('First 5 IBank photos:', ibankPhotos.slice(0, 5));

const normalizedIBank = new Set();
for (const url of ibankPhotos) {
  // Strip resolution suffixes like .220x220.jpg, .310x310.jpg, .summ.jpg, _b.jpg
  const base = url.replace(/\.(?:\d+x\d+|summ|search)\.jpg$/i, '').replace(/_b\.jpg$/i, '').replace(/_\d+x\d+.*$/i, '');
  normalizedIBank.add(base);
}
console.log('Unique IBank base photos after stripping resolution suffixes:', normalizedIBank.size);
console.log('Unique base photos sample:', Array.from(normalizedIBank).slice(0, 10));


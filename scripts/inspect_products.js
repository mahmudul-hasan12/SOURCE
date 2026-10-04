const products = require('../data/products.json');
console.log('Total products in data/products.json:', products.length);
products.forEach((p, idx) => {
  console.log(`[${idx}] ID: ${p.id} | Title: ${p.titleEn}`);
  console.log('   priceTiers:', p.priceTiers);
  console.log('   basePriceRmb:', p.basePriceRmb);
});

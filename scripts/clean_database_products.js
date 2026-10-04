const fs = require('fs');

function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let clean = url.trim();
  if (clean.includes('-tps-') || clean.includes('tps-') || clean.includes('tfs/') || clean.includes('blank.png')) {
    return '';
  }
  // Strip resolution tags
  clean = clean.replace(/\.(?:\d+x\d+|summ|search|b)\.(?:jpg|jpeg|png|webp)$/i, '.jpg')
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)\.jpg$/i, '.jpg')
               .replace(/_\d+x\d+.*\.(?:jpg|jpeg|png|webp)$/i, '')
               .replace(/_b\.(?:jpg|jpeg|png|webp)$/i, '')
               .replace(/_sum\.(?:jpg|jpeg|png|webp)$/i, '')
               .replace(/_\.webp$/i, '')
               .replace(/\.(?:220x220|310x310|300x300|400x400|summ|b)$/i, '');
  return clean;
}

const prods = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

for (const p of prods) {
  if (p.id === 'prod-946712326591') {
    p.titleCn = '美式高街复古微喇宽松牛仔裤男士直筒潮流长裤';
    p.titleEn = 'American High Street Retro Wide-Leg Vintage Denim Jeans';
    p.titleBn = 'আমেরিকান হাই-স্ট্রিট রেট্রো ভিন্টেজ ডেনিম জিন্স প্যান্ট';
    p.category = 'apparel';
    p.shopName = 'Guangzhou Maixin Garment Factory';
    p.location = 'Guangdong, Guangzhou (Xintang Denim Base)';
    p.description = 'Guangzhou Maixin Garment Factory. Direct factory wholesale American high-street retro wide-leg vintage denim jeans. Heavy-weight washed denim, relaxed silhouette, verified factory craftsmanship with pre-shipment quality inspection.';
  }

  // Sanitize gallery images
  if (Array.isArray(p.images)) {
    const seen = new Set();
    const cleanImgs = [];
    for (const img of p.images) {
      const c = sanitizeUrl(img);
      if (c && !seen.has(c)) {
        seen.add(c);
        cleanImgs.push(c);
      }
    }
    p.images = cleanImgs.length > 0 ? cleanImgs : p.images;
  }

  // Sanitize description images
  if (Array.isArray(p.descriptionImages)) {
    const galleryCanonicals = new Set((p.images || []).map(x => x.split('?')[0]));
    const descSeen = new Set();
    const cleanDesc = [];

    for (const img of p.descriptionImages) {
      const c = sanitizeUrl(img);
      const canonical = c.split('?')[0];
      if (c && !galleryCanonicals.has(canonical) && !descSeen.has(canonical)) {
        descSeen.add(canonical);
        cleanDesc.push(c);
      }
    }
    p.descriptionImages = cleanDesc.slice(0, 16);
  }
}

fs.writeFileSync('data/products.json', JSON.stringify(prods, null, 2), 'utf8');
console.log('Successfully cleaned and normalized data/products.json');
const target = prods.find(x => x.id === 'prod-946712326591');
if (target) {
  console.log('prod-946712326591 updated:');
  console.log('  Title:', target.titleEn);
  console.log('  Shop:', target.shopName);
  console.log('  Category:', target.category);
  console.log('  Images:', target.images.length);
  console.log('  Description Images:', target.descriptionImages.length);
}

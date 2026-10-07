const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = 'mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0';

async function purge() {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db('skysourcing').collection('products');

  const all = await col.find({}).toArray();
  const dummyIds = all.filter(p => {
    const title = (p.titleEn || '') + (p.titleCn || '');
    const imgStr = (p.images || []).join(' ');
    return imgStr.includes('photo-1586528116311') || 
           imgStr.includes('fallback-product') ||
           title.includes('Direct Source Factory Wholesale') ||
           title.includes('Verified Direct Source');
  }).map(p => p.id);

  console.log(`Deleting ${dummyIds.length} dummy products from MongoDB Atlas...`);
  if (dummyIds.length > 0) {
    const res = await col.deleteMany({ id: { $in: dummyIds } });
    console.log(`Deleted ${res.deletedCount} items.`);
  }

  // Also clean local JSON files
  const jsonPaths = [
    path.join(__dirname, '..', 'data', 'products.json'),
    path.join(__dirname, '..', 'SOURCE', 'data', 'products.json')
  ];

  for (const jp of jsonPaths) {
    if (fs.existsSync(jp)) {
      const list = JSON.parse(fs.readFileSync(jp, 'utf8'));
      const cleaned = list.filter(p => !dummyIds.includes(p.id) && !(p.images || []).some(img => img.includes('photo-1586528116311') || img.includes('fallback-product')));
      fs.writeFileSync(jp, JSON.stringify(cleaned, null, 2), 'utf8');
      console.log(`Cleaned ${jp}, now has ${cleaned.length} products.`);
    }
  }

  await client.close();
  console.log('Purge completed.');
}

purge().catch(console.error);

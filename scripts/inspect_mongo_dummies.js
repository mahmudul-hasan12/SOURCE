const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0';

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db('skysourcing').collection('products');
  const p774 = await col.findOne({ id: 'prod-774556173956' });
  const p1019 = await col.findOne({ id: 'prod-1019859245819' });
  console.log('774:', p774?.titleEn, p774?.images?.[0]);
  console.log('1019:', p1019?.titleEn, p1019?.images?.[0]);

  const all = await col.find({}).toArray();
  const dummies = all.filter(p => {
    const title = (p.titleEn || '') + (p.titleCn || '');
    const imgStr = (p.images || []).join(' ');
    return imgStr.includes('photo-1586528116311') || 
           imgStr.includes('fallback-product') ||
           title.includes('Direct Source Factory Wholesale') ||
           title.includes('Verified Direct Source');
  });

  console.log('Total products in MongoDB:', all.length);
  console.log('Dummy products found:', dummies.length);
  for (const d of dummies) {
    console.log(' - Dummy:', d.id, d.titleEn, d.images?.[0]);
  }
  await client.close();
}

run().catch(console.error);

const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0';

async function clean() {
  const client = new MongoClient(uri);
  await client.connect();
  const res = await client.db('skysourcing').collection('orders').deleteMany({ id: { $regex: '^ord-test-' } });
  console.log('Cleaned test orders:', res.deletedCount);
  await client.close();
}

clean().catch(console.error);

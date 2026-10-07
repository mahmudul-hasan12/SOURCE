const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0";

async function purgeProducts() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas.");
    const db = client.db("skysourcing");
    const col = db.collection("products");

    const beforeCount = await col.countDocuments();
    console.log(`Current products in collection: ${beforeCount}`);

    const result = await col.deleteMany({});
    console.log(`Deleted ${result.deletedCount} products from MongoDB Atlas.`);

    const afterCount = await col.countDocuments();
    console.log(`Products in collection after purge: ${afterCount}`);
  } catch (err) {
    console.error("Purge error:", err);
  } finally {
    await client.close();
  }
}

purgeProducts();

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0";

async function syncToCloud() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db("skysourcing");
    const col = db.collection("products");

    const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json'), 'utf8'));
    console.log(`Syncing ${products.length} products to MongoDB Atlas...`);

    for (const p of products) {
      await col.updateOne(
        { id: p.id },
        { $set: p },
        { upsert: true }
      );
    }

    console.log("✓ All catalog products successfully synced to MongoDB Atlas!");
    await client.close();
  } catch (err) {
    console.error("Cloud sync error:", err);
  }
}

syncToCloud();

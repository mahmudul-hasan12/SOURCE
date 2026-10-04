const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("ℹ️ MONGODB_URI is not set in environment.");
    console.log("✓ Hybrid storage is currently operating in LOCAL FALLBACK mode (data/*.json).");
    console.log("✓ When deploying to Vercel, set MONGODB_URI to connect your free MongoDB Atlas M0 cluster.");
    process.exit(0);
  }

  console.log("Connecting to MongoDB Atlas at:", uri.replace(/:([^@]+)@/, ':****@'));
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log("✓ Successfully connected to MongoDB Atlas!");
    const db = client.db(process.env.MONGODB_DB || "skysourcing");
    const ping = await db.command({ ping: 1 });
    console.log("✓ Database ping response:", ping);
    const collections = await db.listCollections().toArray();
    console.log("✓ Existing collections:", collections.map(c => c.name));
    await client.close();
    console.log("\n>>> CLOUD DATABASE TEST PASSED WITH 100% SUCCESS! <<<");
  } catch (err) {
    console.error("❌ Connection to MongoDB Atlas failed:", err.message);
    process.exit(1);
  }
}

testConnection();

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0";

async function checkMongo() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("skysourcing");
  const col = db.collection("products");
  const prods = await col.find({}).toArray();
  let errCount = 0;
  prods.forEach((p, i) => {
    if (!Array.isArray(p.images)) {
      console.error("MongoDB Product", i, p.id, "images is not array");
      errCount++;
    } else {
      p.images.forEach((img, j) => {
        if (typeof img !== "string") {
          console.error("MongoDB Product", p.id, "image", j, "is not string:", img);
          errCount++;
        }
      });
    }
  });
  console.log("MongoDB Total errors:", errCount, "Checked", prods.length, "products in Atlas");
  await client.close();
}
checkMongo();

// Server-only Hybrid Storage Service for SkySourcing BD
// Supports MongoDB Atlas (Free Cloud Database) with automatic fallback to local JSON files
import fs from "fs";
import path from "path";
import { MongoClient, Db } from "mongodb";
import { Product, Order, GlobalSettings } from "@/types";
import { DEFAULT_SETTINGS } from "./pricing";
import { SEED_PRODUCTS, SEED_ORDERS } from "./seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const FALLBACK_MONGODB_URI = "mongodb+srv://riode520_db_user:Exmipf7swFA3aGPy@cluster0.all666i.mongodb.net/skysourcing?retryWrites=true&w=majority&appName=Cluster0";

// Connection pooling for serverless / Next.js
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let cachedDb: Db | null = null;

async function getMongoDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI || FALLBACK_MONGODB_URI;
  if (!uri) return null;

  if (cachedDb) return cachedDb;

  try {
    let clientPromise: Promise<MongoClient>;

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        const client = new MongoClient(uri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        });
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      const client = new MongoClient(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });
      clientPromise = client.connect();
    }

    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB || "skysourcing";
    cachedDb = client.db(dbName);
    return cachedDb;
  } catch (error) {
    console.warn("[StorageService] Could not connect to MongoDB Atlas, using local JSON storage:", error);
    return null;
  }
}

function ensureDirectoryExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Read-only filesystem in serverless environments (e.g. Vercel)
  }
}

// Local filesystem helpers
function getLocalProducts(): Product[] {
  try {
    ensureDirectoryExists();
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore read/write failures on serverless
  }
  return SEED_PRODUCTS;
}

function saveLocalProduct(product: Product): Product {
  try {
    ensureDirectoryExists();
    const products = getLocalProducts();
    const index = products.findIndex((p) => p.id === product.id || p.sourceOfferId === product.sourceOfferId);
    if (index >= 0) {
      products[index] = { ...products[index], ...product };
    } else {
      products.unshift(product);
    }
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch {
    // Ignore read-only errors
  }
  return product;
}

function getLocalOrders(): Order[] {
  try {
    ensureDirectoryExists();
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore read/write failures on serverless
  }
  return SEED_ORDERS;
}

function saveLocalOrder(order: Order): Order {
  try {
    ensureDirectoryExists();
    const orders = getLocalOrders();
    const index = orders.findIndex((o) => o.id === order.id || o.orderNumber === order.orderNumber);
    if (index >= 0) {
      orders[index] = { ...orders[index], ...order };
    } else {
      orders.unshift(order);
    }
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch {
    // Ignore read-only errors
  }
  return order;
}

function getLocalSettings(): GlobalSettings {
  try {
    ensureDirectoryExists();
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch {
    // Ignore read/write failures on serverless
  }
  return DEFAULT_SETTINGS;
}

function saveLocalSettings(settings: GlobalSettings): GlobalSettings {
  try {
    ensureDirectoryExists();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  } catch {
    // Ignore read-only errors
  }
  return settings;
}

export class StorageService {
  // PRODUCTS
  static async getProducts(): Promise<Product[]> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Product>("products");
        const docs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
        return docs as Product[];
      } catch (err) {
        console.error("[StorageService] Error fetching products from MongoDB:", err);
      }
    }
    return getLocalProducts();
  }

  static async getProductById(id: string): Promise<Product | null> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Product>("products");
        const doc = await col.findOne(
          { $or: [{ id }, { sourceOfferId: id }] as any },
          { projection: { _id: 0 } }
        );
        if (doc) return doc as Product;
      } catch (err) {
        console.error("[StorageService] Error fetching product by ID from MongoDB:", err);
      }
    }
    const local = getLocalProducts();
    return local.find((p) => p.id === id || p.sourceOfferId === id) || null;
  }

  static async saveProduct(product: Product): Promise<Product> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Product>("products");
        await col.updateOne(
          { id: product.id },
          { $set: product },
          { upsert: true }
        );
        return product;
      } catch (err) {
        console.error("[StorageService] Error saving product to MongoDB:", err);
      }
    }
    return saveLocalProduct(product);
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Product>("products");
        const res = await col.deleteOne({ $or: [{ id }, { sourceOfferId: id }] as any });
        return res.deletedCount > 0;
      } catch (err) {
        console.error("[StorageService] Error deleting product from MongoDB:", err);
      }
    }
    try {
      ensureDirectoryExists();
      const products = getLocalProducts().filter((p) => p.id !== id && p.sourceOfferId !== id);
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      return true;
    } catch {
      return false;
    }
  }

  // ORDERS
  static async getOrders(): Promise<Order[]> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Order>("orders");
        const count = await col.countDocuments();
        if (count === 0) {
          // Auto-seed cloud database
          await col.insertMany(SEED_ORDERS as any);
          return SEED_ORDERS;
        }
        const docs = await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
        return docs as Order[];
      } catch (err) {
        console.error("[StorageService] Error fetching orders from MongoDB:", err);
      }
    }
    return getLocalOrders();
  }

  static async getOrderById(id: string): Promise<Order | null> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Order>("orders");
        const doc = await col.findOne(
          { $or: [{ id }, { orderNumber: id }] as any },
          { projection: { _id: 0 } }
        );
        if (doc) return doc as Order;
      } catch (err) {
        console.error("[StorageService] Error fetching order by ID from MongoDB:", err);
      }
    }
    const local = getLocalOrders();
    return local.find((o) => o.id === id || o.orderNumber === id) || null;
  }

  static async saveOrder(order: Order): Promise<Order> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Order>("orders");
        await col.updateOne(
          { id: order.id },
          { $set: order },
          { upsert: true }
        );
        return order;
      } catch (err) {
        console.error("[StorageService] Error saving order to MongoDB:", err);
      }
    }
    return saveLocalOrder(order);
  }

  static async deleteOrder(id: string): Promise<boolean> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<Order>("orders");
        const res = await col.deleteOne({ $or: [{ id }, { orderNumber: id }] as any });
        return res.deletedCount > 0;
      } catch (err) {
        console.error("[StorageService] Error deleting order from MongoDB:", err);
      }
    }
    try {
      ensureDirectoryExists();
      const orders = getLocalOrders().filter((o) => o.id !== id && o.orderNumber !== id);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
      return true;
    } catch {
      return false;
    }
  }

  // SETTINGS
  static async getSettings(): Promise<GlobalSettings> {
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<GlobalSettings>("settings");
        const doc = await col.findOne({}, { projection: { _id: 0 } });
        if (doc) {
          // Merge with DEFAULT_SETTINGS to ensure all fields exist
          return { ...DEFAULT_SETTINGS, ...doc } as GlobalSettings;
        }
        // Auto-seed settings
        await col.insertOne(DEFAULT_SETTINGS as any);
        return DEFAULT_SETTINGS;
      } catch (err) {
        console.error("[StorageService] Error fetching settings from MongoDB:", err);
      }
    }
    const local = getLocalSettings();
    return { ...DEFAULT_SETTINGS, ...local };
  }

  static async saveSettings(settings: GlobalSettings): Promise<GlobalSettings> {
    const merged = { ...DEFAULT_SETTINGS, ...settings };
    const db = await getMongoDb();
    if (db) {
      try {
        const col = db.collection<GlobalSettings>("settings");
        await col.replaceOne({}, merged, { upsert: true });
        return merged;
      } catch (err) {
        console.error("[StorageService] Error saving settings to MongoDB:", err);
      }
    }
    return saveLocalSettings(merged);
  }
}

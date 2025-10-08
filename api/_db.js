const { MongoClient } = require("mongodb");

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔗 Connecting to MongoDB...");

    const client = new MongoClient(MONGODB_URI, {
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await client.connect();
    const db = client.db("test");

    // Create indexes for better performance (only if not exists)
    try {
      await db.collection("transactions").createIndex({ date: -1 });
      await db.collection("transactions").createIndex({ crypto: 1 });
      await db.collection("transactions").createIndex({ type: 1 });
    } catch (indexError) {
      // Indexes might already exist, ignore error
      console.log(
        "Indexes already exist or failed to create:",
        indexError.message
      );
    }

    cachedDb = db;
    console.log("✅ Connected to MongoDB successfully");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

module.exports = { connectToDatabase };

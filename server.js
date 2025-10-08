const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/crypto-tracker";
let db;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("./")); // Serve static files from current directory

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log("🔗 Attempting to connect to MongoDB...");
    console.log(
      "📍 Connection URI:",
      MONGODB_URI.replace(/\/\/.*@/, "//***:***@")
    );

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log("✅ Connected to MongoDB successfully");

    // Create indexes for better performance
    await db.collection("transactions").createIndex({ date: -1 });
    await db.collection("transactions").createIndex({ crypto: 1 });
    await db.collection("transactions").createIndex({ type: 1 });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.log("\n📋 Setup Instructions:");
    console.log(
      "1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    );
    console.log(
      "2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas"
    );
    console.log("3. Update MONGODB_URI in .env file");
    console.log("4. See setup.md for detailed instructions\n");
    process.exit(1);
  }
}

// API Routes

// GET /api/transactions - Get all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ date: 1, _id: 1 }) // Sort by date, then by insertion order
      .toArray();

    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch transactions",
    });
  }
});

// POST /api/transactions - Create new transaction
app.post("/api/transactions", async (req, res) => {
  try {
    const { date, type, crypto, amount, price, fees } = req.body;

    // Validate required fields
    if (!date || !type || !crypto || !amount || !price) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Validate data types
    if (isNaN(amount) || isNaN(price) || amount <= 0 || price <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount and price must be positive numbers",
      });
    }

    if (!["BUY", "SELL"].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: "Type must be BUY or SELL",
      });
    }

    // Calculate derived fields
    const totalValue = parseFloat(amount) * parseFloat(price);
    const transactionFees = parseFloat(fees) || 0;
    const netAmount =
      type.toUpperCase() === "BUY"
        ? totalValue + transactionFees
        : totalValue - transactionFees;

    const transaction = {
      date,
      type: type.toUpperCase(),
      crypto: crypto.toUpperCase(),
      amount: parseFloat(amount),
      price: parseFloat(price),
      totalValue,
      fees: transactionFees,
      netAmount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("transactions").insertOne(transaction);

    res.status(201).json({
      success: true,
      data: { ...transaction, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create transaction",
    });
  }
});

// PUT /api/transactions/:id - Update transaction
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, type, crypto, amount, price, fees } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid transaction ID",
      });
    }

    const totalValue = parseFloat(amount) * parseFloat(price);
    const transactionFees = parseFloat(fees) || 0;
    const netAmount =
      type.toUpperCase() === "BUY"
        ? totalValue + transactionFees
        : totalValue - transactionFees;

    const updateData = {
      date,
      type: type.toUpperCase(),
      crypto: crypto.toUpperCase(),
      amount: parseFloat(amount),
      price: parseFloat(price),
      totalValue,
      fees: transactionFees,
      netAmount,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("transactions")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: { _id: id, ...updateData },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update transaction",
    });
  }
});

// DELETE /api/transactions/:id - Delete transaction
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid transaction ID",
      });
    }

    const result = await db.collection("transactions").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Transaction not found",
      });
    }

    res.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete transaction",
    });
  }
});

// GET /api/statistics - Get portfolio statistics
app.get("/api/statistics", async (req, res) => {
  try {
    const transactions = await db
      .collection("transactions")
      .find({})
      .sort({ date: 1, _id: 1 })
      .toArray();

    // Calculate statistics
    let totalInvested = 0;
    let totalProceeds = 0;
    let totalFees = 0;
    const cryptoBalances = {};

    transactions.forEach((tx) => {
      totalFees += tx.fees;

      if (tx.type === "BUY") {
        totalInvested += tx.totalValue;
      } else {
        totalProceeds += tx.totalValue;
      }

      // Track balances
      if (!cryptoBalances[tx.crypto]) {
        cryptoBalances[tx.crypto] = 0;
      }

      if (tx.type === "BUY") {
        cryptoBalances[tx.crypto] += tx.amount;
      } else {
        cryptoBalances[tx.crypto] -= tx.amount;
      }
    });

    const realizedPL = totalProceeds - totalInvested - totalFees;

    res.json({
      success: true,
      data: {
        totalInvested,
        totalProceeds,
        totalFees,
        realizedPL,
        totalTransactions: transactions.length,
        cryptoBalances,
        lastUpdate: new Date(),
      },
    });
  } catch (error) {
    console.error("Error calculating statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate statistics",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Crypto Trading Tracker API is running",
    timestamp: new Date(),
    mongodb: db ? "connected" : "disconnected",
  });
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Crypto Trading Tracker is ready!`);
      console.log(`🔗 Open http://localhost:${PORT} in your browser`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});

startServer();

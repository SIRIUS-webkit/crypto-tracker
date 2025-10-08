const { connectToDatabase } = require("./_db");
const { ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const db = await connectToDatabase();

    if (req.method === "GET") {
      // GET /api/transactions - Get all transactions
      const transactions = await db
        .collection("transactions")
        .find({})
        .sort({ date: 1, _id: 1 }) // Sort by date, then by insertion order
        .toArray();

      return res.status(200).json({
        success: true,
        data: transactions,
      });
    }

    if (req.method === "POST") {
      // POST /api/transactions - Create new transaction
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

      return res.status(201).json({
        success: true,
        data: { ...transaction, _id: result.insertedId },
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  } catch (error) {
    console.error("Transaction API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

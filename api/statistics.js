const { connectToDatabase } = require("./_db");

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

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  try {
    const db = await connectToDatabase();

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

    res.status(200).json({
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
    console.error("Statistics API error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to calculate statistics",
    });
  }
};

const { connectToDatabase } = require("../_db");
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
    const { id } = req.query;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid transaction ID",
      });
    }

    if (req.method === "PUT") {
      // PUT /api/transactions/[id] - Update transaction
      const { date, type, crypto, amount, price, fees } = req.body;

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

      return res.status(200).json({
        success: true,
        data: { _id: id, ...updateData },
      });
    }

    if (req.method === "DELETE") {
      // DELETE /api/transactions/[id] - Delete transaction
      const result = await db.collection("transactions").deleteOne({
        _id: new ObjectId(id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
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

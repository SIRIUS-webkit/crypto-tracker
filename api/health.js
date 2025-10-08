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

    res.status(200).json({
      success: true,
      message: "Crypto Trading Tracker API is running on Vercel",
      timestamp: new Date(),
      mongodb: db ? "connected" : "disconnected",
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      success: false,
      error: "Database connection failed",
      mongodb: "disconnected",
    });
  }
};

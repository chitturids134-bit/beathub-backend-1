require("dotenv").config();
const app = require("../app");
const { connectToDatabase } = require("../config/database");

let isDbReady = false;

module.exports = async (req, res) => {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    if (!isDbReady) {
      await connectToDatabase(process.env.MONGO_URI);
      isDbReady = true;
    }

    return app(req, res);
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

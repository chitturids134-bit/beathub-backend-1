const mongoose = require("mongoose");

let cachedConnection = null;
let cachedConnectionPromise = null;

const connectToDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined.");
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedConnectionPromise) {
    const serverSelectionTimeoutMS = Number.parseInt(
      process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || "5000",
      10,
    );

    cachedConnectionPromise = mongoose
      .connect(mongoUri, { serverSelectionTimeoutMS })
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  cachedConnection = await cachedConnectionPromise;
  return cachedConnection;
};

module.exports = { connectToDatabase };

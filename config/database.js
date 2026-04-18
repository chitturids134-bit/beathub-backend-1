const mongoose = require("mongoose");

let cachedConnection = null;
let cachedConnectionPromise = null;

const normalizeMongoUri = (mongoUri) => {
  try {
    const parsedUri = new URL(mongoUri);
    const dbNameFromLegacyParam = parsedUri.searchParams.get("db_name");

    if (dbNameFromLegacyParam) {
      // Support legacy db_name while keeping compatibility with MongoDB driver options.
      if (!parsedUri.pathname || parsedUri.pathname === "/") {
        parsedUri.pathname = `/${dbNameFromLegacyParam}`;
      }
      parsedUri.searchParams.delete("db_name");
    }

    return parsedUri.toString();
  } catch (_error) {
    return mongoUri;
  }
};

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
    const normalizedMongoUri = normalizeMongoUri(mongoUri);

    cachedConnectionPromise = mongoose
      .connect(normalizedMongoUri, { serverSelectionTimeoutMS })
      .then((mongooseInstance) => mongooseInstance.connection);

    cachedConnectionPromise = cachedConnectionPromise.catch((error) => {
      cachedConnectionPromise = null;
      throw error;
    });
  }

  cachedConnection = await cachedConnectionPromise;
  return cachedConnection;
};

module.exports = { connectToDatabase };

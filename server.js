require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const { connectToDatabase } = require("./config/database");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

let server;

connectToDatabase(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

const shutdown = async (signal) => {
  try {
    console.log(`Received ${signal}. Shutting down gracefully...`);

    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await mongoose.connection.close(false);
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

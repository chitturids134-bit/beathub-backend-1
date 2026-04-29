// server.js
// Main entry point for BeatHub backend with OpenTelemetry instrumentation

// --- Load environment variables ---
require("dotenv").config();

// --- OpenTelemetry Instrumentation ---
require("./otel-instrumentation");

// --- Database Connection ---
require("./src/config/database");

// --- Express App ---
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BeatHub backend listening on port ${PORT}`);
});

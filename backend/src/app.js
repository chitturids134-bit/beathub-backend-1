const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();

// Root route for Render health and basic check
app.get("/", (req, res) => {
  res.send("BeatHub backend is running!");
});

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

module.exports = app;

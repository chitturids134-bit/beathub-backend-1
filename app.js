require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");

const songsRouter = require("./routes/songs");
const authRouter = require("./routes/auth");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 5000;
const FRONTEND_URLS = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const PUBLIC_API_URL = process.env.PUBLIC_API_URL || `http://localhost:${PORT}`;
const RATE_LIMIT_WINDOW_MINUTES = Number.parseInt(
  process.env.RATE_LIMIT_WINDOW_MINUTES || "15",
  10,
);
const RATE_LIMIT_MAX = Number.parseInt(process.env.RATE_LIMIT_MAX || "20", 10);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(compression());
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

const globalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: RATE_LIMIT_MAX,
  message: `Too many requests from this IP, please try again after ${RATE_LIMIT_WINDOW_MINUTES} minutes.`,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: `Too many requests from this IP, please try again after ${RATE_LIMIT_WINDOW_MINUTES} minutes.`,
    });
  },
});
app.use(globalLimiter);

app.use(express.json({ limit: "10kb" }));
app.use((req, _res, next) => {
  // Express 5 exposes req.query as a getter-only property, so sanitize in place.
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.headers) mongoSanitize.sanitize(req.headers);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

const allowedOrigins =
  NODE_ENV === "production"
    ? FRONTEND_URLS
    : ["http://localhost:3000", ...FRONTEND_URLS];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"), false);
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", environment: NODE_ENV });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "BeatHub Backend API",
    health: "/health",
    apiUrl: PUBLIC_API_URL || null,
  });
});

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/api/auth", authRouter);
app.use("/api", songsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message =
    NODE_ENV === "production" && statusCode === 500
      ? "Internal server error"
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
});

module.exports = app;

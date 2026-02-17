const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Sample API routes
app.get("/api/info", (req, res) => {
  res.json({
    app: "webapp-backend",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    hostname: require("os").hostname(),
  });
});

app.get("/api/items", (req, res) => {
  res.json([
    { id: 1, name: "Item One", description: "First sample item" },
    { id: 2, name: "Item Two", description: "Second sample item" },
    { id: 3, name: "Item Three", description: "Third sample item" },
  ]);
});

app.post("/api/items", (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  res.status(201).json({
    id: Date.now(),
    name,
    description: description || "",
    createdAt: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});

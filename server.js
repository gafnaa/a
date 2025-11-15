const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist (Vite build) in production, public in development
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
} else {
  app.use(express.static("public"));
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://your-connection-string", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/questionnaire", require("./routes/questionnaire"));
app.use("/api/products", require("./routes/products"));
app.use("/api/recommendations", require("./routes/recommendations"));

// ML Prediction Route
app.post("/predict", async (req, res) => {
  try {
    const mlServiceUrl = "http://localhost:5001/predict";
    const response = await axios.post(mlServiceUrl, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error calling Flask ML service:",
      error.response ? error.response.data : error.message
    );
    res.status(error.response ? error.response.status : 500).json({
      error: "Failed to get prediction from ML service",
      details: error.response ? error.response.data : error.message,
    });
  }
});

// Serve frontend (catch-all for SPA routing)
// This should be last, after all API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  // Serve from dist in production, public in development
  const indexPath =
    process.env.NODE_ENV === "production"
      ? path.join(__dirname, "dist", "index.html")
      : path.join(__dirname, "public", "index.html");
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

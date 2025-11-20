const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products with filters
router.get("/", async (req, res) => {
  try {
    const { category, featured, planType, search } = req.query;
    let query = {};

    // Filter by Category
    if (category && category !== "all") {
      // Case-insensitive matching untuk category
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Filter by Plan Type (Prepaid/Postpaid)
    if (planType && planType !== "all") {
      query.planType = planType;
    }

    // Filter by Featured status
    if (featured === "true") {
      query.isFeatured = true;
    }

    // Simple Search by Name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single product (Tetap sama)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get related products (Update: pakai planType yang sama)
router.get("/related/:category", async (req, res) => {
  // ... (biarkan logic related sederhana dulu)
  try {
    const products = await Product.find({
      category: req.params.category,
    }).limit(4);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

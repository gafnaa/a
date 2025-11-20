const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

// Middleware Verify Token (Sama seperti sebelumnya)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// GET USER RECOMMENDATIONS BASED ON AI PREDICTION
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // 1. Cek apakah user punya history rekomendasi
    if (!user.recommendations || user.recommendations.length === 0) {
      // Jika belum ada, kembalikan produk featured umum
      const defaultProducts = await Product.find({ isFeatured: true }).limit(3);
      return res.json({
        success: true,
        prediction: "Belum Ada Data",
        products: defaultProducts,
      });
    }

    // 2. Ambil prediksi TERBARU (paling akhir di array)
    // Pastikan kita mengambil elemen terakhir
    const latestRec = user.recommendations[user.recommendations.length - 1];
    const predictionTag = latestRec.offerName; // e.g., "Device Upgrade Offer"

    console.log(`🔍 Finding products for tag: ${predictionTag}`);

    // 3. Cari produk yang sesuai tag tersebut
    let products = await Product.find({
      recommendationTag: predictionTag,
    }).limit(6);

    // Fallback: Jika tidak ada produk dengan tag itu, ambil general featured
    if (products.length === 0) {
      products = await Product.find({ isFeatured: true }).limit(6);
    }

    res.json({
      success: true,
      prediction: predictionTag,
      products: products,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get related products (Opsional, sesuaikan dengan kategori baru)
router.get("/related/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(6);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

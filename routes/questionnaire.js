const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Pastikan install: npm install axios

// Middleware to verify token (Tetap sama)
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

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

// Submit questionnaire
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const questionnaireData = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 1. Simpan data kuesioner mentah ke user
    user.questionnaireData = questionnaireData;
    user.updatedAt = new Date();

    // 2. Kirim data ke Flask API (ML Model) untuk prediksi
    let mlPrediction = "General Offer"; // Default fallback

    try {
      // Asumsi Flask jalan di port 5001
      const flaskResponse = await axios.post(
        "http://127.0.0.1:5001/predict",
        questionnaireData
      );

      if (flaskResponse.data && flaskResponse.data.predicted_offer) {
        mlPrediction = flaskResponse.data.predicted_offer;
        console.log("ML Prediction Success:", mlPrediction);
      }
    } catch (flaskError) {
      console.error("Error calling Flask ML Service:", flaskError.message);
      // Kita tidak return error ke user, tapi tetap lanjut dengan default/fallback
      // agar flow user tidak macet hanya karena server ML down.
    }

    // 3. Simpan hasil prediksi ke database user
    // Sesuaikan struktur ini dengan Schema MongoDB kamu.
    // Jika field 'recommendations' bertipe Array, kita bungkus dalam array.
    user.recommendations = [
      {
        category: "AI_RECOMMENDATION",
        offer_name: mlPrediction,
        score: 1.0, // Skor prioritas tertinggi karena dari AI
        generated_at: new Date(),
      },
    ];

    await user.save();

    res.json({
      success: true,
      message: "Questionnaire processed successfully",
      recommendations: user.recommendations,
    });
  } catch (error) {
    console.error("Questionnaire submission error:", error);
    res
      .status(500)
      .json({ error: "Server error during questionnaire submission" });
  }
});

// Get questionnaire data (Tetap sama)
router.get("/data", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      questionnaireData: user.questionnaireData,
      recommendations: user.recommendations,
    });
  } catch (error) {
    console.error("Get questionnaire error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

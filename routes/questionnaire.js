const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const FLASK_API_URL = "http://127.0.0.1:5001/predict";

// --- MIDDLEWARE: Verify Token ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token tidak valid." });
  }
};

// --- ROUTE: SUBMIT QUESTIONNAIRE ---
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const rawData = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User tidak ditemukan." });

    // Mapping data dari Frontend (snake_case) ke Schema (camelCase)
    user.questionnaireData = {
      planType: rawData.plan_type,
      deviceBrand: rawData.device_brand,
      internetUsage: rawData.internet_usage,
      streamingFreq: rawData.streaming_freq,
      callUsage: rawData.call_usage,
      smsUsage: rawData.sms_usage,
      budget: rawData.budget,
      travelFreq: rawData.travel_freq,
      vodInterest: rawData.vod_interest === "true",
    };

    // Integrasi ke Flask ML
    let predictionResult = "General Offer";
    try {
      const flaskResponse = await axios.post(FLASK_API_URL, rawData);
      if (flaskResponse.data && flaskResponse.data.predicted_offer) {
        predictionResult = flaskResponse.data.predicted_offer;
        console.log(`✅ AI Prediction: ${predictionResult}`);
      }
    } catch (aiError) {
      console.error("⚠️ Gagal menghubungi ML Service:", aiError.message);
    }

    user.recommendations.push({
      offerName: predictionResult,
      predictedAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      message: "Data berhasil disimpan.",
      prediction: predictionResult,
    });
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// --- ROUTE: GET DASHBOARD DATA ---
router.get("/data", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "fullName phoneNumber createdAt questionnaireData recommendations"
    );

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // PERBAIKAN DISINI: Menggunakan 'fullName' dan 'phoneNumber' agar cocok dengan Frontend
    res.json({
      success: true,
      user: {
        fullName: user.fullName, // Dulu: name
        phoneNumber: user.phoneNumber, // Dulu: phone
        createdAt: user.createdAt,
      },
      questionnaireData: user.questionnaireData,
      recommendations: user.recommendations.sort(
        (a, b) => b.predictedAt - a.predictedAt
      ),
    });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

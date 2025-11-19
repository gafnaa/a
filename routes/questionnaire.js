const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// URL Flask API (Sesuaikan jika port berbeda)
const FLASK_API_URL = "http://127.0.0.1:5001/predict";

// --- MIDDLEWARE: Verify Token ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

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
// Menerima data dari form HTML, menyimpan ke DB, dan meminta prediksi ke Flask
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const rawData = req.body; // Data mentah dari frontend (snake_case)

    // 1. Cari User
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan." });
    }

    // 2. Mapping Data: Frontend (snake_case) -> MongoDB Schema (camelCase)
    // Ini PENTING karena di User.js kita pakai camelCase
    user.questionnaireData = {
      planType: rawData.plan_type,
      deviceBrand: rawData.device_brand,
      internetUsage: rawData.internet_usage,
      streamingFreq: rawData.streaming_freq,
      callUsage: rawData.call_usage,
      smsUsage: rawData.sms_usage,
      budget: rawData.budget,
      travelFreq: rawData.travel_freq,
      vodInterest: rawData.vod_interest === "true", // Konversi string ke boolean jika perlu
    };

    // 3. Integrasi AI: Kirim data ke Flask
    let predictionResult = "General Offer"; // Default fallback jika Flask mati

    try {
      // Kita kirim 'rawData' karena Flask app.py sudah disetting menerima snake_case
      // (seperti 'plan_type', 'internet_usage')
      const flaskResponse = await axios.post(FLASK_API_URL, rawData);

      if (flaskResponse.data && flaskResponse.data.predicted_offer) {
        predictionResult = flaskResponse.data.predicted_offer;
        console.log(`✅ AI Prediction Success: ${predictionResult}`);
      }
    } catch (aiError) {
      console.error(
        "⚠️ Gagal menghubungi Service Flask (ML):",
        aiError.message
      );
      // Lanjut tetap simpan data user walau AI error, biar UX tidak macet
    }

    // 4. Simpan Prediksi ke History User
    // Sesuai schema User.js yang baru: recommendations[{ offerName, predictedAt }]
    user.recommendations.push({
      offerName: predictionResult,
      predictedAt: new Date(),
    });

    // 5. Simpan Perubahan ke Database
    await user.save();

    // 6. Kirim Respon ke Frontend
    res.json({
      success: true,
      message: "Data berhasil disimpan & dianalisis.",
      prediction: predictionResult,
    });
  } catch (error) {
    console.error("Error submitting questionnaire:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

// --- ROUTE: GET DASHBOARD DATA ---
// Mengambil data user, questionnaire, dan history rekomendasi
router.get("/data", verifyToken, async (req, res) => {
  try {
    // Cari user by ID
    // Kita select field tertentu saja untuk keamanan & efisiensi
    const user = await User.findById(req.userId).select(
      "fullName phoneNumber createdAt questionnaireData recommendations"
    );

    if (!user) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    // Sort rekomendasi biar yang paling baru muncul duluan di array (optional logic)
    const sortedRecs = user.recommendations.sort(
      (a, b) => b.predictedAt - a.predictedAt
    );

    res.json({
      success: true,
      // Data User (Untuk Header Dashboard)
      user: {
        name: user.fullName,
        phone: user.phoneNumber,
        createdAt: user.createdAt,
      },
      // Data Kuesioner (Untuk Grid Dashboard)
      questionnaireData: user.questionnaireData,
      // Data Rekomendasi (Untuk Logic Frontend selanjutnya jika butuh)
      recommendations: sortedRecs,
    });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

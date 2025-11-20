const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Data Kuesioner (Struktur disesuaikan dengan Input HTML & Dataset)
    questionnaireData: {
      planType: {
        type: String,
        enum: ["Prepaid", "Postpaid"],
        default: "Prepaid",
      },
      deviceBrand: {
        type: String,
        // Tidak di-enum strict supaya jika user pilih 'Other' atau brand baru tidak error
        default: "Other",
      },
      internetUsage: {
        type: String,
        enum: ["light", "medium", "heavy", "extreme"], // < 1GB, 1-3GB, 3-5GB, > 5GB
      },
      streamingFreq: {
        type: String,
        enum: ["rarely", "sometimes", "often"],
      },
      callUsage: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      smsUsage: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      budget: {
        type: String,
        enum: ["economy", "standard", "premium", "vip"], // Sesuai HTML value
      },
      travelFreq: {
        type: String,
        enum: ["never", "occasionally", "frequently"],
      },
    },
    // Menyimpan hasil prediksi AI (Simple String)
    recommendations: [
      {
        offerName: { type: String }, // e.g., "Device Upgrade Offer"
        predictedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  // Kategori umum untuk filtering di UI (Frontend)
  category: {
    type: String,
    required: true,
    enum: ["Internet", "Voice", "SMS", "Bundle", "Device", "Add-on"],
  },
  // Tipe pembayaran (Sesuai Dataset: Prepaid/Postpaid)
  planType: {
    type: String,
    enum: ["Prepaid", "Postpaid", "Universal"], // Universal = bisa keduanya
    default: "Prepaid",
  },
  // PENTING: Label ini harus cocok dengan output Model ML (Flask)
  // Contoh value: 'General Offer', 'Device Upgrade Offer', 'Top-up Promo', 'Premium Plan Upgrade'
  recommendationTag: {
    type: String,
    required: false,
    index: true, // Supaya query rekomendasi cepat
  },
  price: {
    type: Number,
    required: true,
  },
  // Detail spesifikasi paket (biar rapi)
  details: {
    dataAllowance: { type: String, default: "0 GB" }, // e.g. "15 GB"
    voiceMinutes: { type: String, default: "0 Mins" }, // e.g. "100 Mins"
    smsCount: { type: String, default: "0 SMS" }, // e.g. "50 SMS"
    networkSpeed: { type: String, default: "4G/5G" },
  },
  features: [
    {
      type: String, // List fitur poin per poin
    },
  ],
  validity: {
    type: String,
    default: "30 days",
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/400x300",
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);

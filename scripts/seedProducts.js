const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const sampleProducts = [
  // --- Kategori: PREPAID / GENERAL OFFER ---
  {
    name: "Freedom Internet 10GB",
    description:
      "Paket internet harian yang pas untuk browsing ringan dan chat.",
    category: "Internet",
    planType: "Prepaid",
    recommendationTag: "General Offer", // Cocokkan dengan output Flask
    price: 25000,
    details: {
      dataAllowance: "10 GB",
      voiceMinutes: "0 Mins",
      smsCount: "0 SMS",
      networkSpeed: "4G",
    },
    features: ["Full Kuota 24 Jam", "Masa Aktif 30 Hari", "Data Rollover"],
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
  // --- Kategori: POSTPAID / PREMIUM UPGRADE ---
  {
    name: "Halo Unlimited Sultan",
    description:
      "Layanan pascabayar prioritas dengan akses streaming tanpa batas.",
    category: "Internet",
    planType: "Postpaid",
    recommendationTag: "Premium Plan Upgrade", // Cocokkan dengan output Flask
    price: 150000,
    details: {
      dataAllowance: "80 GB",
      voiceMinutes: "500 Mins",
      smsCount: "500 SMS",
      networkSpeed: "5G",
    },
    features: [
      "Prioritas Jaringan",
      "Akses Netflix & Disney+",
      "Roaming Gratis",
    ],
    image:
      "https://images.unsplash.com/photo-1512428559087-560fa0db7f5c?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
  // --- Kategori: DEVICE BUNDLING ---
  {
    name: "iPhone 15 Pro Bundling",
    description:
      "Dapatkan iPhone terbaru dengan cicilan ringan dan paket data besar.",
    category: "Bundle",
    planType: "Postpaid",
    recommendationTag: "Device Upgrade Offer", // Cocokkan dengan output Flask
    price: 999000, // Cicilan per bulan
    details: {
      dataAllowance: "100 GB",
      voiceMinutes: "Unlimited",
      smsCount: "Unlimited",
      networkSpeed: "5G",
    },
    features: ["Kontrak 24 Bulan", "Device Protection", "VIP Number"],
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80",
    isFeatured: true,
  },
  // --- Kategori: TOP UP PROMO ---
  {
    name: "Combo Sakti 30GB",
    description: "Penawaran spesial isi ulang untuk pelanggan setia.",
    category: "Bundle",
    planType: "Prepaid",
    recommendationTag: "Top-up Promo", // Cocokkan dengan output Flask
    price: 60000,
    details: {
      dataAllowance: "30 GB",
      voiceMinutes: "100 Mins",
      smsCount: "200 SMS",
      networkSpeed: "4G/5G",
    },
    features: ["Harga Spesial", "Bonus Kuota TikTok", "Masa Aktif 30 Hari"],
    image:
      "https://images.unsplash.com/photo-1562869272-42e46f60e058?auto=format&fit=crop&w=400&q=80",
    isFeatured: false,
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    console.log("🧹 Cleared existing products");

    await Product.insertMany(sampleProducts);
    console.log(`🌱 Successfully seeded ${sampleProducts.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();

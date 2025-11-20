const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

// Function to generate a random phone number
function generatePhoneNumber() {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  let phoneNumber = firstDigit.toString();
  for (let i = 0; i < 9; i++) {
    phoneNumber += Math.floor(Math.random() * 10);
  }
  return phoneNumber;
}

// Function to generate random questionnaire data matching the NEW User Schema
function generateQuestionnaireData() {
  // Enums sesuai User.js
  const planTypes = ["Prepaid", "Postpaid"];
  const deviceBrands = [
    "Apple",
    "Samsung",
    "Oppo",
    "Vivo",
    "Xiaomi",
    "Realme",
    "Huawei",
    "Other",
  ];
  const internetUsageOptions = ["light", "medium", "heavy", "extreme"];
  const streamingFreqOptions = ["rarely", "sometimes", "often"];
  const usageLevels = ["low", "medium", "high"]; // Untuk call & sms
  const budgetOptions = ["economy", "standard", "premium", "vip"];
  const travelFreqOptions = ["never", "occasionally", "frequently"];

  // Helper random picker
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    planType: pick(planTypes),
    deviceBrand: pick(deviceBrands),
    internetUsage: pick(internetUsageOptions),
    streamingFreq: pick(streamingFreqOptions),
    callUsage: pick(usageLevels),
    smsUsage: pick(usageLevels),
    budget: pick(budgetOptions),
    travelFreq: pick(travelFreqOptions),
    // vodInterest dihapus dari User.js schema, tapi jika masih ada di Flask logic
    // bisa ditambahkan jika schema User.js Anda mengizinkan 'strict: false' atau field tersebut ada.
    // Untuk keamanan, kita ikuti schema User.js yang ketat.
  };
}

const sampleUsers = [];
const numberOfUsersToSeed = 10;

for (let i = 0; i < numberOfUsersToSeed; i++) {
  sampleUsers.push({
    fullName: `User ${i + 1}`,
    phoneNumber: generatePhoneNumber(),
    questionnaireData: generateQuestionnaireData(),
    recommendations: [], // Kosongkan awal
  });
}

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    console.log("🧹 Cleared existing users");

    await User.insertMany(sampleUsers);
    console.log(`🌱 Successfully seeded ${sampleUsers.length} users`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();

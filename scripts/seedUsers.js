const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

// Function to generate a random phone number
function generatePhoneNumber() {
  // Generates a 10-digit phone number starting with a non-zero digit
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  let phoneNumber = firstDigit.toString();
  for (let i = 0; i < 9; i++) {
    phoneNumber += Math.floor(Math.random() * 10);
  }
  return phoneNumber;
}

// Function to generate a random username
function generateUsername() {
  const adjectives = ["quick", "lazy", "sleepy", "noisy", "hungry"];
  const nouns = ["fox", "dog", "wolf", "bear", "lion"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  return `${adjective}${noun}${randomNumber}`;
}

// Function to generate random questionnaire data
function generateQuestionnaireData() {
  const internetUsageOptions = ["low", "medium", "high", "very-high"];
  const streamingHabitsOptions = ["none", "occasional", "frequent", "daily"];
  const dataConsumptionOptions = ["minimal", "moderate", "heavy", "extreme"];
  const voiceUsageOptions = ["low", "medium", "high"];
  const smsUsageOptions = ["low", "medium", "high"];
  const budgetOptions = ["budget", "mid-range", "premium"];

  return {
    internetUsage:
      internetUsageOptions[
        Math.floor(Math.random() * internetUsageOptions.length)
      ],
    streamingHabits:
      streamingHabitsOptions[
        Math.floor(Math.random() * streamingHabitsOptions.length)
      ],
    dataConsumption:
      dataConsumptionOptions[
        Math.floor(Math.random() * dataConsumptionOptions.length)
      ],
    voiceUsage:
      voiceUsageOptions[Math.floor(Math.random() * voiceUsageOptions.length)],
    smsUsage:
      smsUsageOptions[Math.floor(Math.random() * smsUsageOptions.length)],
    vodInterest: Math.random() > 0.5,
    budget: budgetOptions[Math.floor(Math.random() * budgetOptions.length)],
  };
}

const sampleUsers = [];
const numberOfUsersToSeed = 10; // You can adjust this number

for (let i = 0; i < numberOfUsersToSeed; i++) {
  sampleUsers.push({
    fullName: `User ${i + 1}`, // Placeholder for full name
    phoneNumber: generatePhoneNumber(),
    username: generateUsername(), // Added username
    questionnaireData: generateQuestionnaireData(),
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

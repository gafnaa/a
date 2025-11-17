const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      // Added fullName as it's used in registration
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
    questionnaireData: {
      internetUsage: {
        type: String,
        enum: ["low", "medium", "high", "very-high"],
      },
      streamingHabits: {
        type: String,
        enum: ["none", "occasional", "frequent", "daily"],
      },
      dataConsumption: {
        type: String,
        enum: ["minimal", "moderate", "heavy", "extreme"],
      },
      voiceUsage: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      smsUsage: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      vodInterest: {
        type: Boolean,
        default: false,
      },
      budget: {
        type: String,
        enum: ["budget", "mid-range", "premium"],
      },
    },
    recommendations: [
      {
        category: String,
        score: Number,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Timestamps are now handled by the schema options
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now
    // }
  },
  { timestamps: true }
); // Add timestamps option

module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    timeRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    weightage: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);

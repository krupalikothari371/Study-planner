const mongoose = require("mongoose");

const selectedSubjectSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    timeRequired: {
      type: Number,
      required: true,
    },
    weightage: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    selectedSubjects: [selectedSubjectSchema],
    totalTime: {
      type: Number,
      required: true,
    },
    predictedScore: {
      type: Number,
      required: true,
    },
    aiSuggestion: {
      type: String,
      default: "",
    },
    explainSteps: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);

const Subject = require("../models/Subject");
const Plan = require("../models/Plan");
const { generateOptimalPlan } = require("../utils/planner");
const { runtimeStore, createId } = require("../utils/runtimeStore");
const { isMongoConnected } = require("../utils/dbMode");

const generatePlan = async (req, res) => {
  try {
    const { totalAvailableTime } = req.body;

    if (!totalAvailableTime || totalAvailableTime <= 0) {
      return res.status(400).json({ message: "totalAvailableTime must be greater than 0" });
    }

    let subjects;
    if (isMongoConnected()) {
      subjects = await Subject.find({ userId: req.user._id });
    } else {
      subjects = runtimeStore.subjects.filter((s) => s.userId === req.user._id);
    }
    if (!subjects.length) {
      return res.status(400).json({ message: "Please add subjects before generating a plan" });
    }

    const plainSubjects = subjects.map((s) => ({
      _id: s._id,
      name: s.name,
      difficulty: s.difficulty,
      timeRequired: s.timeRequired,
      weightage: s.weightage,
    }));

    const result = generateOptimalPlan(plainSubjects, Number(totalAvailableTime));

    let plan;
    if (isMongoConnected()) {
      plan = await Plan.create({
        userId: req.user._id,
        selectedSubjects: result.selectedSubjects.map((s) => ({
          subjectId: s._id,
          name: s.name,
          timeRequired: s.timeRequired,
          weightage: s.weightage,
        })),
        totalTime: Number(totalAvailableTime),
        predictedScore: result.predictedScore,
        aiSuggestion: result.aiSuggestion,
        explainSteps: result.explainSteps,
      });
    } else {
      plan = {
        _id: createId(),
        userId: req.user._id,
        selectedSubjects: result.selectedSubjects.map((s) => ({
          subjectId: s._id,
          name: s.name,
          timeRequired: s.timeRequired,
          weightage: s.weightage,
        })),
        totalTime: Number(totalAvailableTime),
        predictedScore: result.predictedScore,
        aiSuggestion: result.aiSuggestion,
        explainSteps: result.explainSteps,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      runtimeStore.plans.push(plan);
    }

    return res.status(201).json({
      planId: plan._id,
      ...result,
      totalTime: Number(totalAvailableTime),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { generatePlan };

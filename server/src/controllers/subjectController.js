const Subject = require("../models/Subject");
const { runtimeStore, createId } = require("../utils/runtimeStore");
const { isMongoConnected } = require("../utils/dbMode");

const getSubjects = async (req, res) => {
  try {
    let subjects;
    if (isMongoConnected()) {
      subjects = await Subject.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      subjects = runtimeStore.subjects
        .filter((s) => s.userId === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addSubject = async (req, res) => {
  try {
    const { name, difficulty, timeRequired, weightage } = req.body;

    if (!name || !timeRequired || !weightage) {
      return res.status(400).json({ message: "name, timeRequired and weightage are required" });
    }

    let subject;
    if (isMongoConnected()) {
      subject = await Subject.create({
        userId: req.user._id,
        name,
        difficulty: difficulty || "Medium",
        timeRequired,
        weightage,
      });
    } else {
      subject = {
        _id: createId(),
        userId: req.user._id,
        name,
        difficulty: difficulty || "Medium",
        timeRequired,
        weightage,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      runtimeStore.subjects.push(subject);
    }

    return res.status(201).json(subject);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    let subject;
    if (isMongoConnected()) {
      subject = await Subject.findOne({ _id: req.params.id, userId: req.user._id });
    } else {
      subject = runtimeStore.subjects.find((s) => s._id === req.params.id && s.userId === req.user._id);
    }

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const { name, difficulty, timeRequired, weightage } = req.body;
    subject.name = name ?? subject.name;
    subject.difficulty = difficulty ?? subject.difficulty;
    subject.timeRequired = timeRequired ?? subject.timeRequired;
    subject.weightage = weightage ?? subject.weightage;

    if (isMongoConnected()) {
      await subject.save();
    } else {
      subject.updatedAt = new Date();
    }
    return res.json(subject);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    let subject;
    if (isMongoConnected()) {
      subject = await Subject.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    } else {
      const index = runtimeStore.subjects.findIndex((s) => s._id === req.params.id && s.userId === req.user._id);
      if (index !== -1) {
        subject = runtimeStore.subjects[index];
        runtimeStore.subjects.splice(index, 1);
      }
    }

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.json({ message: "Subject deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubjects, addSubject, updateSubject, deleteSubject };

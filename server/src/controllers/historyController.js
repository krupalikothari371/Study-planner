const Plan = require("../models/Plan");
const { runtimeStore } = require("../utils/runtimeStore");
const { isMongoConnected } = require("../utils/dbMode");

const getHistory = async (req, res) => {
  try {
    let history;
    if (isMongoConnected()) {
      history = await Plan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    } else {
      history = runtimeStore.plans
        .filter((p) => p.userId === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return res.json(history);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getHistory };

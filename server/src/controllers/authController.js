const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { runtimeStore, createId } = require("../utils/runtimeStore");
const { isMongoConnected } = require("../utils/dbMode");

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existing;
    if (isMongoConnected()) {
      existing = await User.findOne({ email });
    } else {
      existing = runtimeStore.users.find((u) => u.email === email);
    }
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (isMongoConnected()) {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
      });
    } else {
      user = {
        _id: createId(),
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      runtimeStore.users.push(user);
    }

    return res.status(201).json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      user = runtimeStore.users.find((u) => u.email === email);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      token: createToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  return res.json(req.user);
};

const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let user;
    if (isMongoConnected()) {
      user = await User.findById(req.user._id);
    } else {
      user = runtimeStore.users.find((u) => u._id === req.user._id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    if (isMongoConnected()) {
      await user.save();
    } else {
      user.updatedAt = new Date();
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    let user;
    if (isMongoConnected()) {
      user = await User.findById(req.user._id);
    } else {
      user = runtimeStore.users.find((u) => u._id === req.user._id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    if (isMongoConnected()) {
      await user.save();
    } else {
      user.updatedAt = new Date();
    }

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { signup, login, getMe, updateProfile, changePassword };

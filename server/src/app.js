const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const historyRoutes = require("./routes/historyRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Optimal Study Plan Generator API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;

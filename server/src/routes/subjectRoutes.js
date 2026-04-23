const express = require("express");
const {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.route("/").get(getSubjects).post(addSubject);
router.route("/:id").put(updateSubject).delete(deleteSubject);

module.exports = router;

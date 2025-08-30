const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants");
const { auth, authorize } = require("../middlewares/authMiddleware");
const {
  createCourse,
  getCourses,
  getCourseById,
} = require("../controllers/courseController");

const subjectRoutes = require("./subjectRoutes");

// 🔹 All course routes require authentication
router.use(auth);

// 🔹 Course CRUD
router.post("/", authorize(ROLES.teacher, ROLES.admin), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);

// 🔹 Nested subject routes (e.g. /courses/:courseId/subjects/...)
router.use("/:courseId/subjects", subjectRoutes);

module.exports = router;

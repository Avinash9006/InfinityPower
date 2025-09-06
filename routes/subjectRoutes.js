const express = require("express");
const router = express.Router({ mergeParams: true }); // allows access to courseId from parent route
const { ROLES } = require("../constants");
const { auth, authorize } = require("../middlewares/authMiddleware");
const chapterRoutes = require("./chapterRoutes");
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// 🔹 Protect all subject routes
router.use(auth);

/**
 * @route   GET /courses/:courseId/subjects
 * @desc    Get all subjects for a course
 * @access  Authenticated
 */
router.get("/", getSubjects);

/**
 * @route   POST /courses/:courseId/subjects
 * @desc    Create a new subject under a course
 * @access  Teacher/Admin
 */
router.post("/", authorize(ROLES.teacher, ROLES.admin), createSubject);

/**
 * @route   GET /courses/:courseId/subjects/:id
 * @desc    Get a single subject by ID
 * @access  Authenticated
 */
router.get("/:id", getSubjectById);

/**
 * @route   PUT /courses/:courseId/subjects/:id
 * @desc    Update a subject
 * @access  Teacher/Admin
 */
router.put("/:id", authorize(ROLES.teacher, ROLES.admin), updateSubject);

/**
 * @route   DELETE /courses/:courseId/subjects/:id
 * @desc    Delete a subject
 * @access  Teacher/Admin
 */
router.delete("/:id", authorize(ROLES.teacher, ROLES.admin), deleteSubject);

/**
 * 🔹 Nested chapter routes
 * Example: /courses/:courseId/subjects/:subjectId/chapters/...
 */
router.use("/:subjectId/chapters", chapterRoutes);

module.exports = router;

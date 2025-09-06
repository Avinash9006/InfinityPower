const express = require("express");
const router = express.Router({ mergeParams: true }); // allows courseId & subjectId to flow
const { ROLES } = require("../constants");
const { auth, authorize } = require("../middlewares/authMiddleware");
const {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} = require("../controllers/chapterController");

// 🔹 Protect all chapter routes with authentication
router.use(auth);

/**
 * @route   GET /courses/:courseId/subjects/:subjectId/chapters
 * @desc    Get all chapters of a subject
 * @access  Authenticated
 */
router.get("/", getChapters);

/**
 * @route   POST /courses/:courseId/subjects/:subjectId/chapters
 * @desc    Create a new chapter under a subject
 * @access  Teacher/Admin
 */
router.post("/", authorize(ROLES.teacher, ROLES.admin), createChapter);

/**
 * @route   GET /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Get a single chapter by ID
 * @access  Authenticated
 */
router.get("/:id", getChapterById);

/**
 * @route   PUT /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Update a chapter
 * @access  Teacher/Admin
 */
router.put("/:id", authorize(ROLES.teacher, ROLES.admin), updateChapter);

/**
 * @route   DELETE /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Delete a chapter
 * @access  Teacher/Admin
 */
router.delete("/:id", authorize(ROLES.teacher, ROLES.admin), deleteChapter);

module.exports = router;

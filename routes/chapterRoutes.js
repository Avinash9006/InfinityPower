const express = require("express");
const router = express.Router({ mergeParams: true }); // ✅ allows subjectId & courseId to flow
const { ROLES } = require("../constants");
const { auth, authorize } = require("../middlewares/authMiddleware");
const {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
} = require("../controllers/chapterController");

// 🔹 Require auth for all chapter routes
router.use(auth);

/**
 * @route   GET /courses/:courseId/subjects/:subjectId/chapters
 * @desc    Get all chapters of a subject
 * @access  Authenticated
 */
router.get("/", getChapters);

/**
 * @route   POST /courses/:courseId/subjects/:subjectId/chapters
 * @desc    Create chapter under a subject
 * @access  Teacher/Admin
 */
router.post("/", authorize(ROLES.teacher, ROLES.admin), createChapter);

/**
 * @route   GET /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Get chapter by ID
 * @access  Authenticated
 */
router.get("/:id", getChapterById);

/**
 * @route   PUT /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Update chapter
 * @access  Teacher/Admin
 */
router.put("/:id", authorize(ROLES.teacher, ROLES.admin), updateChapter);

/**
 * @route   DELETE /courses/:courseId/subjects/:subjectId/chapters/:id
 * @desc    Delete chapter
 * @access  Teacher/Admin
 */
router.delete("/:id", authorize(ROLES.teacher, ROLES.admin), deleteChapter);

module.exports = router;

const express = require("express");
const router = express.Router();
const { uploadVideo } = require("../middlewares/multer");
const { auth, authorize } = require("../middlewares/authMiddleware");
const videoController = require("../controllers/videoController");

// Upload file-based video (teachers/admins)
router.post(
  "/upload",
  auth,
  authorize("teacher", "admin"),
  uploadVideo,
  videoController.uploadVideo
);

// Add external video link (teachers/admins)
router.post(
  "/link",
  auth,
  authorize("teacher", "admin"),
  videoController.addVideoLink
);

// Get all videos
router.get("/", auth, videoController.getVideos);

router.get("/chapter/:chapterId", auth, videoController.getVideosByChapter);

// Get single video
router.get("/:id", auth, videoController.getVideo);

// Delete video
router.delete(
  "/:id",
  auth,
  authorize("teacher", "admin"),
  videoController.deleteVideo
);

module.exports = router;

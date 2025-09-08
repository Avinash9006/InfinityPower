const express = require("express");
const router = express.Router();
const { uploadResource } = require("../middlewares/multer");
const { auth, authorize } = require("../middlewares/authMiddleware");
const resourceController = require("../controllers/resourceController");

// 📂 Upload file-based resource (teachers/admins)
router.post(
  "/upload",
  auth,
  authorize("teacher", "admin"),
  uploadResource,
  resourceController.uploadResource
);

// 🔗 Add external resource link (teachers/admins)
router.post(
  "/link",
  auth,
  authorize("teacher", "admin"),
  resourceController.addResourceLink
);

// 📜 Get all resources
router.get("/", auth, resourceController.getResources);

// 📚 Get resources by chapter
router.get("/chapter/:chapterId", auth, resourceController.getResourcesByChapter);

// 📄 Get single resource
router.get("/:id", auth, resourceController.getResource);

// 🗑 Delete resource
router.delete(
  "/:id",
  auth,
  authorize("teacher", "admin"),
  resourceController.deleteResource
);

module.exports = router;

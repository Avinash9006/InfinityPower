const multer = require("multer");

// ✅ Store files in memory temporarily (for direct cloud upload)
const storage = multer.memoryStorage();

// ✅ File filter for videos, images, and logos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
  } else if (file.fieldname === "image" || file.fieldname === "logo") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
  }
  cb(null, true);
};

// ✅ Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB max for videos
  },
});

// ✅ Accept video and optional image (for videos)
const uploadVideoFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// ✅ Accept single logo (for tenant)
const uploadLogo = upload.single("logo");

module.exports = { uploadVideo: uploadVideoFields, uploadLogo };

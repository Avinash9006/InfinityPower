const multer = require("multer");

// ✅ Store files in memory temporarily (for direct cloud upload)
const storage = multer.memoryStorage();

// ✅ File filter for videos, images, resources, and logos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "video") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
  } else if (file.fieldname === "image" || file.fieldname === "logo") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
  } else if (file.fieldname === "resource") {
    // ✅ Allow docs, pdfs, zips, images
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/zip",
      "image/png",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid resource file type"), false);
    }
  }
  cb(null, true);
};

// ✅ Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB max for videos/resources
  },
});

// ✅ Accept video and optional image (for videos)
const uploadVideoFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// ✅ Accept single logo (for tenant)
const uploadLogo = upload.single("logo");

// ✅ Accept resource file (for notes/dpp/etc.)
const uploadResource = upload.single("resource");

module.exports = { 
  uploadVideo: uploadVideoFields, 
  uploadLogo, 
  uploadResource 
};

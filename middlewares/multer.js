const multer = require("multer");

const storage = multer.diskStorage({});
const upload = multer({ storage });

upload.fields([
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

module.exports = {upload};
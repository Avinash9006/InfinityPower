const express = require('express');
const router = express.Router();
const { ROLES } = require('../constants');
const { uploadVideo, getVideos, getVideo } = require('../controllers/videoController');
const {auth ,authorize } = require('../middlewares/authMiddleware');
const {upload} = require('../middlewares/multer');

router.use(auth);
router.post(/.*/, authorize(ROLES.teacher, ROLES.admin));



router.post('/', upload.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideo);

module.exports = router;

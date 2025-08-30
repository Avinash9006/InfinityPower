const Video = require('../models/videoModel');
const cloudinary = require('../config/cloudinaryConfig');

const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, playlist } = req.body;

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const videoFile = req.files.video[0];
    const imageFile = req.files.image ? req.files.image[0] : null;

    // ✅ Validate
    if (!videoFile.mimetype.startsWith("video/")) {
      return res.status(400).json({ message: "Only video files allowed" });
    }

    // ✅ Upload video to Cloudinary
    const result = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: "video",
      folder: "edustream_videos",
    });

    // ✅ Create HLS adaptive streaming URL
    const hlsUrl = cloudinary.url(result.public_id, {
      resource_type: "video",
      format: "m3u8", // HLS streaming
    });

    let thumbnailUrl;

    // ✅ If user uploaded custom image, use it
    if (imageFile) {
      const imageResult = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
        folder: "edustream_thumbnails",
      });
      thumbnailUrl = imageResult.secure_url;
    } else {
      // Otherwise generate first frame thumbnail
      thumbnailUrl = cloudinary.url(result.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [{ width: 300, height: 200, crop: "fill" }],
      });
    }

    // ✅ Save video document
    const video = await Video.create({
      title,
      description,
      url: hlsUrl,
      thumbnail: thumbnailUrl,
      createdBy: req.user._id,
      playlist: playlist || null,
    });

    res.json(video);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading video", error: err.message });
  }
};




const getVideos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const videos = await Video.find()
      .populate("createdBy", "name email")
      .populate("playlist", "title description")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    next(err);
  }
};


const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("playlist", "title description");

    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { uploadVideo, getVideos ,getVideo};

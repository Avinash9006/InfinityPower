const Video = require("../models/videoModel");
const cloudinary = require("../config/cloudinaryConfig");
const generateSignedUrl = require("../utils/generateSignedUrl");

/**
 * Upload a new video (file -> Cloudinary)
 * Only Teacher/Admin
 */
const uploadVideo = async (req, res) => {
  try {
    const { title, description, playlist, chapterId, level, language } =
      req.body;

    if (!req.files || !req.files.video) {
      return res
        .status(400)
        .json({ success: false, message: "No video file uploaded" });
    }

    const videoFile = req.files.video[0];
    const imageFile = req.files.image ? req.files.image[0] : null;

    if (!videoFile.mimetype.startsWith("video/")) {
      return res
        .status(400)
        .json({ success: false, message: "Only video files allowed" });
    }

    // Upload video to Cloudinary
    const uploadVideoToCloud = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "edustream_videos",
            type: "authenticated",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(videoFile.buffer);
      });

    const result = await uploadVideoToCloud();

    // Upload or generate thumbnail
    let thumbnailUrl;

    if (imageFile) {
      // If teacher uploaded thumbnail manually
      const uploadImageToCloud = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "edustream_thumbnails" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(imageFile.buffer);
        });

      thumbnailUrl = await uploadImageToCloud();
    } else {
      // Auto-generate signed thumbnail from video
      thumbnailUrl = cloudinary.url(result.public_id + ".jpg", {
        resource_type: "video",
        type: "authenticated",
        sign_url: true,
        transformation: [{ width: 300, height: 200, crop: "fill" }],
      });
    }

    const video = await Video.create({
      title,
      description,
      type: "upload",
      url: result.public_id, // store public_id, not full URL
      thumbnail: thumbnailUrl,
      level: level || "free",
      language: language || "Hindi",
      createdBy: req.user.userId,
      course: playlist || null,
      chapter: chapterId || null,
      tenantId: req.user.tenantId,
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    console.error("Upload Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error uploading video",
        error: err.message,
      });
  }
};

/**
 * Save a new external video link (YouTube/Vimeo/etc.)
 */
const addVideoLink = async (req, res) => {
  try {
    const {
      title,
      description,
      url,
      playlist,
      chapterId,
      level,
      language,
      thumbnail,
    } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Video link required" });
    }

    const video = await Video.create({
      title,
      description,
      type: "link",
      url, // keep link as-is
      thumbnail: thumbnail || null,
      level: level || "free",
      language: language || "Hindi",
      createdBy: req.user.userId,
      course: playlist || null,
      chapter: chapterId || null,
      tenantId: req.user.tenantId,
    });

    res.status(201).json({ success: true, video });
  } catch (err) {
    console.error("Link Save Error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Error saving video link",
        error: err.message,
      });
  }
};

/**
 * Get all videos (tenant scoped)
 */
const getVideosStandalone = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const videos = await Video.find({
      tenantId: req.user.tenantId,
      chapterId: null,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const videosWithUrls = videos.map((v) => {
      const obj = v.toObject();
      obj.url = v.type === "upload" ? generateSignedUrl(v.url) : v.url;
      return obj;
    });

    res.json({ success: true, videos: videosWithUrls });
  } catch (err) {
    console.error("Error fetching videos:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch videos",
        error: err.message,
      });
  }
};

/**
 * Get videos by chapter
 */

const getVideosByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const videos = await Video.find({
      tenantId: req.user.tenantId,
      chapterId: chapterId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const videosWithUrls = videos.map((v) => {
      const obj = v.toObject();
      obj.url = v.type === "upload" ? generateSignedUrl(v.url) : v.url;
      return obj;
    });

    res.json({ success: true, videos: videosWithUrls });
  } catch (err) {
    console.error("Error fetching videos by chapter:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch videos",
        error: err.message,
      });
  }
};

/**
 * Get single video
 */
const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    const videoObj = video.toObject();
    videoObj.url =
      video.type === "upload" ? generateSignedUrl(video.url) : video.url;

    res.json({ success: true, video: videoObj });
  } catch (err) {
    console.error("Error fetching video:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to fetch video",
        error: err.message,
      });
  }
};

/**
 * Delete video
 */
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Delete from Cloudinary if upload type
    if (video.type === "upload") {
      await cloudinary.uploader.destroy(video.url, { resource_type: "video" });
    }

    res.json({ success: true, message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete video",
        error: err.message,
      });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, level, language, chapterId, courseId } =
      req.body;

    const video = await Video.findOne({ _id: id, tenantId: req.user.tenantId });
    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    // Update fields if provided
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (level !== undefined) video.level = level;
    if (language !== undefined) video.language = language;
    if (chapterId !== undefined) video.chapter = chapterId;
    if (courseId !== undefined) video.course = courseId;

    // Optional: replace video file
    if (req.files && req.files.video) {
      // Delete old video from Cloudinary if uploaded
      if (video.type === "upload") {
        await cloudinary.uploader.destroy(video.url, {
          resource_type: "video",
        });
      }

      const videoFile = req.files.video[0];

      const uploadVideoToCloud = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "video", folder: "edustream_videos" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(videoFile.buffer);
        });

      const result = await uploadVideoToCloud();
      video.url = result.public_id; // store public_id
      video.type = "upload";
    }

    // Optional: replace thumbnail
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      const uploadImageToCloud = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "edustream_thumbnails" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(imageFile.buffer);
        });
      video.thumbnail = await uploadImageToCloud();
    }

    await video.save();

    res.json({ success: true, video });
  } catch (err) {
    console.error("Error updating video:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update video",
        error: err.message,
      });
  }
};

module.exports = {
  uploadVideo,
  addVideoLink,
  getVideos: getVideosStandalone,
  getVideo,
  deleteVideo,
  updateVideo,
  getVideosByChapter,
};

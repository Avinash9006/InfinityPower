const Resource = require("../models/resourceModel");
const cloudinary = require("../config/cloudinaryConfig");
const generateSignedUrl = require("../utils/generateSignedUrl");

/**
 * Upload a new resource (file -> Cloudinary)
 * Only Teacher/Admin
 */
const uploadResource = async (req, res) => {
  try {
    const { title, description, type, chapterId, courseId, category } =
      req.body;
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No resource file uploaded" });
    }

    const resourceFile = req.file;

    // Upload resource file to Cloudinary (docs/images/pdfs/zip)
    const uploadToCloud = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw", // auto detects pdf, image, doc, zip
            folder: "edustream_resources",
            type: "authenticated",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(resourceFile.buffer);
    });

    const result = await uploadToCloud();

    const resource = await Resource.create({
      title,
      description,
      type: "upload",
      url: result.public_id, // store public_id
      fileType: resourceFile.mimetype,
      category: category || "notes", // default type
      createdBy: req.user.userId,
      course: courseId || null,
      chapter: chapterId || null,
      tenantId: req.user.tenantId,
    });

    res.status(201).json({ success: true, resource });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading resource",
      error: err.message,
    });
  }
};

/**
 * Save a new external resource link
 */
const addResourceLink = async (req, res) => {
  try {
    const { title, description, url, chapterId, courseId, category } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Resource link required" });
    }

    const resource = await Resource.create({
      title,
      description,
      type: "link",
      url,
      category: category || "notes",
      createdBy: req.user.userId,
      course: courseId || null,
      chapter: chapterId || null,
      tenantId: req.user.tenantId,
    });

    res.status(201).json({ success: true, resource });
  } catch (err) {
    console.error("Link Save Error:", err);
    res.status(500).json({
      success: false,
      message: "Error saving resource link",
      error: err.message,
    });
  }
};

/**
 * Get all resources (tenant scoped)
 */
const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resources = await Resource.find({
      tenantId: req.user.tenantId,
      chapter: null,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const resourcesWithUrls = resources.map((r) => {
      const obj = r.toObject();
      obj.url = r.type === "upload" ? generateSignedUrl(r.url, "raw") : r.url;
      return obj;
    });

    res.json({ success: true, resources: resourcesWithUrls });
  } catch (err) {
    console.error("Error fetching resources:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
      error: err.message,
    });
  }
};

/**
 * Get resources by chapter
 */
const getResourcesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resources = await Resource.find({
      tenantId: req.user.tenantId,
      chapterId: chapterId,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const resourcesWithUrls = resources.map((r) => {
      const obj = r.toObject();
      obj.url = r.type === "upload" ? generateSignedUrl(r.url, "raw") : r.url;
      return obj;
    });

    res.json({ success: true, resources: resourcesWithUrls });
  } catch (err) {
    console.error("Error fetching resources by chapter:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
      error: err.message,
    });
  }
};

/**
 * Get single resource
 */
const getResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    const obj = resource.toObject();
    obj.url =
      resource.type === "upload"
        ? generateSignedUrl(r.url, "raw")
        : resource.url;

    res.json({ success: true, resource: obj });
  } catch (err) {
    console.error("Error fetching resource:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
      error: err.message,
    });
  }
};

/**
 * Delete resource
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.user.tenantId,
    });

    if (!resource) {
      return res
        .status(404)
        .json({ success: false, message: "Resource not found" });
    }

    if (resource.type === "upload") {
      await cloudinary.uploader.destroy(resource.url, { resource_type: "raw" });
    }

    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete resource",
      error: err.message,
    });
  }
};

module.exports = {
  uploadResource,
  addResourceLink,
  getResources,
  getResourcesByChapter,
  getResource,
  deleteResource,
};

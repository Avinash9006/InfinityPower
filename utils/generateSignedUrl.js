const cloudinary = require('../config/cloudinaryConfig');

/**
 * Generate a signed URL for a video (HLS or MP4)
 * @param {string} publicId - Cloudinary public ID of the video
 * @param {number} expiresInSeconds - Expiration time in seconds (default 1 hour)
 * @returns {string} Signed URL
 */
const generateSignedUrl = (publicId, resourceType = "auto", expiresInSeconds = 3600) => {
  const expireAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: 'authenticated', // ensures only signed URL works
    sign_url: true,
    expires_at: expireAt,  // correct key for signed expiration
  });
};


module.exports = generateSignedUrl;

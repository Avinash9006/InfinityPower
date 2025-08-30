const cloudinary = require('../config/cloudinaryConfig');

const generateSignedUrl = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    type: 'authenticated', // ensures only signed URL works
    sign_url: true,
    expire_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  });
};

module.exports = generateSignedUrl;
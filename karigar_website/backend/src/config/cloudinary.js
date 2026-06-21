const cloudinary = require('cloudinary').v2;

// The cloudinary library will automatically read process.env.CLOUDINARY_URL
// If we want to be explicit or pass extra config, we can do it here.
// But calling config() without arguments will parse the CLOUDINARY_URL from the environment.
cloudinary.config();

module.exports = cloudinary;

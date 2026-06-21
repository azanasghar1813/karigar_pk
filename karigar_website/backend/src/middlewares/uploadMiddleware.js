const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on the fieldname
    let folderName = 'karigar/profile-photos';
    if (file.fieldname.toLowerCase().includes('cnic')) {
      folderName = 'karigar/cnic-private';
    }

    return {
      folder: folderName,
      // Optional: keep original file extension if possible, or force format
      // format: 'jpg', // you can force format if desired
      public_id: `${file.fieldname}-${Date.now()}`
    };
  },
});

const fileFilter = (req, file, cb) => {
  // Accepted image extensions and mimetypes
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Images Only! (jpeg, jpg, png, webp)'));
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter 
});

module.exports = upload;

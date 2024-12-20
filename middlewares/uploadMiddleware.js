const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');

// Configure AWS S3 with credentials from environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

const s3 = new AWS.S3();

// Set storage engine to use S3 for file uploads
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET,
  acl: 'public-read', // You can set this to private if you don't want files publicly accessible
  key: (req, file, cb) => {
    // Set file name as a unique timestamp with the original file extension
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

// File filter to allow only specific file types (e.g., images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false);
  }
};

// Initialize multer with the storage configuration and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

module.exports = upload;

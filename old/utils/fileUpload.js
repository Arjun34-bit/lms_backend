const multer = require('multer');
const AWS = require('aws-sdk');
const path = require('path');

// Initialize AWS S3 client
const s3Client = new AWS.S3({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

// Set storage engine for multer (for handling file upload to memory)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  },
});

const uploadToS3 = async (file) => {
  const fileName = `${Date.now()}_${file.originalname}`;
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `course-thumbnails/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read', // Ensure the file is publicly accessible
  };

  try {
    const result = await s3Client.upload(params).promise();
    return result.Location; // Return the public URL of the uploaded file
  } catch (error) {
    throw new Error('Error uploading to S3: ' + error.message);
  }
};

module.exports = {
  upload,
  uploadToS3,
};

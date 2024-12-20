const multer = require('multer');
const Minio = require('minio');
const fs = require('fs');
const path = require('path');
const Video = require('../models/video');
const Course = require('../models/course');  // Assuming you have a course model as well

// MinIO client setup
const minioClient = new Minio.Client({
    endPoint: 's3storage.duoples.com',
    accessKey: 'KE6eY6O3X7ghZfDe5xqI',
    secretKey: 'lNpfk2NuD27ygvV9LOmZqyJ5nPNkdTzyOHWozpnm',
    useSSL: true,
    region: 'us-east-1',
    signatureVersion: 'v4',
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Max file size 100 MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|mkv|avi/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new Error('Only video files are allowed (mp4, mkv, avi)'));
    },
}).single('videofile');

// Controller methods

// Get all courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find(); // Fetch courses from database
        res.status(200).json({ courses });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching courses', error: err });
    }
};

// Upload and Add Video
exports.uploadVideo = async (req, res) => {
    try {
        const { videoname, couname, line } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No video file uploaded' });
        }

        // Upload video to MinIO
        const file = req.file;
        const fileName = file.filename;
        const bucketName = 'pcc';
        await minioClient.fPutObject(bucketName, `uploads/videofile/${fileName}`, file.path);

        // Create and save video metadata
        const video = new Video({
            videoname,
            couname,
            line,
            videofile: fileName,
        });

        await video.save();

        // Remove local file after uploading to MinIO
        fs.unlinkSync(file.path);

        res.status(201).json({ message: 'Video added successfully', video });
    } catch (err) {
        res.status(500).json({ message: 'Error adding video', error: err });
    }
};

// Get all videos
exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find(); // Fetch all videos from database
        res.status(200).json({ videos });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching videos', error: err });
    }
};

// Delete video by ID
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Delete video file from MinIO
        await minioClient.removeObject('pcc', `uploads/videofile/${video.videofile}`);

        // Remove video from database
        await video.remove();

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting video', error: err });
    }
};

// Update video metadata and file if necessary
exports.updateVideo = async (req, res) => {
    try {
        const { id, videoname, line } = req.body;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.videoname = videoname;
        video.line = line;

        // If a new file is uploaded, handle the update
        if (req.file) {
            const oldFile = video.videofile;
            // Remove the old video file from MinIO
            await minioClient.removeObject('pcc', `uploads/videofile/${oldFile}`);

            // Upload new video to MinIO
            const newFileName = req.file.filename;
            await minioClient.fPutObject('pcc', `uploads/videofile/${newFileName}`, req.file.path);
            video.videofile = newFileName;

            // Remove local file after upload
            fs.unlinkSync(req.file.path);
        }

        await video.save();
        res.status(200).json({ message: 'Video updated successfully', video });
    } catch (err) {
        res.status(500).json({ message: 'Error updating video', error: err });
    }
};

// Get individual video details
exports.getVideoDetails = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.status(200).json({ video });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching video', error: err });
    }
};

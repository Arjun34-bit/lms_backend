const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const minioClient = require('./minioObject'); // Import the configured MinIO client
const CourseDataSchema = require('../models/CourseData');

const router = express.Router();
const uploadDir = path.join(__dirname, '../uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log(`Uploads directory created at: ${uploadDir}`);
}

// Function to upload video file to MinIO
async function uploadVideoToMinio(bucketName, objectName, filePath) {
    try {
        // Check if the bucket exists
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            // If the bucket doesn't exist, create it
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket '${bucketName}' created.`);
        }

        // Upload the file to the bucket
        await minioClient.fPutObject(bucketName, objectName, filePath);
        console.log(`Video uploaded successfully: ${objectName}`);
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    } finally {
        // Clean up the local file after uploading to MinIO
        fs.unlinkSync(filePath);
    }
}

// POST /upload - Handle file uploads
exports.uploadVideo = async (req, res) => {

    const { courseId } = req.body;

    console.log("Uploading video");
    const form = new multiparty.Form({
        uploadDir: uploadDir
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).send('Error parsing form data');
        }

        // Ensure a video file is uploaded
        if (!files || !files.null || !files.null[0]) {
            return res.status(400).send("No video file uploaded");
        }

        const title = fields.title[0];
        const description = fields.description[0];

        try {
            console.log('Files:', files);
            const file = files.null[0];  // The uploaded file object
            const bucketName = 'courses'; // The bucket name where videos will be uploaded
            const objectName = path.basename(file.path); // Use the file name as the object name in MinIO

            // Upload the video to MinIO
            await uploadVideoToMinio(bucketName, objectName, file.path);

            // Find or create CourseData entry
            let courseData = await CourseDataSchema.findOne({ course: courseId });
            if (!courseData) {
                courseData = new CourseDataSchema({ course: courseId, videoList: [] });
            }

            // Add video details to the course data
            courseData.videoList.push({
                title: title,
                description: description,
                videoPath: objectName,
                videoFolder: 'courses',
                videoSeenLength: 0,  // Initially set to 0
                videoNumber: courseData.videoList.length + 1, // Auto-increment video number
            });

            // Save the CourseData document
            await courseData.save();

            res.send('Video uploaded successfully');
        } catch (error) {
            console.error('Error uploading video:', error);
            res.status(500).send('Error uploading video');
        }
    });
};

// Route to fetch video list by courseId
exports.getVideos = async (req, res) => {
    const { courseId } = req.body;

    try {
        const courseData = await CourseDataSchema.findOne({ course: courseId });

        if (!courseData) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(courseData.videoList);
    } catch (error) {
        console.error('Error fetching video list:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

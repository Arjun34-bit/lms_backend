const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
const minioClient = require('./minioObject');
const CourseData = require('../models/CourseData');
const CourseDataSchema = require('../models/CourseData');
const videoData = require('../models/video');


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
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`Bucket '${bucketName}' created.`);
        }

        await minioClient.fPutObject(bucketName, objectName, filePath);
        console.log(`Video uploaded successfully: ${objectName}`);
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    } finally {
        // Clean up the local file after uploading
        fs.unlinkSync(filePath);
    }
}

// POST /upload - Handle file uploads
exports.uploadVideo = async(req, res) => {

    const { courseId } = req.body;

    console.log("Uploading video");
    const form = new multiparty.Form({
        uploadDir: uploadDir
    });

    form.parse(req, async(err, fields, files) => {
        if (err) {
            console.error('Error parsing form data:', err);
            return res.status(500).send('Error parsing form data');
        }


        if (!files || !files.null || !files.null[0]) {
            throw new Error("No video file uploaded");
        }


        const courseId = fields.courseId ? fields.courseId[0] : null;



        // res.send('Video uploaded successfully');



        try {

            console.log(files);
            const file = files.null[0];
            const bucketName = 'courses';
            const objectName = path.basename(file.path);
            await uploadVideoToMinio(bucketName, objectName, file.path).then(
                async() => {
                    // Find or create CourseData entry



                    console.log(courseId);
                    if (!courseId) {
                        return res.status(400).send("Course ID is required");
                    }


                    // Find or create CourseData entry
                    let courseData = await CourseDataSchema.findOne({ course: courseId });
                    if (!courseData) {
                        courseData = new CourseDataSchema({ course: courseId, videoList: [] });
                    }

                    // Add video details to CourseData
                    courseData.videoList.push({
                        videoPath: objectName,
                        videoFolder: 'courses',
                        videoSeenLength: 0, // Initially set to 0
                        // uploadedDate: new Date(),
                        videoNumber: 1,
                    });

                    // Save CourseData
                    await courseData.save();

                    res.send('Video uploaded successfully');

                }
            );
            // res.send('Video uploaded successfully');
        } catch (error) {
            console.log(err);
            res.status(500).send('Error uploading video');
        }
    });
};



// Route to fetch video list by courseId
exports.getVideos = async(req, res) => {
    const { courseId } = req.body;

    try {
        const courseData = await CourseData.findOne({ course: courseId });

        if (!courseData) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json(courseData.videoList);
    } catch (error) {
        console.error('Error fetching video list:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
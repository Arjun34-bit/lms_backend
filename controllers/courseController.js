const { validationResult } = require('express-validator');
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const { uploadToS3 } = require('../utils/fileUpload');

// Initialize AWS S3 client
const s3Client = new AWS.S3({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

const getSignedUrl = (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Expires: 1200, // 20 minutes
  };
  return s3Client.getSignedUrl('getObject', params);
};

// Helper function to create a notification
const createNotification = async (type, notifiableId, data) => {
  try {
    const notification = new Notification({
      type,
      notifiableType: 'User',
      notifiableId,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await notification.save();
    return notification._id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const createCourse = async (req, res) => {
  try {
    const instructorId = req.body.instructor_id || req.user.id; // Get instructor_id from body or token
    if (!instructorId) {
      return res.status(400).json({ message: "Instructor ID is missing." });
    }

    // Handle thumbnail upload if a file is provided
    let thumbnailUrl = null;
    if (req.file) {
      thumbnailUrl = await uploadToS3(req.file);
    }

    // Create the course document
    const course = new Course({
      title: req.body.title,
      description: req.body.description,
      instructor_id: instructorId,
      category: req.body.category,
      type: req.body.type,
      level: req.body.level,
      duration: req.body.duration,
      price: req.body.price,
      status: req.body.status,
      metadata: {
        rating: req.body["metadata.rating"] || 0,
        enrolled: req.body["metadata.enrolled"] || 0,
        language: req.body["metadata.language"] || "English",
      },
      thumbnail: thumbnailUrl, // Store the S3 URL of the uploaded thumbnail
      bestseller: req.body.bestseller || false,
    });

    // Save to the database
    await course.save();

    // Return a success response with the created course
    res.status(201).json({
      message: "Course created successfully!",
      course,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({
      message: "An error occurred while creating the course. Please try again.",
    });
  }
};

// Controller Methods
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'pending' }).populate('instructor_id', 'name email');
    return res.status(200).json({ message: 'Courses fetched successfully', courses });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};
const getCoursesByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Authenticated User ID:', userId);

    // Fetch courses for the given instructor using user ID as string
    const courses = await Course.find({ instructor_id: userId })
      .populate('instructor_id', 'name email')
      .exec();
    console.log('Courses with populated instructor:', courses);

    if (!courses || courses.length === 0) {
      console.log('No courses found for this instructor.');

      // Return a response indicating no courses found
      return res.status(404).json({
        message: 'No courses found for this instructor',
        user_details: {
          user_id: userId,
        },
        additional_info: 'Please verify the instructor_id in your courses and make sure the courses are correctly assigned.'
      });
    }

    // Fetch user details to verify instructor
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({
        message: 'Instructor not found in users table',
        user_id: userId,
      });
    }

    // Ensure that the instructor_id in the course data matches the user data
    const instructorMatches = courses.every(course => 
      String(course.instructor_id._id) === userId
    );

    if (!instructorMatches) {
      return res.status(400).json({
        message: 'Instructor ID mismatch between courses and users table',
        user_details: {
          user_id: userId,
          name: user.name,
          email: user.email,
        },
      });
    }

    return res.status(200).json({
      message: 'Courses fetched successfully',
      courses,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};





const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor_id', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course fetched successfully', course });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    return res.status(400).json({ message: 'Error updating course', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByToken,
};

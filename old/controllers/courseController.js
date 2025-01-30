const { validationResult } = require("express-validator");

const mongoose = require("mongoose");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Category = require("../models/Category");
const Notification = require("../models/notificationModel");
const { uploadToS3 } = require("../utils/fileUpload");
const AWS = require("aws-sdk");

const fs = require("fs");

const s3Client = new AWS.S3({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
});

const createCourse = async (req, res) => {
  try {
    // Destructure and validate input fields
    const {
      title,
      description,
      category_id,
      department_id,
      subject_id,
      level,
      price,
      start_date,
      end_date,
      duration,
      live_days,
      live_time,
      language,
      is_free,
    } = req.body;
    console.log(req.body);
    res.status(200).json({ received: req.body });

    // Validate required fields
    if (
      !title ||
      !description ||
      !category_id ||
      !department_id ||
      !subject_id ||
      !level
    ) {
      return res
        .status(400)
        .json({
          message:
            "Missing required fields: title, description, category, department, subject, or level.",
        });
    }

    // Check if live category exists
    const liveCategory = await Category.findOne({
      name: { $regex: "live", $options: "i" },
    });
    if (!liveCategory) {
      return res.status(404).json({ message: "Live category not found." });
    }

    // Handle thumbnail upload
    let thumbnailUrl = null;
    if (req.file) {
      try {
        thumbnailUrl = await uploadToS3(req.file, s3Client); // Assuming `uploadToS3` handles S3 uploads
      } catch (uploadError) {
        console.error("Error uploading thumbnail to S3:", uploadError);
        return res
          .status(500)
          .json({ message: "Failed to upload thumbnail. Please try again." });
      }
    }

    // Ensure IDs are in ObjectId format
    const categoryId = mongoose.Types.ObjectId(category_id);
    const departmentId = mongoose.Types.ObjectId(department_id);
    const subjectId = mongoose.Types.ObjectId(subject_id);

    // Prepare course data
    const courseData = {
      title,
      description,
      category_id: categoryId,
      department_id: departmentId,
      subject_id: subjectId,
      level,
      price: price ? parseFloat(price) : null,
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      duration,
      instructor_id: req.user?.id ? mongoose.Types.ObjectId(req.user.id) : null, // Ensure user is authenticated
      status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
      live_days: Array.isArray(live_days) ? JSON.stringify(live_days) : null,
      live_time: categoryId.equals(liveCategory._id) ? live_time : null,
      language: language || null,
      is_free: is_free !== undefined ? Boolean(is_free) : false,
      thumbnail: thumbnailUrl,
    };

    // Check if instructor_id is valid
    if (!courseData.instructor_id) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Instructor ID is required." });
    }

    // Create and save the course document
    const course = new Course(courseData);
    await course.save();

    // Send success response
    res.status(201).json({
      message: "Course created successfully!",
      course,
    });
  } catch (err) {
    console.error("Error creating course:", err);

    // Log the error with a detailed stack trace
    const logMessage = `[${new Date().toISOString()}] Error creating course: ${
      err.message
    }\n${err.stack}\n\n`;
    fs.appendFileSync("error.log", logMessage);

    // Respond with an error message
    res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
      error: err.message, // Only include specific error details in development
    });
  }
};
const getSignedUrl = (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Expires: 1200, // 20 minutes
  };
  return s3Client.getSignedUrl("getObject", params);
};

// Helper function to create a notification
const createNotification = async (type, notifiableId, data) => {
  try {
    const notification = new Notification({
      type,
      notifiableType: "User",
      notifiableId,
      data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await notification.save();
    return notification._id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "pending" }).populate(
      "instructor_id",
      "name email"
    );
    return res
      .status(200)
      .json({ message: "Courses fetched successfully", courses });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching courses", error: error.message });
  }
};

const getCoursesByToken = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Authenticated User ID:", userId);

    // Fetch courses for the given instructor using user ID as string
    const courses = await Course.find({ instructor_id: userId })
      .populate("instructor_id", "name email")
      .exec();
    console.log("Courses with populated instructor:", courses);

    if (!courses || courses.length === 0) {
      console.log("No courses found for this instructor.");

      // Return a response indicating no courses found
      return res.status(404).json({
        message: "No courses found for this instructor",
        user_details: {
          user_id: userId,
        },
        additional_info:
          "Please verify the instructor_id in your courses and make sure the courses are correctly assigned.",
      });
    }

    // Fetch user details to verify instructor
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({
        message: "Instructor not found in users table",
        user_id: userId,
      });
    }

    // Ensure that the instructor_id in the course data matches the user data
    const instructorMatches = courses.every(
      (course) => String(course.instructor_id._id) === userId
    );

    if (!instructorMatches) {
      return res.status(400).json({
        message: "Instructor ID mismatch between courses and users table",
        user_details: {
          user_id: userId,
          name: user.name,
          email: user.email,
        },
      });
    }

    return res.status(200).json({
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      message: "Error fetching courses",
      error: error.message,
    });
  }
};
const getCoursesByCategoryName = async (req, res) => {
  try {
    const { categoryName } = req.query; // Assuming the category name is passed as a query parameter

    // Validate categoryName
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Perform a case-insensitive search for the category by name
    const category = await Category.findOne({
      name: { $regex: new RegExp("^" + categoryName + "$", "i") }, // Case-insensitive regex search
    });

    // If category is not found, return all categories with their name and ID
    if (!category) {
      const availableCategories = await Category.find({}, "name _id"); // Fetch name and _id fields of all categories
      return res.status(404).json({
        message: `Category '${categoryName}' not found. Here are some available categories for you to search:`,
        availableCategories,
      });
    }

    // Find courses belonging to the category and match category_id as a string
    const courses = await Course.find({ category_id: category._id.toString() }) // Ensure category_id is compared as string
      .populate("instructor")
      .sort({ title: 1 }); // Sort courses alphabetically by title (or any other field)

    // If no courses are found for the given category, provide suggestions for searching
    if (courses.length === 0) {
      const availableCategories = await Category.find({}, "name _id"); // Fetch name and _id fields of all categories
      return res.status(404).json({
        message: `No courses found under category '${categoryName}'. Here are some available categories you can explore:`,
        availableCategories,
      });
    }

    // Respond with the courses data
    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor_id",
      "name email"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res
      .status(200)
      .json({ message: "Course fetched successfully", course });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res
      .status(200)
      .json({ message: "Course updated successfully", course });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating course", error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};

module.exports = {
  getCourses,
  getCoursesByCategoryName,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByToken,
};

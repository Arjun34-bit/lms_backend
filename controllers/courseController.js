const Course = require('../models/courseModel');

// Fetch all courses with status 'published'
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'published' }).populate('instructor_id', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};
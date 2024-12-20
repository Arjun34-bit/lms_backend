const Wishlist = require('../models/wishlist');
const Course = require('../models/courseModel');

// Helper function to validate published courses
const validatePublishedCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  if (course.status !== 'published') throw new Error('Only published courses can be added or removed');
  return course;
};

// Add course to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token
    const { courseId } = req.body;

    await validatePublishedCourse(courseId);

    let wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      if (!wishlist.courses.includes(courseId)) {
        wishlist.courses.push(courseId);
        await wishlist.save();
        return res.status(200).json({ message: 'Course added to wishlist successfully' });
      } else {
        return res.status(400).json({ message: 'Course is already in the wishlist' });
      }
    } else {
      const newWishlist = new Wishlist({
        user: userId,
        courses: [courseId],
      });
      await newWishlist.save();
      res.status(201).json({ message: 'Course added to wishlist successfully' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove course from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token
    const { courseId } = req.body;

    await validatePublishedCourse(courseId);

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.courses = wishlist.courses.filter((course) => course.toString() !== courseId);

    if (wishlist.courses.length === 0) {
      await Wishlist.deleteOne({ user: userId });
      return res.status(200).json({ message: 'Wishlist is empty, deleted successfully' });
    }

    await wishlist.save();
    res.status(200).json({ message: 'Course removed from wishlist successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token

    // Find the user's wishlist and populate course details
    const wishlist = await Wishlist.findOne({ user: userId }).populate('courses');

    if (!wishlist || wishlist.courses.length === 0) {
      return res.status(404).json({ message: 'Wishlist is empty or not found' });
    }

    res.status(200).json({
      message: 'Wishlist retrieved successfully',
      wishlist: wishlist.courses,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};
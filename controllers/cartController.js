const Cart = require('../models/cart');
const Course = require('../models/courseModel');

// Helper function to validate published courses
const validatePublishedCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  if (course.status !== 'published') throw new Error('Only published courses can be added or removed');
  return course;
};

// Create: Add a course to the cart
exports.addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Extracted from token

    await validatePublishedCourse(courseId);

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      if (!cart.courses.includes(courseId)) {
        cart.courses.push(courseId);
        await cart.save();
        return res.status(200).json({ message: 'Course added to cart successfully' });
      } else {
        return res.status(400).json({ message: 'Course is already in the cart' });
      }
    } else {
      cart = new Cart({ user: userId, courses: [courseId] });
      await cart.save();
      return res.status(201).json({ message: 'Course added to cart successfully' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Read: Get all courses in the user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token
    const cart = await Cart.findOne({ user: userId }).populate('courses');

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Update: Add or replace courses in the cart
exports.updateCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Extracted from token

    await validatePublishedCourse(courseId);

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      if (!cart.courses.includes(courseId)) {
        cart.courses.push(courseId);
        await cart.save();
        return res.status(200).json({ message: 'Course updated in cart successfully' });
      } else {
        return res.status(400).json({ message: 'Course is already in the cart' });
      }
    } else {
      cart = new Cart({ user: userId, courses: [courseId] });
      await cart.save();
      return res.status(201).json({ message: 'Course added to cart successfully' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete: Remove a course from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Extracted from token

    await validatePublishedCourse(courseId);

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.courses = cart.courses.filter((course) => course.toString() !== courseId);

    if (cart.courses.length === 0) {
      await Cart.deleteOne({ user: userId });
      return res.status(200).json({ message: 'Cart is empty, deleted successfully' });
    }

    await cart.save();
    res.status(200).json({ message: 'Course removed from cart successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete: Clear the entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token
    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.courses = [];
    await cart.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};

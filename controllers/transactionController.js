const Transaction = require('../models/transaction');
const Cart = require('../models/cart');
const Course = require('../models/courseModel');
const Enroll = require('../models/Enroll');
const { createEnrollments } = require('../helpers/enrollmentHelper');

// Process transaction
exports.processTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseIds, status } = req.body;

    // Validate course IDs
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'No course IDs provided' });
    }

    // Validate transaction status
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid transaction status' });
    }

    // Check if cart exists and has courses
    const cart = await Cart.findOne({ user: userId }).select('courses');
    if (!cart || cart.courses.length === 0) {
      return res.status(404).json({ message: 'Cart is empty or not found' });
    }

    // Filter courses from the cart
    const validCourseIds = cart.courses.filter(courseId => courseIds.includes(courseId.toString()));
    if (validCourseIds.length === 0) {
      return res.status(400).json({ message: 'No matching courses found in the cart' });
    }

    // Fetch valid published courses
    const requestedCourses = await Course.find({
      _id: { $in: validCourseIds },
      status: 'published',
    });

    if (requestedCourses.length === 0) {
      return res.status(400).json({ message: 'No valid published courses found for transaction' });
    }

    // Calculate the total amount
    const totalAmount = requestedCourses.reduce((acc, course) => acc + course.price, 0);

    // Create and save the transaction
    const transaction = new Transaction({
      user: userId,
      courses: requestedCourses.map(course => course._id),
      amount: totalAmount,
      status,
      transactionDate: new Date(),
    });

    await transaction.save();

    // If the status is 'Completed', create enrollments
    if (status === 'Completed') {
      try {
        await createEnrollments(transaction); // Create enrollments only for completed transactions
      } catch (error) {
        console.error('Enrollment creation failed:', error);
        return res.status(500).json({ message: 'Failed to create enrollments', error: error.message });
      }
    }

    res.status(200).json({
      message: `Transaction ${status === 'Completed' ? 'and enrollment completed successfully' : 'created as pending'}`,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing transaction', error });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    // Validate the status
    if (!['Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid transaction status' });
    }

    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Prevent updating a completed transaction
    if (transaction.status === 'Completed') {
      return res.status(400).json({ message: 'Transaction is already completed' });
    }

    // Update the status of the transaction
    transaction.status = status;

    // If the status is 'Completed', create enrollments
    if (status === 'Completed') {
      try {
        await createEnrollments(transaction); // Create enrollments only for completed transactions
      } catch (error) {
        console.error('Enrollment creation failed:', error);
        return res.status(500).json({ message: 'Failed to create enrollments', error: error.message });
      }
    }

    // Save the updated transaction
    await transaction.save();

    res.status(200).json({ message: 'Transaction status updated successfully', transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating transaction status', error });
  }
};

const Enroll = require('../models/Enroll');

// Create enrollments based on the transaction
const createEnrollments = async (transaction) => {
  try {
    // Loop through each course and create an enrollment if it doesn't already exist
    for (let courseId of transaction.courses) {
      const existingEnrollment = await Enroll.findOne({
        userId: transaction.user,
        courseId: courseId,
        transactionId: transaction._id,  // Ensure this is unique per transaction
      });

      if (existingEnrollment) {
        console.log(`User ${transaction.user} already enrolled in course ${courseId} for this transaction.`);
        continue; // Skip if the enrollment already exists
      }

      // Create a new enrollment if not exists
      const newEnrollment = new Enroll({
        userId: transaction.user,
        courseId: courseId,
        transactionId: transaction._id,
        enrollmentDate: new Date(),
      });

      await newEnrollment.save();
    }
  } catch (error) {
    console.error('Error creating enrollments:', error);
    throw new Error('Failed to create enrollments: ' + error.message);
  }
};

module.exports = { createEnrollments };

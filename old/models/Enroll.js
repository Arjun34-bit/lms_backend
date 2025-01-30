const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
});

const Enroll = mongoose.model('Enroll', enrollSchema);

module.exports = Enroll;

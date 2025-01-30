const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  amount: Number,
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);

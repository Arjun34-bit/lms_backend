// models/Scholarship.js
const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  eligibility: { type: String, required: true },
  deadline: { type: Date, required: true }
});

module.exports = mongoose.model('scholarships', scholarshipSchema);

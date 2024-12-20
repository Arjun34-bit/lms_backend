const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  type: { type: String },
  level: { type: String },
  duration: { type: String },
  price: { type: Number },
  status: { type: String },
  thumbnail: { type: String },
  
  metadata: { type: Object }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema); 
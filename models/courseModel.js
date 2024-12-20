const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    instructor_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    category: { type: String, trim: true },
    type: { type: String, trim: true },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: { type: String, trim: true },
    price: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    thumbnail: { type: String, trim: true },
    metadata: {
      rating: { type: Number, default: 0, min: 0, max: 5 },
      enrolled: { type: Number, default: 0 },
      language: { type: String, default: 'English' },
    },
    bestseller: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('Course', courseSchema);

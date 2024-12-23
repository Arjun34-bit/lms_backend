const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Course Schema Definition
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
  department_id: { type: Schema.Types.ObjectId, ref: 'Department' },
  subject_id: { type: Schema.Types.ObjectId, ref: 'Subject' },
  level: { type: String, default: 'beginner' },
  price: { type: Number, default: 0.0 },
  status: { type: String, default: 'draft' },
  thumbnail: { type: String },
  language: { type: String, default: 'English' },
  is_free: { type: Boolean, default: false },
  start_date: { type: Date },
  end_date: { type: Date },
  duration: { type: String },
  live_days: { type: [String] },
  live_time: { type: String },
  instructor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {
      rating: 0,
      enrolled: 0
    }
  },
  bestseller: { type: Boolean, default: false }
}, {
  timestamps: true // This will add createdAt and updatedAt fields automatically
});

// Relationships (Virtuals for Populate)
courseSchema.virtual('instructor', {
  ref: 'User',
  localField: 'instructor_id',
  foreignField: '_id',
  justOne: true
});

courseSchema.virtual('sections', {
  ref: 'CourseSection',
  localField: '_id',
  foreignField: 'course_id'
});

courseSchema.virtual('enrollments', {
  ref: 'CourseEnrollment',
  localField: '_id',
  foreignField: 'course_id'
});

courseSchema.virtual('materials', {
  ref: 'CourseMaterial',
  localField: '_id',
  foreignField: 'course_id'
});

courseSchema.virtual('progress', {
  ref: 'CourseProgress',
  localField: '_id',
  foreignField: 'course_id'
});

// Default attribute values & Mutators
courseSchema.pre('save', function(next) {
  if (this.title) {
    this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).trim(); // Capitalize the first letter of the title
  }
  next();
});

// Example of a custom getter for metadata
courseSchema.methods.getMetadata = function() {
  let metadata = this.metadata ? this.metadata : { rating: 0, enrolled: 0 };
  metadata.rating = parseFloat(metadata.rating);
  return metadata;
};

// Scopes (Static Methods)
courseSchema.statics.published = function() {
  return this.where('status').equals('published');
};

courseSchema.statics.bestsellers = function() {
  return this.where('bestseller').equals(true);
};

// Create and export the model
const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

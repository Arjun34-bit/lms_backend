const mongoose = require('mongoose');

const userCourseSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    purchase_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserCourse', userCourseSchema);
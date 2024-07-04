const mongoose = require('mongoose');
const VideoSchema = require('../models/video');


const CourseDataSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    videoList: [VideoSchema]
});

module.exports = mongoose.model('CourseData', CourseDataSchema);
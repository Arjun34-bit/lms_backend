const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    videoPath: {
        type: String,
        required: true
    },
    videoFolder: {
        type: String,
        required: true
    },
    videoSeenLength: {
        type: Number,
        required: true
    },
    uploadedDate: {
        type: Date,
        default: Date.now
    },
    videoNumber: {
        type: Number,
        required: true,
    }
});

module.exports = VideoSchema; // Export the schema, not the model
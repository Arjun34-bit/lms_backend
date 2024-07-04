const mongoose = require('mongoose');

const userVideoProgressSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    watched_seconds: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserVideoProgress', userVideoProgressSchema);
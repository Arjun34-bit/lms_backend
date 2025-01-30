const mongoose = require('mongoose');

const quickLearningVideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  video_url: {
    type: String,
    required: true,
  },
}, {
  collection: 'quick_learning_videos',
  timestamps: true,
});

const QuickLearningVideo = mongoose.model('QuickLearningVideo', quickLearningVideoSchema);

module.exports = QuickLearningVideo;

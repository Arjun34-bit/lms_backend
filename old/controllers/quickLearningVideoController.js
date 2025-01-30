const QuickLearningVideo = require('../models/QuickLearningVideo');

// Fetch all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await QuickLearningVideo.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error });
  }
};



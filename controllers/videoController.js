const Video = require('../models/video');

exports.getAllVideos = async(req, res) => {
    try {
        const videos = await Video.find();
        console.log(videos);
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
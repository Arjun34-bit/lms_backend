
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/videos', videoController.getAllVideos);

module.exports = router;

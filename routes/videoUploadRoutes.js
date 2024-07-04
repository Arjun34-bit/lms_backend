const express = require('express');
const router = express.Router();
const minioController = require('../controllers/minioController');

router.post('/uploadCourseVideo', minioController.uploadVideo);
router.get('/getCourseVideos', minioController.getVideos);

module.exports = router;
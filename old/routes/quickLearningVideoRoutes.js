const express = require('express');
const router = express.Router();
const quickLearningVideoController = require('../controllers/quickLearningVideoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes
router.get('/', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, quickLearningVideoController.getAllVideos);


module.exports = router;

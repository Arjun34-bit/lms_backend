const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/courses', authMiddleware.verifyToken, courseController.getCourses);

module.exports = router; 
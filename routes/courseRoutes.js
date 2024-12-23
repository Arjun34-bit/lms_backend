const express = require('express');
const { upload } = require('../utils/fileUpload');  // Import the upload middleware
const { getCourses, getCourseById, createCourse, updateCourse, deleteCourse ,getCoursesByToken} = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new course (with file upload)
router.post('/', authMiddleware.verifyToken, upload.single('thumbnail'), createCourse);

// Other course routes...
router.get('/', authMiddleware.verifyToken, getCourses);
router.get('/instructor', authMiddleware.verifyToken, getCoursesByToken);
router.get('/:id', authMiddleware.verifyToken, getCourseById);
router.put('/:id', authMiddleware.verifyToken, updateCourse);
router.delete('/:id', authMiddleware.verifyToken, deleteCourse);

module.exports = router;

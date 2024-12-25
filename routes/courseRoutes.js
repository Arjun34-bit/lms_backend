const express = require('express');
const { upload } = require('../utils/fileUpload');  // Import the file upload middleware
const {
    getCourses,
    getCoursesByCategoryName,
    getCourseById,
    createCourse,
    updateCourse,
    getCoursesByToken,
    deleteCourse,
} = require('../controllers/courseController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new course with file upload (for thumbnail image)
router.post('/', authMiddleware.verifyToken, upload.single('thumbnail'), createCourse);

// Route to get featured courses by category name (for authenticated users)
router.get('/category', authMiddleware.verifyToken, getCoursesByCategoryName);


// Route to get all courses (for authenticated users)
router.get('/', authMiddleware.verifyToken, getCourses);

// Route to store a new course (admin or instructor can access)
router.post('/store', authMiddleware.verifyToken, createCourse);

// Route to get courses for the authenticated instructor (based on the token)
router.get('/instructor', authMiddleware.verifyToken, getCoursesByToken);

// Route to get a single course by its ID (for authenticated users)
router.get('/:id', authMiddleware.verifyToken, getCourseById);

// Route to update an existing course by its ID (admin or instructor can access)
router.put('/:id', authMiddleware.verifyToken, updateCourse);

// Route to delete a course by its ID (admin or instructor can access)
router.delete('/:id', authMiddleware.verifyToken, deleteCourse);

module.exports = router;

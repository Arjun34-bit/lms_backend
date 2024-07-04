const express = require('express');
const router = express.Router();

// const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const wishlistRoutes = require('./wishlistRoute')
const videoUploadRoute = require('./videoUploadRoutes')

// // Use user-related routes
// router.use('/user', userRoutes);
// Use course-related routes

router.use('/courses', courseRoutes);
router.use('/video', courseRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/course', videoUploadRoute);

module.exports = router;
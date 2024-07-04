const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/addcourse', courseController.addCourse);

/*

cart apis

*/
router.post('/addCart', courseController.addToCart);
router.get('/userCart', courseController.fetchUserCart);
router.post('/removeCourseFromCart', courseController.removeUserCartItem);

/*

wishlist

 */
router.post('/addWishlist', courseController.addToWishlist);
router.get('/userWishlist', courseController.fetchUserWishlist);
router.post('/removeCourseFromWishlist', courseController.removeUserWishlistItem);

/*

purchased courses

*/
router.post('/addPurchased', courseController.addToPurchased);
router.get('/userPurchased', courseController.fetchUserPurchasedList);

router.post('/addUser', courseController.addUser);
router.get('/courses', courseController.getAllCourses);
router.get('/courses/featured', courseController.getFeaturedCourses);
router.get('/courses/top', courseController.getTopCourses);
router.get('/courses/search', courseController.searchCourses);
router.get('/courses/:id', courseController.getCourseById);

// Create all courses
router.post('/create-course', courseController.createCourse);


module.exports = router;
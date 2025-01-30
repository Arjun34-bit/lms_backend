const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware.verifyToken, wishlistController.addToWishlist);

// Remove a course from the wishlist
router.delete('/remove', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, wishlistController.removeFromWishlist);

// Get the user's wishlist
router.get('/', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, wishlistController.getWishlist);

module.exports = router;

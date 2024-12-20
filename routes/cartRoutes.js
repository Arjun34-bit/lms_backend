const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

// Add a course to the cart (Protected route)
router.post('/add', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, cartController.addToCart);

// Get all courses in the user's cart (Protected route)
router.get('/', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, cartController.getCart);

// Update cart (Used for adding/updating, same as add) (Protected route)
router.put('/update', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, cartController.updateCart);

// Remove a course from the cart (Protected route)
router.delete('/remove', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, cartController.removeFromCart);

// Clear the entire cart (Protected route)
router.delete('/clear', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, cartController.clearCart);

module.exports = router;

const express = require('express');
const {
    validateToken,
    register,
    login,
    updateEmail,
    linkSocialAccount,
    getUserProfile,
    
   
    unlinkSocialAccount
    // Add more routes here...
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', register);

// User login and get token
router.post('/login', login);
router.get('/users/:userId', authMiddleware.verifyToken, getUserProfile);

// Validate token with authentication middleware
router.post('/validate-token', authMiddleware.verifyToken, validateToken);

// Update user email
router.put('/update-email', authMiddleware.verifyToken, updateEmail);

// Link a social account to user
router.post('/link-social-account', authMiddleware.verifyToken, linkSocialAccount);

// Unlink a social account from user
router.post('/unlink-social-account', authMiddleware.verifyToken, unlinkSocialAccount);

module.exports = router;

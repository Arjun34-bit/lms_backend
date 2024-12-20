const express = require('express');
const {
    validateToken,
    register,
    login,
    updateEmail,
    linkSocialAccount,
    unlinkSocialAccount
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/validate-token', authMiddleware.verifyToken, validateToken);
router.put('/update-email', authMiddleware.verifyToken, updateEmail);
router.post('/link-social-account', authMiddleware.verifyToken, linkSocialAccount);
router.post('/unlink-social-account', authMiddleware.verifyToken, unlinkSocialAccount);

module.exports = router;

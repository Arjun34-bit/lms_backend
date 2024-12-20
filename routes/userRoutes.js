const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/update-email', userController.updateEmail);
router.post('/link-social-account', userController.linkSocialAccount);
router.post('/unlink-social-account', userController.unlinkSocialAccount);

module.exports = router; 
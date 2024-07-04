const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/wishlist/add', wishlistController.addToWishlist);
router.post('/wishlist/remove', wishlistController.removeFromWishlist);

module.exports = router;

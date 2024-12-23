const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');

// Route to fetch all languages
router.get('/languages', languageController.getLanguages);

module.exports = router;

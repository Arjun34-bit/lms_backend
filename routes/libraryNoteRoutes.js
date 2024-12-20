// routes/libraryNoteRoutes.js
const express = require('express');
const router = express.Router();
const libraryNoteController = require('../controllers/libraryNoteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, libraryNoteController.getLibraryNotes);


module.exports = router;

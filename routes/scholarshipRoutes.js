// routes/scholarshipRoutes.js
const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');

// Route to fetch all scholarships
router.get('/scholarships', scholarshipController.getAllScholarships);

// Route to fetch a specific scholarship by ID
router.get('/scholarships/:id', scholarshipController.getScholarshipById);

// Route to add a new scholarship
router.post('/scholarships', scholarshipController.addScholarship);

// Route to update a scholarship
router.put('/scholarships/:id', scholarshipController.updateScholarship);

// Route to delete a scholarship
router.delete('/scholarships/:id', scholarshipController.deleteScholarship);

module.exports = router;


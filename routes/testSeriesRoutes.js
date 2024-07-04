// routes/testSeriesRoutes.js
const express = require('express');
const router = express.Router();
const testSeriesController = require('../controllers/testSeriesController');

// Route to fetch all test series
router.get('/test-series', testSeriesController.getAllTestSeries);

// Route to add new test series
router.post('/test-series', testSeriesController.addTestSeries);

// Route to update test series
router.put('/test-series/:id', testSeriesController.updateTestSeries);

// Route to delete test series
router.delete('/test-series/:id', testSeriesController.deleteTestSeries);

module.exports = router;

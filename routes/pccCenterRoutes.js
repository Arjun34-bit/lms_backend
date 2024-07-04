// routes/pccCenterRoutes.js
const express = require('express');
const router = express.Router();
const pccCenterController = require('../controllers/pccCenterController');

// Route to fetch all PCC centers
router.get('/pcc-centers', pccCenterController.getAllPccCenters);

// Route to add new PCC center
router.post('/pcc-centers', pccCenterController.addPccCenter);

// Route to update PCC center
router.put('/pcc-centers/:id', pccCenterController.updatePccCenter);

// Route to delete PCC center
router.delete('/pcc-centers/:id', pccCenterController.deletePccCenter);

module.exports = router;

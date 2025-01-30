const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

router.get('/', departmentController.getDepartments);
router.get('/all', departmentController.getDepartmentsWithSubjects);

module.exports = router;
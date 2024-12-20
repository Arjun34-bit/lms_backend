const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/process', authMiddleware.verifyToken, authMiddleware.isStudentOrInstructor, transactionController.processTransaction);
router.post('/updateTransactionStatus', authMiddleware.verifyToken, transactionController.updateTransactionStatus);
module.exports = router;

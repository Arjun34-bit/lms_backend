// routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Route to add funds to wallet
router.post('/wallet/:userId/add-funds', walletController.addFunds);

// Route to check wallet balance
router.get('/wallet/:userId/check-balance', walletController.checkBalance);

// Route to view transaction history
router.get('/wallet/:userId/transactions', walletController.viewTransactions);

module.exports = router;

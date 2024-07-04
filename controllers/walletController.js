// controllers/walletController.js
const Wallet = require('../models/wallet');

// Add funds to wallet
exports.addFunds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body;

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    wallet.balance += amount;
    wallet.transactions.push({ type: 'credit', amount });
    await wallet.save();

    res.status(200).json({ message: 'Funds added successfully', wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check wallet balance
exports.checkBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View transaction history
exports.viewTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.status(200).json({ transactions: wallet.transactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

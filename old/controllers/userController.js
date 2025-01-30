const User = require('../models/userModel');

exports.updateEmail = async (req, res) => {
    try {
        const { userId, newEmail } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.email = newEmail;
        await user.save();
        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email', error: error.message });
    }
};

exports.linkSocialAccount = async (req, res) => {
    try {
        const { userId, provider, providerId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user[`${provider}Id`] = providerId;
        await user.save();
        res.status(200).json({ message: `${provider} account linked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error linking social account', error: error.message });
    }
};

exports.unlinkSocialAccount = async (req, res) => {
    try {
        const { userId, provider } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user[`${provider}Id`] = null;
        await user.save();
        res.status(200).json({ message: `${provider} account unlinked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error unlinking social account', error: error.message });
    }
}; 
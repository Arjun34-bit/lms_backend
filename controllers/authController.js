const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const { JWT_SECRET, TOKEN_EXPIRY } = require('../config/jwtConfig');
const encryptHelper = require('../utils/encryptHelper');
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.validateToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']?.split(' ')[1];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ valid: false, message: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const storedToken = await Token.findOne({ token, tokenable: decoded.id });
        if (!storedToken) {
            return res.status(401).json({ valid: false, message: 'Token not found in the database.' });
        }

        const isExpired = new Date(storedToken.expires_at) < new Date();
        if (isExpired) {
            return res.status(401).json({ valid: false, message: 'Token has expired.' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ valid: false, message: 'User not found.' });
        }

        res.status(200).json({
            valid: true,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                phone_number: user.phone_number,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (err) {
        res.status(401).json({ valid: false, message: 'Invalid token.', error: err.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, role, phone_number, name } = req.body;

        const validationErrors = [];
        if (!email) validationErrors.push('Email is required.');
        if (!password) validationErrors.push('Password is required.');
        if (!role) validationErrors.push('Role is required.');
        if (!name) validationErrors.push('Name is required.');

        if (validationErrors.length > 0) {
            return res.status(400).json({ message: validationErrors.join(' ') });
        }

        if (!encryptHelper.isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        const allowedRoles = ['admin', 'student', 'instructor'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(', ')}` });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword, role, phone_number, name });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.', user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(409).json({ message: `${duplicateField} is already in use.` });
        }
        res.status(500).json({ message: 'Error registering user.', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: ms(TOKEN_EXPIRY) / 1000 });
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + ms(TOKEN_EXPIRY) / 1000);

        await Token.create({
            tokenable: user._id,
            name: user.email,
            token,
            expires_at: expiresAt
        });

        res.status(200).json({ message: 'Login successful.', token, expiresAt });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in.', error: err.message });
    }
};

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

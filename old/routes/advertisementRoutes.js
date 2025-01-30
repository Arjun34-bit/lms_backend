const express = require('express');
const jwt = require('jsonwebtoken');
const Advertisement = require('../models/advertisementModel');
const { JWT_SECRET } = require('../config/jwtConfig');

const router = express.Router();

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token is missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token is invalid.' });
        }
        req.userId = decoded.id;
        next();
    });
}

// GET /api/advertisements
router.get('/', verifyToken, async (req, res) => {
    try {
        const advertisements = await Advertisement.find({ status: 'active' });
        const advertisementsWithUrl = advertisements.map(ad => {
            const filePath = ad.file_path ? `https://s3storage.duoples.com/pcc/${ad.file_path}` : undefined;
            return {
                _id: ad._id,
                title: ad.title,
                media_type: ad.media_type,
                file_path: filePath,
                status: ad.status,
                updated_at: ad.updated_at,
                created_at: ad.created_at
            };
        });
        res.json(advertisementsWithUrl);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching advertisements: ' + err.message });
    }
});

module.exports = router; 
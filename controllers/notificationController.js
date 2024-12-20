const jwt = require('jsonwebtoken');
const Notification = require('../models/notificationModel');
const { JWT_SECRET } = require('../config/jwtConfig');

exports.getNotifications = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const notifications = await Notification.find({ notifiable_id: userId }).sort({ created_at: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching notifications: ' + err.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const notification = await Notification.findOne({ _id: req.params.id, notifiable_id: userId });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        await notification.markAsRead();
        res.json({ message: 'Notification marked as read successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error marking notification as read: ' + err.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        await Notification.updateMany({ notifiable_id: userId, read_at: null }, { read_at: new Date() });
        res.json({ message: 'All notifications marked as read successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error marking all notifications as read: ' + err.message });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, notifiable_id: userId },
            { data: req.body.data },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ message: 'Notification updated successfully', notification });
    } catch (err) {
        res.status(500).json({ error: 'Error updating notification: ' + err.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token is missing or invalid.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        const notification = await Notification.findOneAndDelete({ _id: req.params.id, notifiable_id: userId });
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting notification: ' + err.message });
    }
};
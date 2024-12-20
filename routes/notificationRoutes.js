const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have an auth middleware

const router = express.Router();

router.get('/', authMiddleware.verifyToken, notificationController.getNotifications);
router.patch('/:id/read', authMiddleware.verifyToken, notificationController.markAsRead);
router.patch('/read-all', authMiddleware.verifyToken, notificationController.markAllAsRead);
router.put('/:id', authMiddleware.verifyToken, notificationController.updateNotification);
router.delete('/:id', authMiddleware.verifyToken, notificationController.deleteNotification);

module.exports = router; 
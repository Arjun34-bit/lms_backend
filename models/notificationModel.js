const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: { type: String, required: true },
    notifiable_type: { type: String, required: true },
    notifiable_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    read_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Middleware to update timestamps
notificationSchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

notificationSchema.methods.markAsRead = function() {
    this.read_at = new Date();
    return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema); 
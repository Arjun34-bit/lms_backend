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

// Middleware to handle creation and update timestamps
notificationSchema.pre('save', function(next) {
    if (this.isNew) {
        this.created_at = Date.now();
        this.updated_at = Date.now();
    } else {
        this.updated_at = Date.now();
    }
    next();
});

// Method to mark the notification as read
notificationSchema.methods.markAsRead = function() {
    this.read_at = new Date();
    return this.save();
};

// Create and export the model
module.exports = mongoose.model('Notification', notificationSchema);

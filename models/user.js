// models/user.js
const mongoose = require('mongoose');
const courseSchema = require('./course');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    cart: [{ type: String }], // Array of product IDs
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    purchased: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Array of purchased course IDs
        // wallet: Number,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
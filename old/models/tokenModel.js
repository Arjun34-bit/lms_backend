const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenable: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    token: { type: String, unique: true, required: true },
    abilities: { type: String },
    last_used_at: { type: Date },
    expires_at: { type: Date, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', tokenSchema);

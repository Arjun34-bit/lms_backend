const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    media_type: { type: String, required: true },
    file_path: { type: String, required: true },
    status: { type: String, required: true }
});

module.exports = mongoose.model('Advertisement', advertisementSchema); 
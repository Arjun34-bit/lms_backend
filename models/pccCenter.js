// models/PccCenter.js
const mongoose = require('mongoose');

const pccCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
});

module.exports = mongoose.model('PccCenter', pccCenterSchema);

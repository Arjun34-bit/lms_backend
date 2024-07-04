// models/TestSeries.js
const mongoose = require('mongoose');

const testSeriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model('TestSeries', testSeriesSchema);

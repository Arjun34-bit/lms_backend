const mongoose = require('mongoose');

// Define the schema for the Language model
const languageSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    native_name: { type: String, required: true },
    is_indian: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Create a model from the schema
const Language = mongoose.model('Language', languageSchema);

module.exports = Language;

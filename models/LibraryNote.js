// models/LibraryNote.js
const mongoose = require('mongoose');

// Define the schema for the LibraryNote model
const libraryNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',  // Assuming you have a Course model
    required: true
  },
  file_path: {
    type: String,
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const LibraryNote = mongoose.model('LibraryNote', libraryNoteSchema);

module.exports = LibraryNote;

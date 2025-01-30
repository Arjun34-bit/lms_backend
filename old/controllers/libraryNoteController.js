// controllers/libraryNoteController.js
const LibraryNote = require('../models/LibraryNote');
const Course = require('../models/courseModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

// Create a new library note


// Get all library notes
exports.getLibraryNotes = async (req, res) => {
  try {
    const libraryNotes = await LibraryNote.find().populate('course_id', 'title'); // Assuming Course has a name field
    res.status(200).json(libraryNotes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single library note by ID




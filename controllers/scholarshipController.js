// controllers/scholarshipController.js
const Scholarship = require('../models/scholarship');

// Fetch all scholarships
exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.status(200).json(scholarships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch a specific scholarship by ID
exports.getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;
    const scholarship = await Scholarship.findById(id);
    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.status(200).json(scholarship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new scholarship
exports.addScholarship = async (req, res) => {
  try {
    const { name, description, amount, eligibility, deadline } = req.body;
    const newScholarship = new Scholarship({
      name,
      description,
      amount,
      eligibility,
      deadline
    });
    await newScholarship.save();
    res.status(201).json({ message: 'Scholarship added successfully', scholarship: newScholarship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a scholarship
exports.updateScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, amount, eligibility, deadline } = req.body;
    const updatedScholarship = await Scholarship.findByIdAndUpdate(id, { name, description, amount, eligibility, deadline }, { new: true });
    if (!updatedScholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.status(200).json({ message: 'Scholarship updated successfully', scholarship: updatedScholarship });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a scholarship
exports.deleteScholarship = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScholarship = await Scholarship.findByIdAndDelete(id);
    if (!deletedScholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    res.status(200).json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

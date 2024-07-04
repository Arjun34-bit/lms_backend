// controllers/testSeriesController.js
const TestSeries = require('../models/testSeries');

// Fetch all test series
exports.getAllTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeries.find();
    res.status(200).json(testSeries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new test series
exports.addTestSeries = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTestSeries = new TestSeries({ title, description });
    await newTestSeries.save();
    res.status(201).json({ message: 'Test series added successfully', testSeries: newTestSeries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update test series
exports.updateTestSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedTestSeries = await TestSeries.findByIdAndUpdate(id, { title, description }, { new: true });
    if (!updatedTestSeries) {
      return res.status(404).json({ message: 'Test series not found' });
    }
    res.status(200).json({ message: 'Test series updated successfully', testSeries: updatedTestSeries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete test series
exports.deleteTestSeries = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestSeries = await TestSeries.findByIdAndDelete(id);
    if (!deletedTestSeries) {
      return res.status(404).json({ message: 'Test series not found' });
    }
    res.status(200).json({ message: 'Test series deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

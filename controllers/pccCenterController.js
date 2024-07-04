// controllers/pccCenterController.js
const PccCenter = require('../models/pccCenter');

// Fetch all PCC centers
exports.getAllPccCenters = async (req, res) => {
  try {
    const pccCenters = await PccCenter.find();
    res.status(200).json(pccCenters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new PCC center
exports.addPccCenter = async (req, res) => {
  try {
    const { name, location, contact } = req.body;
    const newPccCenter = new PccCenter({ name, location, contact });
    await newPccCenter.save();
    res.status(201).json({ message: 'PCC center added successfully', pccCenter: newPccCenter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update PCC center
exports.updatePccCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, contact } = req.body;
    const updatedPccCenter = await PccCenter.findByIdAndUpdate(id, { name, location, contact }, { new: true });
    if (!updatedPccCenter) {
      return res.status(404).json({ message: 'PCC center not found' });
    }
    res.status(200).json({ message: 'PCC center updated successfully', pccCenter: updatedPccCenter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete PCC center
exports.deletePccCenter = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPccCenter = await PccCenter.findByIdAndDelete(id);
    if (!deletedPccCenter) {
      return res.status(404).json({ message: 'PCC center not found' });
    }
    res.status(200).json({ message: 'PCC center deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

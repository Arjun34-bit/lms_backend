// controllers/materialController.js
const Material = require('../models/Material');

exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addMaterial = async (req, res) => {
  try {
    const { title, url } = req.body;
    const newMaterial = new Material({ title, url });
    await newMaterial.save();
    res.status(201).json({ message: 'Material added successfully', material: newMaterial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;
    const updatedMaterial = await Material.findByIdAndUpdate(id, { title, url }, { new: true });
    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json({ message: 'Material updated successfully', material: updatedMaterial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.status(200).json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Language = require('../models/Language');

// Fetch all languages
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching languages', error: err.message });
  }
};

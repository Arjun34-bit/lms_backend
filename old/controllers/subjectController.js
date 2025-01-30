const Subject = require('../models/Subject');

// Fetch all subjects
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
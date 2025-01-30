const Department = require('../models/Department');
const Subject = require('../models/Subject');

// Fetch all departments
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({
            success: true,
            data: departments.map(department => ({
                id: department._id,
                name: department.name,
                code: department.code,
                description: department.description
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Fetch all departments with their subjects
exports.getDepartmentsWithSubjects = async (req, res) => {
    try {
        const departments = await Department.find();
        const subjects = await Subject.find();

        const result = departments.map(department => {
            return {
                id: department._id,
                name: department.name,
                code: department.code,
                description: department.description,
                subjects: subjects
                    .filter(subject => subject.department_id.toString() === department._id.toString())
                    .map(subject => ({
                        id: subject._id,
                        name: subject.name,
                        code: subject.code,
                        description: subject.description
                    }))
            };
        });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
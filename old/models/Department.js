const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Department', DepartmentSchema);
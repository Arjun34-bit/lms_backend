const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    department_id: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model('Subject', SubjectSchema);
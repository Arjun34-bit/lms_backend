const mongoose = require('mongoose');
const validator = require('validator');

const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';
const ROLE_STUDENT = 'student';
const ROLE_INSTRUCTOR = 'instructor';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Invalid email address']
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true,
        enum: [ROLE_ADMIN, ROLE_USER, ROLE_STUDENT, ROLE_INSTRUCTOR],
        validate: {
            validator: function(value) {
                const validRoles = [ROLE_ADMIN, ROLE_USER, ROLE_STUDENT, ROLE_INSTRUCTOR];
                if (!validRoles.includes(value)) {
                    throw new Error('Invalid role assigned.');
                }
                return true;
            }
        }
    },
    phone_number: {
        type: String,
        unique: true,
        sparse: true
    },
    address: { type: String },
    name: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
    appleId: { type: String, unique: true, sparse: true }
}, {
    timestamps: true
});

// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ phone_number: 1 }, { unique: true, sparse: true });

userSchema.statics.roles = function() {
    return [ROLE_ADMIN, ROLE_USER, ROLE_STUDENT, ROLE_INSTRUCTOR];
};

userSchema.methods.setRole = function(value) {
    const validRoles = this.constructor.roles();
    if (!validRoles.includes(value)) {
        throw new Error('Invalid role assigned.');
    }
    this.role = value;
};

module.exports = mongoose.model('User', userSchema);


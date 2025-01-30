const mongoose = require("mongoose");
const validator = require("validator");

const ROLE_ADMIN = "admin";
const ROLE_USER = "user";
const ROLE_STUDENT = "student";
const ROLE_INSTRUCTOR = "instructor";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    departments: {
      type: String,
    },
    subjects: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: [ROLE_ADMIN, ROLE_USER, ROLE_STUDENT, ROLE_INSTRUCTOR],
      validate: {
        validator: function (value) {
          const validRoles = [
            ROLE_ADMIN,
            ROLE_USER,
            ROLE_STUDENT,
            ROLE_INSTRUCTOR,
          ];
          if (!validRoles.includes(value)) {
            throw new Error("Invalid role assigned.");
          }
          return true;
        },
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["approved", "pending"],
      default: "pending", // Default status for most roles
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
      validate: [validator.isMobilePhone, "Invalid phone number"],
    },
    address: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    appleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get the list of valid roles
userSchema.statics.roles = function () {
  return [ROLE_ADMIN, ROLE_USER, ROLE_STUDENT, ROLE_INSTRUCTOR];
};

// Method to set the user's role
userSchema.methods.setRole = function (value) {
  const validRoles = this.constructor.roles();
  if (!validRoles.includes(value)) {
    throw new Error("Invalid role assigned.");
  }
  this.role = value;
};

module.exports = mongoose.model("User", userSchema);

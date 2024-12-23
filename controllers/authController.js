const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const mongoose = require('mongoose');

const User = require('../models/userModel');
const Notification = require('../models/notificationModel');
const Token = require('../models/tokenModel');
const { JWT_SECRET, TOKEN_EXPIRY } = require('../config/jwtConfig');
const encryptHelper = require('../utils/encryptHelper');
const admin = require('firebase-admin');
const Department = require('../models/Department'); // Import Department model
const Subject = require('../models/Subject'); // Import Subject model
const serviceAccount = require('../config/firebaseServiceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

exports.getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user and exclude unnecessary fields
        const user = await User.findById(userId)
            .lean()
            .select('email name role phone_number status departments subjects address googleId facebookId appleId createdAt');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Fetch the departments and subjects by their IDs
        const departmentIds = user.departments.split(',').map(id => new mongoose.Types.ObjectId(id));
        const subjectIds = user.subjects.split(',').map(id => new mongoose.Types.ObjectId(id));

        const departments = await Department.find({
            '_id': { $in: departmentIds }
        }).select('_id name'); // Include both _id and name

        const subjects = await Subject.find({
            '_id': { $in: subjectIds }
        })
            .populate('department_id', '_id name') // Populate department details
            .select('_id name code description department_id'); // Include relevant fields

        // Map the fetched departments' details
        const departmentDetails = departments.map(department => ({
            id: department._id,
            name: department.name
        }));

        // Map the fetched subjects' details with their associated department details
        const subjectDetails = subjects.map(subject => ({
            id: subject._id,
            name: subject.name,
            code: subject.code,
            description: subject.description,
            department: subject.department_id
                ? { id: subject.department_id._id, name: subject.department_id.name }
                : null
        }));

        // Return the user profile with resolved department and subject details
        res.status(200).json({
            message: 'User profile fetched successfully.',
            user: {
                ...user,
                departments: departmentDetails,
                subjects: subjectDetails
            }
        });
    } catch (err) {
        console.error('Error fetching user profile: ', err.message);
        res.status(500).json({ message: 'Error fetching user profile.', error: err.message });
    }
};

exports.validateToken = async (req, res) => {
    try {
      // Get the Authorization header
      const authHeader = req.headers['authorization'];
      
      if (!authHeader) {
        return res.status(401).json({ valid: false, message: 'Authorization header is missing.' });
      }
  
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'Token is missing or invalid. It must start with "Bearer ". ' });
      }
  
      const token = authHeader.split(' ')[1]; // Extract token from Bearer
  
      // Decode and verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
  
      // Check if the token exists in the database
      const storedToken = await Token.findOne({ token, tokenable: decoded.id });
      if (!storedToken) {
        return res.status(401).json({ valid: false, message: 'Token not found in the database.' });
      }
  
      // Check if the token is expired
      if (new Date(storedToken.expires_at) < new Date()) {
        return res.status(401).json({ valid: false, message: 'Token has expired.' });
      }
  
      // Check if the user exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ valid: false, message: 'User not found.' });
      }
  
      // Return success response
      res.status(200).json({
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          phone_number: user.phone_number,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (err) {
      // Handle errors and log for debugging purposes
      console.error('Token validation error: ', err.message);
      
      // Specific error handling based on the type of error
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ valid: false, message: 'Invalid token.', error: err.message });
      }
  
      // Generic error fallback
      return res.status(500).json({ valid: false, message: 'An error occurred while validating the token.', error: err.message });
    }
  };

  
  exports.register = async (req, res) => {
      try {
          const { email, password, role, phone_number, name, departments, subjects } = req.body;
          const validationErrors = [];
  
          if (!email) validationErrors.push('Email is required.');
          if (!password) validationErrors.push('Password is required.');
          if (!role) validationErrors.push('Role is required.');
          if (!name) validationErrors.push('Name is required.');
  
          if (validationErrors.length > 0) {
              return res.status(400).json({ message: validationErrors.join(' ') });
          }
  
          if (!encryptHelper.isValidEmail(email)) {
              return res.status(400).json({ message: 'Invalid email address.' });
          }
  
          const allowedRoles = ['admin', 'student', 'instructor'];
          if (!allowedRoles.includes(role)) {
              return res.status(400).json({ message: `Role must be one of: ${allowedRoles.join(', ')}` });
          }
  
          // Validate departments and subjects as optional fields
          const finalDepartments = Array.isArray(departments) ? departments.join(", ") : ""; // Convert to comma-separated string
          const finalSubjects = Array.isArray(subjects) ? subjects.join(", ") : "";  // Convert to comma-separated string
  
          let status = 'pending';  // Default status
          if (role === 'admin' || role === 'student') {
              status = 'approved';  // Set to approved for admin and student roles
          }
  
          const hashedPassword = await bcrypt.hash(password, 12);
          const user = new User({
              email,
              password: hashedPassword,
              role,
              phone_number,
              name,
              departments: finalDepartments,  // Save as string
              subjects: finalSubjects,        // Save as string
              status  // Set the status based on the role
          });
  
          await user.save();
  
          // Send a notification if the user is an instructor or student
          if (role === 'instructor' || role === 'student') {
            // Send notifications to all admins
            const admins = await User.find({ role: 'admin' });
            for (const admin of admins) {
                const adminNotification = new Notification({
                    type: 'new_user_registration',
                    notifiable_type: 'Admin',
                    notifiable_id: admin._id,
                    data: {
                        message: `A new ${role} has been registered: ${user.name} (${user.email})`
                    },
                    read_at: null,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                await adminNotification.save();
            }
        }
        
  
          res.status(201).json({
              message: 'User registered successfully.',
              user: {
                  id: user._id,
                  email: user.email,
                  name: user.name,
                  status: user.status  // Include status in the response
              }
          });
      } catch (err) {
          if (err.code === 11000) {
              const duplicateField = Object.keys(err.keyValue)[0];
              return res.status(409).json({ message: `${duplicateField} is already in use.` });
          }
          res.status(500).json({ message: 'Error registering user.', error: err.message });
      }
  };
  





  exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        // Perform a case-insensitive search for the email
        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, 'i') }, // Case-insensitive match
        });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user is approved
        if (user.status !== 'approved') {
            return res.status(403).json({
                message: 'User account is not approved. Please contact support.',
            });
        }

        // Verify the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: ms(TOKEN_EXPIRY) / 1000 }
        );

        // Calculate the expiration time
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + ms(TOKEN_EXPIRY) / 1000);

        // Save the token in the database
        await Token.create({
            tokenable: user._id,
            name: user.email,
            token,
            expires_at: expiresAt,
        });

        // Respond with success
        res.status(200).json({
            message: 'Login successful.',
            token,
            expiresAt,
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({
            message: 'Error logging in.',
            error: err.message,
        });
    }
};


exports.updateEmail = async (req, res) => {
    try {
        const { userId, newEmail } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.email = newEmail;
        await user.save();
        res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating email', error: error.message });
    }
};

exports.linkSocialAccount = async (req, res) => {
    try {
        const { userId, provider, providerId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user[`${provider}Id`] = providerId;
        await user.save();
        res.status(200).json({ message: `${provider} account linked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error linking social account', error: error.message });
    }
};

exports.unlinkSocialAccount = async (req, res) => {
    try {
        const { userId, provider } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user[`${provider}Id`] = null;
        await user.save();
        res.status(200).json({ message: `${provider} account unlinked successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error unlinking social account', error: error.message });
    }
};

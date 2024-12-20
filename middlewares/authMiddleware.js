const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

module.exports = {
  // Middleware to verify JWT token
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token is missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Attach decoded user info to the request object
      next(); // Proceed to the next middleware or controller
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  },

  // Middleware to check if the user has the role of 'student' or 'instructor'
  isStudentOrInstructor: (req, res, next) => {
    const allowedRoles = ['student', 'instructor'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Only students and instructors are allowed.' });
    }
    next(); // Proceed to the next middleware or controller
  }
};

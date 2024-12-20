  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('../config/jwtConfig'); // Ensure the JWT secret is properly imported

  module.exports = {
    // Middleware to verify JWT token
    verifyToken: (req, res, next) => {
      // Extract token from Authorization header
      const authHeader = req.headers['authorization'];

      // If no token or if it doesn't start with 'Bearer ', return an error
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token is missing or invalid.' });
      }

      // Extract the token from the Authorization header
      const token = authHeader.split(' ')[1];

      // Verify the token and attach user info to the request object
      try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify the JWT token using the secret
        req.user = decoded; // Attach decoded user info (e.g., user ID, role) to the request object
        next(); // Proceed to the next middleware/controller
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
      }
    },

    // Middleware to check if the user has the role of 'student' or 'instructor'
    isStudentOrInstructor: (req, res, next) => {
      // Check if the user has a valid role
      const allowedRoles = ['student', 'instructor'];

      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Only students and instructors are allowed.' });
      }

      // If role is valid, proceed to the next middleware or controller
      next();
    },
  };

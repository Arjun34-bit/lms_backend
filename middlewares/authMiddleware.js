const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

module.exports = {
  verifyToken: (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Token is required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token.' });
      }
      req.user = decoded; // Attach decoded token to the request object
      next();
    });
  },

  isStudentOrInstructor: (req, res, next) => {
    const allowedRoles = ['student', 'instructor'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Only students and instructors are allowed.' });
    }
    next();
  },
};

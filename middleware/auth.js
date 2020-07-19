const jwt = require('jsonwebtoken');
const pool = require('../db');
const { errorResponse } = require('../middleware');

// Protect routes

module.exports = {
  async protect(req, res, next) {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer') //for development with postman token
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    // token = req.cookies.token; // for production
    // }
    // Make sure token exists
    if (!token) {
      return next(errorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const query = 'SELECT * FROM users WHERE user_id = $1';
      const { rows } = await pool.query(query, [decoded.id]);
      req.user = rows[0];

      next();
    } catch (err) {
      return next(
        errorResponse('Not authorized to access this route', 401, res)
      );
    }
  },

  // Grant access to specific roles
  authorize(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return errorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403,
          res
        );
      }
      next();
    };
  },
};

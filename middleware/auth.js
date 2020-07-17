const jwt = require('jsonwebtoken');
const pool = require('../db');

// Protect routes

module.exports = {
  async protect(req, res, next) {
    let token;

    if (req.headers.cookie) {
      // Set token from cookie token in header
      token = req.headers.cookie.split('token=')[1];
    }

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
        return next(
          errorResponse('Not authorized to access this route', 401, res)
        );
      }
      next();
    };
  },
};

const errorResponse = (message, statusCode, res) => {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

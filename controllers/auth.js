const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { errorResponse } = require('../middleware');

module.exports = {
  async register(req, res, next) {
    const query =
      'INSERT INTO users (username, password, email, role, created_at) VALUES ($1, $2, $3, $4, (SELECT NOW())) RETURNING *';

    let { username, password, email, role } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    role = role === '' ? 'user' : role;
    const values = [username, password, email, role];
    const { rows: user } = await pool.query(query, values);
    req.user = user[0];

    sendTokenResponse(user, 201, res, req);
  },
  async login(req, res, next) {
    const { email, password } = req.body;

    const query = 'SELECT user_id,email,password FROM users WHERE email = $1';
    const { rows: user } = await pool.query(query, [email]);
    req.user = user[0];
    // Check for user
    if (!user.length) {
      return next(errorResponse('Invalid credentials', 401, res));
    }

    // Check if password matches
    const matchPassword = async (enteredPassword) => {
      return await bcrypt.compare(enteredPassword, user[0].password);
    };

    const isMatch = await matchPassword(password);

    if (!isMatch) {
      return next(errorResponse('Invalid credentials', 401, res));
    }
    sendTokenResponse(user, 200, res, req);
  },

  logout(req, res, next) {
    res.cookie('token', 'none', {
      expires: new Date(Date.now + 10 * 1000),
      httpOnly: true,
    });

    res.json({
      success: true,
      data: {},
    });
  },
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res, req) => {
  // Create token
  const token = getSignedJwtToken(req);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  //   if (process.env.NODE_ENV === 'production') {
  //     options.secure = true;
  //   }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// Sign JWT and return
const getSignedJwtToken = (req) => {
  return jwt.sign(
    {
      id: req.user.user_id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

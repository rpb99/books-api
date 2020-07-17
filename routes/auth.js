const express = require('express');
const router = express.Router();

const { register, login, logout } = require('../controllers/auth');
const { asyncHandler } = require('../middleware');

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/logout', logout);

module.exports = router;

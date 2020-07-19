require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Router files
const auth = require('./routes/auth');
const authors = require('./routes/authors');
const books = require('./routes/books');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/authors', authors);
app.use('/api/v1/books', books);

module.exports = app;

const pool = require('../db');
const { errorResponse } = require('../middleware');
const path = require('path');

module.exports = {
  // @desc      Get books
  // @route     GET /api/v1/books
  // @access    Public
  async getBooks(req, res, next) {
    const query = 'SELECT * FROM books';
    const { rows } = await pool.query(query);

    res.json({ data: rows });
  },

  // @desc      Get single book
  // @route     GET /api/v1/books/:id
  // @access    Public
  async getBook(req, res, next) {
    const { id } = req.params;
    const query = 'SELECT * FROM books WHERE book_id = $1';
    const { rows } = await pool.query(query, [id]);
    if (!rows.length) {
      return next(errorResponse(`Book not found with id of ${id}`, 404, res));
    } else {
      res.status(200).json({
        success: true,
        data: rows[0],
      });
    }
  },

  // @desc      Add book
  // @route     POST /api/v1/books
  // @access    Private
  async addBook(req, res, next) {
    const { id } = req.params;
    const queryId = 'SELECT book_id FROM books WHERE book_id = $1';
    const { rows: book_id } = await pool.query(queryId, [id]);

    const query = `
      INSERT INTO books 
        (title, description, image, total_pages, isbn, user_id, published_date) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, (SELECT NOW())) 
      RETURNING *`;

    let { title, description, image, total_pages, isbn, user_id } = req.body;
    user_id = req.user.user_id;

    const { file } = req.files;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return errorResponse('Please upload an image file', 400, res);
    }

    if (file.size > 3000000) {
      return errorResponse(
        `Please upload an image less than 3 Megabyte`,
        400,
        res
      );
    }

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return errorResponse(`Problem with file upload`, 500, res);
      }
    });

    image = file.name;

    const { rows: book } = await pool.query(query, [
      title,
      description,
      image,
      total_pages,
      isbn,
      user_id,
    ]);

    res.status(201).json({ data: book[0] });
  },

  // @desc      Update book
  // @route     PUT /api/v1/book/:id
  // @access    Private
  async updateBook(req, res, next) {
    const { id } = req.params;

    const {
      rows: book,
    } = await pool.query('SELECT book_id FROM books WHERE book_id = $1', [id]);

    if (!book.length) {
      return next(errorResponse(`Book not found with id of ${id}`, 404, res));
    }

    let { title, description, image, total_pages, isbn } = req.body;

    const { file } = req.files;

    const query =
      'UPDATE books SET title=$1, description=$2, image=$3, total_pages=$4, isbn=$5, published_date=(SELECT NOW()) WHERE book_id = $6 RETURNING *';

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return errorResponse('Please upload an image file', 400, res);
    }

    if (file.size > 3000000) {
      return errorResponse(
        `Please upload an image less than 3 Megabyte`,
        400,
        res
      );
    }

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.log(err);
        return errorResponse(`Problem with file upload`, 500, res);
      }
    });

    image = file.name;

    let { rows } = await pool.query(query, [
      title,
      description,
      image,
      total_pages,
      isbn,
      id,
    ]);

    res.json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Delete book
  // @route     DELETE /api/v1/books
  // @access    Private
  async deleteBook(req, res, next) {
    const { id } = req.params;

    const {
      rows: book,
    } = await pool.query('SELECT book_id FROM books WHERE book_id = $1', [id]);

    if (!book.length) {
      return next(errorResponse(`Book not found with id of ${id}`, 404, res));
    }

    const query = 'DELETE FROM books WHERE book_id = $1';
    await pool.query(query, [id]);

    res.json({
      success: true,
      data: {},
    });
  },

  // @desc      Create Book author
  // @route     POST /api/v1/books/authors
  // @access    Private
  async bookAuthor(req, res, next) {
    const { book_id, author_id } = req.body;

    if (!book_id || !author_id) {
      return errorResponse('Please provide a book and author', 400, res);
    }

    const queryStr = `
    SELECT books.book_id, authors.author_id
    FROM book_authors
    JOIN books
        ON books.book_id = book_authors.book_id
    JOIN authors
        ON authors.author_id = book_authors.author_id
      `;
    const { rows: book_authorsId } = await pool.query(queryStr);

    for (const prop in book_authorsId) {
      const { book_id, author_id } = book_authorsId[prop];
      if (book_id === book_id && author_id === author_id) {
        return errorResponse('The book has same owner', 400, res);
      }
    }

    const query = `INSERT INTO book_authors (book_id, author_id, created_at) VALUES ($1, $2, (SELECT NOW())) RETURNING *`;
    const { rows } = await pool.query(query, [book_id, author_id]);

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Get all book author
  // @route     POST /api/v1/books/authors
  // @access    Private
  async getBookAuthors(req, res, next) {
    const query = `
    SELECT *
    FROM book_authors
    JOIN books 
        ON books.book_id = book_authors.book_id
    JOIN authors 
        ON authors.author_id = book_authors.author_id`;

    const { rows } = await pool.query(query);

    res.json({
      success: true,
      data: rows,
    });
  },
  // @desc      Delete book author
  // @route     DELETE /api/v1/books/authors/:book_id/:author_id
  // @access    Private
  async deleteBookAuthor(req, res, next) {
    const query = `
    DELETE FROM book_authors 
    WHERE book_id = $1 AND author_id = $2`;

    const { book_id, author_id } = req.params;
    await pool.query(query, [book_id, author_id]);

    res.json({
      success: true,
      data: {},
    });
  },
};

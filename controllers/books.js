const pool = require('../db');
const { errorResponse } = require('../middleware');

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
    const query =
      'INSERT INTO books (title, description, image, total_pages, isbn, published_date, user_id) VALUES ($1, $2, $3, $4, $5, (SELECT NOW()), $6) RETURNING *';

    req.body.user_id = req.user.user_id;
    const { title, description, image, total_pages, isbn, user_id } = req.body;

    let { rows: book } = await pool.query(query, [
      title,
      description,
      image,
      total_pages,
      isbn,
      user_id,
    ]);

    res.status(201).json({ data: book[0] });
  },

  // @desc      Update publisher
  // @route     POST /api/v1/publishers/:id
  // @access    Private
  async updatePublisher(req, res, next) {
    const { id } = req.params;

    let {
      rows: publisher,
    } = await pool.query('SELECT * FROM publishers WHERE publisher_id = $1', [
      id,
    ]);

    if (!publisher.length) {
      return next(
        errorResponse(`Publisher not found with id of ${id}`, 404, res)
      );
    }

    const query =
      'UPDATE publishers SET name = $1, created_at = (SELECT NOW()) WHERE publisher_id = $2 RETURNING *';

    publisher = await pool.query(query, [req.body.name, id]);

    res.json({
      success: true,
      data: publisher[0],
    });
  },

  // @desc      Delete publisher
  // @route     POST /api/v1/publishers
  // @access    Private
  async deletePublisher(req, res, next) {
    let {
      rows: publisher,
    } = await pool.query('SELECT * FROM publishers WHERE publisher_id = $1', [
      req.params.id,
    ]);

    if (!publisher.length) {
      return next(
        errorResponse(
          `Publisher not found with id of ${req.params.id}`,
          404,
          res
        )
      );
    } else {
      const query =
        'DELETE FROM publishers WHERE publisher_id = $1 RETURNING *';
      const { rows: publisher } = await pool.query(query, [req.params.id]);
      res.json({
        success: true,
        data: {},
      });
    }
  },
};

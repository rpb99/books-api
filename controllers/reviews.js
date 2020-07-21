const pool = require('../db');
const { errorResponse } = require('../middleware');

module.exports = {
  // @desc      Get reviews
  // @route     GET /api/v1/books/:bookId/reviews
  // @access    Public
  async getReviews(req, res, next) {
    const { bookId } = req.params;

    const values = [rating, description, book_id, user_id];

    const query = `
    SELECT * FROM reviews 
    JOIN books
        ON books.book_id = reviews.book_id`;
    const { rows } = await pool.query(query);

    res.json({
      success: true,
      data: rows,
    });
  },

  // @desc      Add review
  // @route     POST /api/v1/books/:bookId/reviews
  // @access    Private
  async addReview(req, res, next) {
    const { bookId } = req.params;
    let { rating, body } = req.body;

    book_id = bookId;
    user_id = req.user.user_id;

    const values = [rating, body, book_id, user_id];

    let {
      rows: isHaveRating,
    } = await pool.query('SELECT * FROM reviews WHERE user_id = $1', [user_id]);

    if (isHaveRating.length) {
      return errorResponse('you only have once rating', 400, res);
    }

    const query = `
        INSERT INTO reviews 
         (rating, body, book_id, user_id, created_at)
        VALUES ($1, $2, $3, $4, (SELECT NOW())) RETURNING *`;
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Update review
  // @route     PUT /api/v1/books/:bookId/reviews/:reviewId
  // @access    Private
  async updateReview(req, res, next) {
    const { reviewId } = req.params;
    const { rating, body } = req.body;
    const userId = req.user.user_id;

    const queryUserId = 'SELECT * FROM reviews WHERE review_id = $1';
    const { rows: userIdRow } = await pool.query(queryUserId, [reviewId]);

    if (userIdRow[0].user_id !== userId) {
      return errorResponse('Invalid Credentials', 403, res);
    }

    const values = [rating, body, reviewId];

    const query = `
    UPDATE reviews 
    SET rating = $1, body = $2, created_at = (SELECT NOW()) WHERE review_id = $3 RETURNING *`;
    const { rows } = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Delete review
  // @route     DELETE /api/v1/books/:bookId/reviews/:review_id
  // @access    Private
  async deleteReview(req, res, next) {
    const { reviewId } = req.params;
    const userId = req.user.user_id;

    const queryUserId = 'SELECT * FROM reviews WHERE review_id = $1';
    const { rows: userIdRow } = await pool.query(queryUserId, [reviewId]);

    if (!userIdRow.length) {
      return errorResponse('Not found', 404, res);
    }

    if (userIdRow[0].user_id !== userId) {
      return errorResponse('Invalid Credentials', 403, res);
    }

    const query = 'DELETE FROM reviews WHERE review_id = $1';
    await pool.query(query, [reviewId]);

    res.json({
      success: true,
      data: {},
    });
  },
};

const pool = require('../db');
const { errorResponse } = require('../middleware');

module.exports = {
  // @desc      Get authors
  // @route     GET /api/v1/authors
  // @access    Private
  async getAuthors(req, res, next) {
    const query = 'SELECT * FROM authors';
    const { rows } = await pool.query(query);

    res.json({ data: rows });
  },

  // @desc      Get single author
  // @route     GET /api/v1/authors/:id
  // @access    Private
  async getAuthor(req, res, next) {
    const { id } = req.params;
    eval(require('locus'));

    const query = 'SELECT * FROM authors WHERE author_id = $1';
    const { rows } = await pool.query(query, [id]);
    if (!rows.length) {
      return errorResponse(`Authors not found with id of ${id}`, 404, res);
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Add author
  // @route     POST /api/v1/authors
  // @access    Private
  async addAuthor(req, res, next) {
    const query =
      'INSERT INTO authors (first_name, middle_name, last_name, user_id, created_at) VALUES ($1, $2, $3, $4, (SELECT NOW())) RETURNING *';

    let { first_name, middle_name, last_name, user_id } = req.body;
    user_id = req.user.user_id;

    const { rows } = await pool.query(query, [
      first_name,
      middle_name,
      last_name,
      user_id,
    ]);

    res.status(201).json({ data: rows[0] });
  },

  // @desc      Update author
  // @route     PUT /api/v1/authors/:id
  // @access    Private
  async updateAuthor(req, res, next) {
    const { id } = req.params;

    const {
      rows: author,
    } = await pool.query('SELECT author_id FROM authors WHERE author_id = $1', [
      id,
    ]);

    if (!author.length) {
      return errorResponse(`Author not found with id of ${id}`, 404, res);
    }

    const query =
      'UPDATE authors SET first_name=$1, middle_name=$2, last_name=$3, created_at=(SELECT NOW()) WHERE author_id = $4 RETURNING *';

    const { first_name, middle_name, last_name } = req.body;

    let { rows } = await pool.query(query, [
      first_name,
      middle_name,
      last_name,
      id,
    ]);

    res.json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Delete author
  // @route     DELETE /api/v1/authors
  // @access    Private
  async deleteAuthor(req, res, next) {
    const { id } = req.params;

    const {
      rows: author,
    } = await pool.query('SELECT author_id FROM authors WHERE author_id = $1', [
      id,
    ]);

    if (!author.length) {
      return errorResponse(`author not found with id of ${id}`, 404, res);
    }

    const query = 'DELETE FROM authors WHERE author_id = $1';
    await pool.query(query, [id]);

    res.json({
      success: true,
      data: {},
    });
  },
};

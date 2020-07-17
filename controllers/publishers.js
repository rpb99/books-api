const pool = require('../db');
const { errorResponse } = require('../middleware');

module.exports = {
  // @desc      Get publishers
  // @route     GET /api/v1/publishers
  // @access    Private/Admin
  async getPublishers(req, res, next) {
    const query = 'SELECT * FROM publishers';
    const { rows } = await pool.query(query);
    res.json({ data: rows });
  },

  // @desc      Get single publisher
  // @route     GET /api/v1/publishers/:id
  // @access    Private
  async getPublisher(req, res, next) {
    const query = 'SELECT * FROM publishers WHERE publisher_id = $1';
    const { rows } = await pool.query(query, [req.params.id]);
    if (!rows.length) {
      return next(
        errorResponse(
          `Publisher not found with id of ${req.params.id}`,
          404,
          res
        )
      );
    } else {
      res.status(200).json({
        success: true,
        data: rows[0],
      });
    }
  },

  // @desc      Add publisher
  // @route     POST /api/v1/publishers
  // @access    Private
  async addPublisher(req, res, next) {
    const query =
      'INSERT INTO publishers(name, created_at) VALUES($1, (SELECT NOW())) RETURNING *';
    const { rows } = await pool.query(query, [req.body.name]);

    res.status(201).json({ data: rows });
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

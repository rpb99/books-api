const pool = require('../db');
const { errorResponse } = require('../middleware');
module.exports = {
  // @desc      Get Genres
  // @route     GET /api/v1/genres
  // @access    Private
  async getGenres(req, res, next) {
    const query = 'SELECT * FROM genres';
    const { rows: genres } = await pool.query(query);

    res.json({
      success: true,
      data: genres,
    });
  },

  // @desc      Get Single Genres
  // @route     GET /api/v1/genres/:id
  // @access    Private
  async getGenre(req, res, next) {
    const { id } = req.params;
    const query = 'SELECT * FROM genres WHERE genre_id = $1';
    const { rows: genre } = await pool.query(query, [id]);

    if (!genre.length) {
      return errorResponse(`Genre not found with id of ${id}`, 404, res);
    }

    res.json({
      success: true,
      data: genre[0],
    });
  },

  // @desc      Add Genre
  // @route     POST /api/v1/genres
  // @access    Private
  async addGenre(req, res, next) {
    const { genre } = req.body;
    const query = 'INSERT INTO genres (genre) VALUES ($1) RETURNING *';
    const { rows } = await pool.query(query, [genre]);

    if (!genre) {
      return errorResponse('Please provide a genre', 400, res);
    }

    res.status(201).json({
      success: true,
      data: rows[0],
    });
  },

  // @desc      Update Genre
  // @route     PUT /api/v1/genres/:id
  // @access    Private
  async updateGenre(req, res, next) {
    const { id } = req.params;
    const { genre } = req.body;

    const getGenreQuery = 'SELECT genre_id FROM genres WHERE genre_id = $1';
    const { rows: getGenre } = await pool.query(getGenreQuery, [id]);

    if (!genre) {
      return errorResponse('Please provide a genre', 400, res);
    }

    if (!getGenre.length) {
      return errorResponse(`Genre not found with id of ${id}`, 404, res);
    }

    const updateGenreQuery =
      'UPDATE genres SET genre = $1 WHERE genre_id = $2 RETURNING *';
    const { rows: updateGenre } = await pool.query(updateGenreQuery, [
      genre,
      id,
    ]);

    res.json({
      success: true,
      data: updateGenre[0],
    });
  },

  // @desc      Delete Genre
  // @route     DELETE /api/v1/genres/:id
  // @access    Private

  async deleteGenre(req, res, next) {
    const { id } = req.params;
    const query = 'DELETE FROM genres WHERE genre_id = $1';
    await pool.query(query, [id]);
    res.json({
      success: true,
      data: {},
    });
  },
};

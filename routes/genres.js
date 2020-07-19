const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware');
const { protect, authorize } = require('../middleware/auth');
const {
  getGenres,
  getGenre,
  addGenre,
  updateGenre,
  deleteGenre,
} = require('../controllers/genres');

router
  .route('/')
  .get(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(getGenres)
  )
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(addGenre)
  );

router
  .route('/:id')
  .get(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(getGenre)
  )
  .put(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(updateGenre)
  )
  .delete(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(deleteGenre)
  );

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  addAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authors');
const { asyncHandler } = require('../middleware');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(asyncHandler(getAuthors))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(addAuthor)
  );

router
  .route('/:id')
  .get(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(getAuthor)
  )
  .put(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(updateAuthor)
  )
  .delete(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(deleteAuthor)
  );

module.exports = router;

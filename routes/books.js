const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware');
const { protect, authorize } = require('../middleware/auth');
const {
  getBooks,
  getBook,
  addBook,
  updateBook,
  deleteBook,
  bookAuthor,
  deleteBookAuthor,
  getBookAuthors,
} = require('../controllers/books');

router
  .route('/authors/:book_id/:author_id')
  .get(asyncHandler(deleteBookAuthor))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(bookAuthor)
  );

router
  .route('/authors')
  .get(asyncHandler(getBookAuthors))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(bookAuthor)
  );

router
  .route('/')
  .get(asyncHandler(getBooks))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(addBook)
  );

router
  .route('/:id')
  .get(asyncHandler(getBook))
  .put(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(updateBook)
  )
  .delete(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(deleteBook)
  );

module.exports = router;

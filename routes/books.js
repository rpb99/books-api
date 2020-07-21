const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware');
const { protect, authorize } = require('../middleware/auth');
const {
  getBooks,
  getBook,
  getBookAuthors,
  getBookGenres,
  addBook,
  addBookAuthor,
  addBookGenre,
  updateBook,
  deleteBook,
  deleteBookAuthor,
  deleteBookGenre,
} = require('../controllers/books');

// Route book genres
router
  .route('/genres/:book_id/:genre_id')
  .delete(asyncHandler(deleteBookGenre));

router
  .route('/genres')
  .get(asyncHandler(getBookGenres))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(addBookGenre)
  );

// Route book authors
router
  .route('/authors')
  .get(asyncHandler(getBookAuthors))
  .post(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(addBookAuthor)
  );

router
  .route('/authors/:book_id/:author_id')
  .delete(
    asyncHandler(protect),
    authorize('publisher', 'admin'),
    asyncHandler(deleteBookAuthor)
  );

// Route books
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

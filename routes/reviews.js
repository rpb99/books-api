const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncHandler } = require('../middleware');
const { protect } = require('../middleware/auth');
const {
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

router.post('/', asyncHandler(protect), asyncHandler(addReview));

router
  .route('/:reviewId')
  .put(asyncHandler(protect), asyncHandler(updateReview))
  .delete(asyncHandler(protect), asyncHandler(deleteReview));

module.exports = router;

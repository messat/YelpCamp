const express= require('express')
const router = express.Router({ mergeParams: true})

const {validateReview, isLoggedIn, isReviewAuthor} = require('../validateMiddleware.js')
const catchAsync = require('../utils/catchAsync');
const { createReviews, deleteReviews } = require('../controller/reviews.js');

router.post('/', isLoggedIn, validateReview, catchAsync(createReviews))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReviews))

module.exports = router
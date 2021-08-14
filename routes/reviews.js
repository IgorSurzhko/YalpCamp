const express = require('express');
const router = express.Router({ mergeParams: true }); //passes params (camp.id) into the router
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middlewares');

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;

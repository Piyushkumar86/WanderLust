const express = require('express');
const router = express.Router({ mergeParams: true});
const wrapAsyc = require('../utils/wrapAsyc.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsyc(reviewController.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsyc(reviewController.deleteReview));

module.exports = router;
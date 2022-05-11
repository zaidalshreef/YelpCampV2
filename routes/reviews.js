const express = require("express");
const router = express.Router({mergeParams: true});	
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");



router.post(
  "/",isLoggedIn,
  validateReview,
  catchAsync(reviews.create)
);

router.delete(
  "/:review_id",isLoggedIn,isReviewAuthor,
  catchAsync(reviews.destroy)
);

module.exports = router;

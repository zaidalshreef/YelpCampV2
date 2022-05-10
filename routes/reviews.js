const express = require("express");
const router = express.Router({mergeParams: true});	
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../schemas");
const expressError = require("../utils/expressError");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");



router.post(
  "/",isLoggedIn,
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.Review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review created successfully");
    res.redirect("/campgrounds/" + campground._id);
  })
);

router.delete(
  "/:review_id",isLoggedIn,isReviewAuthor,
  catchAsync(async (req, res, next) => {
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review deleted successfully");
    res.redirect("/campgrounds/" + id);
  })
);

module.exports = router;

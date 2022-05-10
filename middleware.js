const { campgroundSchema } = require("./schemas");
const { reviewSchema } = require("./schemas");
const Campground = require("./models/campground");
const Review = require("./models/review");
const expressError = require("./utils/expressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  req.flash("error", "You must be logged in");
  res.redirect("/login");
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (campground.author.equals(req.user._id)) {
        next();
    } else {
        req.flash("error", "You don't have permission to do that");
        res.redirect("/campgrounds/"+id);
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,review_Id } = req.params;
    const review = await Review.findById(review_Id)
    if (Review.author.equals(req.user._id)) {
        next();
    } else {
        req.flash("error", "You don't have permission to do that");
        res.redirect("/campgrounds/"+id);
    }
}
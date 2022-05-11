const Review = require("../models/review");
const Campground = require("../models/campground");



module.exports.create = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.Review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review created successfully");
    res.redirect("/campgrounds/" + campground._id);
  }


    module.exports.destroy = async (req, res, next) => {
    const { id, review_id } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Review deleted successfully");
    res.redirect("/campgrounds/" + id);
  }
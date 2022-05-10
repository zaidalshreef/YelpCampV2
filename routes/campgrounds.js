const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {
      campgrounds,
    });
  })
);

router.get("/new", isLoggedIn, (req, res, next) =>
  res.render("campgrounds/new")
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {
      campground,
    });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Campground created successfully");
    res.redirect("/campgrounds/" + campground._id);
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {
      campground,
    });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Campground updated successfully");
    res.redirect("/campgrounds/" + req.params.id);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted successfully");
    res.redirect("/campgrounds");
  })
);

module.exports = router;

const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas");
const expressError = require("../utils/expressError");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => res.render("campgrounds/new"));

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Campground created successfully");
    res.redirect("/campgrounds/" + campground._id);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash("error", "Campground not found");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Campground updated successfully");
    res.redirect("/campgrounds/" + req.params.id);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted successfully");
    res.redirect("/campgrounds");
  })
);

module.exports = router;

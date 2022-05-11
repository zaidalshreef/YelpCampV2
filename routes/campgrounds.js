const express = require("express");
const router = express.Router();
const Campgrounds = require("../controllers/campground");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(catchAsync(Campgrounds.index))
  .post(isLoggedIn, validateCampground, catchAsync(Campgrounds.create));

router.get("/new", isLoggedIn, Campgrounds.new);

router
  .route("/:id")
  .get(catchAsync(Campgrounds.show))
  .put(isLoggedIn, isAuthor,validateCampground , catchAsync(Campgrounds.update))
  .delete(isLoggedIn, isAuthor, catchAsync(Campgrounds.destroy));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(Campgrounds.edit));

module.exports = router;

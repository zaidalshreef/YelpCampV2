const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const MY_ACCESS_TOKEN = process.env.MapBox_Token;
const Geocoding = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

module.exports.index = async (req, res, next) => {
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: 10,
  };
  const allcampgrounds = await Campground.find({})
  const campgrounds = await Campground.paginate(
    {},
    options,
    function (err, result) {
      const campgrounds = result
      if(options.page > result.totalPages) {
        req.flash("error", "Page not found");
        return res.redirect("/campgrounds");
      }
      const afterNextPage = result.nextPage + 1
      res.render("campgrounds/index", { campgrounds,allcampgrounds,afterNextPage });;
    }
  );
};

module.exports.new = (req, res, next) => res.render("campgrounds/new");

module.exports.show = async (req, res, next) => {
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
};

module.exports.create = async (req, res, next) => {
  const geodata = await Geocoding.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geodata.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Campground created successfully");
  res.redirect("/campgrounds/" + campground._id);
};

module.exports.edit = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {
    campground,
  });
};

module.exports.update = async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground
  );
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images);
  await campground.save();
  if (req.body.deleteImages) {
    for (const image of req.body.deleteImages) {
      await cloudinary.uploader.destroy(image);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Campground updated successfully");
  res.redirect("/campgrounds/" + req.params.id);
};

module.exports.destroy = async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted successfully");
  res.redirect("/campgrounds");
};

const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
            const campgrounds = await Campground.find({});
            res.render("campgrounds/index", { campgrounds });
        };


module.exports.new =  (req, res, next) => res.render("campgrounds/new")


module.exports.show =  async (req, res, next) => {
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
            const campground = new Campground(req.body.campground);
            campground.author = req.user._id;
            await campground.save();
            req.flash("success", "Campground created successfully");
            res.redirect("/campgrounds/" + campground._id);
        }

    module.exports.edit = async (req, res, next) => {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
          req.flash("error", "Campground not found");
          return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", {
          campground,
        });
      }

      module.exports.update = async (req, res, next) => {
    await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash("success", "Campground updated successfully");
    res.redirect("/campgrounds/" + req.params.id);
  }


    module.exports.destroy = async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "Campground deleted successfully");
    res.redirect("/campgrounds");
  }
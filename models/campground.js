const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
  url: String,
  filename: String,
}
);

imagesSchema.virtual('thumbnail').get(function () {
  return this.url.replace("/upload", "/upload/w_150,h_150,c_scale");
}
);

const campgroundSchema = new Schema({
  title: String,
  images: [imagesSchema],
  Geolocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (campground) {
  await Review.deleteMany({
    _id: {
      $in: campground.reviews,
    },
  });
});

module.exports = mongoose.model("Campground", campgroundSchema);

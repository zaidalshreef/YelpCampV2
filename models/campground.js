const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
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

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
  title: String,
  images: [imagesSchema],
  geometry: {
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
}, opts);


campgroundSchema.plugin(mongoosePaginate);

campgroundSchema.virtual('properties.popupMarkup')
.get(function (){
  return `
  <h5>${this.title}</h5>
  <hr>
  <p>${this.description.substring(0, 55)}...</p>
  <p>${this.location}</p>
  <p> Price: ${this.price}</p>
  <a href="/campgrounds/${this.id}">More info</a>
  `;
}
)


  campgroundSchema.post("findOneAndDelete", async function (campground) {
  await Review.deleteMany({
    _id: {
      $in: campground.reviews,
    },
  });
});

module.exports = mongoose.model("Campground", campgroundSchema);

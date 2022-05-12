const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

// Create the Express application and set the port number.
mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("connected");
});

const seeded = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const camp = new Campground({
      author: "627ba71b826eb7af8ad669ec",
      title:
        descriptors[Math.floor(Math.random() * descriptors.length)] +
        " " +
        places[Math.floor(Math.random() * places.length)],
      location: `${city.city}, ${city.state}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus cum eligendi iusto dolorem ullam in animi tempora ut et architecto illum beatae deserunt quod, ipsum veniam unde dicta sunt.",
      price: Math.floor(Math.random() * 20) + 10,
      Geolocation: { type: "Point", coordinates: [46.716667, 24.633333] },
      images: [
        {
          url: "https://res.cloudinary.com/doh1l2ew2/image/upload/v1652293159/yelpcamp/ajll8du0nzcjdlq6pkoj.jpg",
          filename: "yelpcamp/ajll8du0nzcjdlq6pkoj",
        },
      ],
    });

    await camp.save();
  }
};

seeded().then(() => {
  db.close();
});

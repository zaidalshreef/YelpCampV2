if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

const dburl = `mongodb+srv://zaid:${process.env.password}@cluster0.kjvti.mongodb.net/Cluster0?retryWrites=true&w=majority`

// Create the Express application and set the port number.
mongoose.connect(dburl, {
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
  
  for (let i = 0; i < 1000; i++) {
    let number = [];
    const random1000 = Math.floor(Math.random() * 1000);
    if (number.includes(random1000)) {
      continue;
    }
    number.push(random1000);
    const camp = new Campground({
      author: "627ba71b826eb7af8ad669ec",
      title:
        descriptors[Math.floor(Math.random() * descriptors.length)] +
        " " +
        places[Math.floor(Math.random() * places.length)],
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis delectus cum eligendi iusto dolorem ullam in animi tempora ut et architecto illum beatae deserunt quod, ipsum veniam unde dicta sunt.",
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
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

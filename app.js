const express = require("express");
const { join } = require("path");
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const expressError = require("./utils/expressError");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

const app = express();
const port = 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "./views"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodoverride("_method"));
app.use(express.static(join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
}
);

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => res.render("home"));

app.all("*", (req, res, next) => {
  next(new expressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { status = "500" } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error", {
    err,
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

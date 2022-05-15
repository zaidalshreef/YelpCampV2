"use strict";

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var express = require("express");

var _require = require("path"),
    join = _require.join;

var mongoose = require("mongoose");

var methodoverride = require("method-override");

var ejsMate = require("ejs-mate");

var session = require("express-session");

var flash = require("connect-flash");

var expressError = require("./utils/expressError");

var campgrounds = require("./routes/campgrounds");

var reviews = require("./routes/reviews");

var users = require("./routes/users");

var passport = require("passport");

var localStrategy = require("passport-local");

var User = require("./models/user");

var mongoSanitize = require('express-mongo-sanitize');

var helmet = require("helmet");

var MongoStore = require('connect-mongo'); // connect to the database


mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("connected");
}); // create express app

var app = express();
var port = 3000; // set view engine to ejs

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "./views")); // use middleware urlencoded and method override

app.use(express.urlencoded({
  extended: true
}));
app.use(methodoverride("_method")); // use middleware for static files

app.use(express["static"](join(__dirname, "public")));
app.use(mongoSanitize());
var store = new MongoStore({
  mongooseConnection: db,
  collection: 'sessions'
}); // use middleware for session and flash

app.use(session({
  // name: "session",
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));
app.use(flash());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
})); // use middleware for passport

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); // middleware  for locals

app.use(function (req, res, next) {
  if (req.originalUrl !== "/login" && req.originalUrl !== "/register" && req.originalUrl !== "/logout") {
    req.session.returnTo = req.originalUrl;
  }

  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
}); // routes for the app (in order of priority)

app.use("/", users);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews); // home page routes

app.get("/", function (req, res) {
  return res.render("home");
}); // ------------------------------------------------- //

app.all("*", function (req, res, next) {
  next(new expressError("Page not found", 404));
}); // error handling middleware

app.use(function (err, req, res, next) {
  var _err$status = err.status,
      status = _err$status === void 0 ? "500" : _err$status;
  if (!err.message) err.message = "Something went wrong";
  res.status(status).render("error", {
    err: err
  });
}); // ------------------------------------------------- //

app.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});
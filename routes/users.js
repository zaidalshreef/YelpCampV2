const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const user = require("../models/user");

router.route("/register").get(users.registerForm).post(users.createNewUser);

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome back!",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;

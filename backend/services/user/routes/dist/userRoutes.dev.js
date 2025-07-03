"use strict";

var express = require("express");

var router = express.Router();

var passport = require("../passport");

var authController = require("../controllers/authController");

var userController = require("../controllers/userController"); // POST /register


router.post("/register", userController.register); // POST /login

router.post("/login", userController.login); // Google OAuth

router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));
router.get("/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  session: false
}), authController.googleAuthCallback);
module.exports = router;
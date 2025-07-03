"use strict";

var passport = require("passport");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

var User = require("./models/User");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function _callee(id, done) {
  var user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(User.findById(id));

        case 2:
          user = _context.sent;
          done(null, user);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://localhost:4005/api/user/auth/google/callback"
}, function _callee2(accessToken, refreshToken, profile, done) {
  var user;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.findOne({
            email: profile.emails[0].value
          }));

        case 2:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "" // Google users don't need a password

          }));

        case 6:
          user = _context2.sent;

        case 7:
          return _context2.abrupt("return", done(null, user));

        case 8:
        case "end":
          return _context2.stop();
      }
    }
  });
}));
module.exports = passport;
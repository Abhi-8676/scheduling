"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var profileSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: String,
  bio: String,
  avatar: String
}); // Hash password before saving

profileSchema.pre("save", function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, 10));

        case 4:
          this.password = _context.sent;
          next();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // Method to compare password

profileSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
"use strict";

var User = require("../models/User");

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

exports.register = function _callee(req, res) {
  var _req$body, username, password, email, exists, hashed, user, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password, email = _req$body.email;

          if (!(!username || !password || !email)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "All fields are required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            $or: [{
              username: username
            }, {
              email: email
            }]
          }));

        case 6:
          exists = _context.sent;

          if (!exists) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(409).json({
            error: "User/email already exists"
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 11:
          hashed = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(User.create({
            username: username,
            password: hashed,
            email: email
          }));

        case 14:
          user = _context.sent;
          token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email
          }, process.env.JWT_SECRET || "yoursecret", {
            expiresIn: "7d"
          });
          res.status(201).json({
            token: token,
            _id: user._id,
            username: user.username,
            email: user.email
          });
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.login = function _callee2(req, res) {
  var _req$body2, username, password, user, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;

          if (!(!username || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Username and password required"
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 6:
          user = _context2.sent;
          _context2.t0 = !user;

          if (_context2.t0) {
            _context2.next = 12;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 11:
          _context2.t0 = !_context2.sent;

        case 12:
          if (!_context2.t0) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            error: "Invalid credentials"
          }));

        case 14:
          token = jwt.sign({
            userId: user._id
          }, process.env.JWT_SECRET || "jwt-secret", {
            expiresIn: "1h"
          });
          res.json({
            token: token,
            username: user.username,
            email: user.email
          });
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t1 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t1.message
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 18]]);
};
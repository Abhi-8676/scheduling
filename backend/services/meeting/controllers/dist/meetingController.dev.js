"use strict";

var Meeting = require("../models/Meeting"); // Get all meetings


exports.getAllMeetings = function _callee(req, res) {
  var meetings;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Meeting.find().sort({
            time: -1
          }));

        case 3:
          meetings = _context.sent;
          res.json(meetings);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}; // Get single meeting by ID


exports.getMeetingById = function _callee2(req, res) {
  var meeting;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Meeting.findById(req.params.id));

        case 3:
          meeting = _context2.sent;

          if (meeting) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 6:
          res.json(meeting);
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
}; // Create a new meeting


exports.createMeeting = function _callee3(req, res) {
  var _req$body, title, time, participants, summary, meeting;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, title = _req$body.title, time = _req$body.time, participants = _req$body.participants, summary = _req$body.summary;

          if (!(!title || !time || !Array.isArray(participants))) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: "title, time, and participants are required"
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(Meeting.create({
            title: title,
            time: time,
            participants: participants,
            summary: summary || ""
          }));

        case 6:
          meeting = _context3.sent;
          res.status(201).json(meeting);
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
}; // Update a meeting


exports.updateMeeting = function _callee4(req, res) {
  var id, update, meeting;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          id = req.params.id;
          update = req.body;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Meeting.findByIdAndUpdate(id, update, {
            "new": true
          }));

        case 5:
          meeting = _context4.sent;

          if (meeting) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 8:
          res.json(meeting);
          _context4.next = 14;
          break;

        case 11:
          _context4.prev = 11;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; // Delete a meeting


exports.deleteMeeting = function _callee5(req, res) {
  var id, meeting;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.params.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Meeting.findByIdAndDelete(id));

        case 4:
          meeting = _context5.sent;

          if (meeting) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 7:
          res.json({
            message: "Meeting deleted"
          });
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            error: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 10]]);
};
"use strict";

var Meeting = require("../models/Meeting-service");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var jwt = require("jsonwebtoken"); // Helper function to generate JWT


var generateToken = function generateToken(userData) {
  return jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}; // Create a new meeting


exports.createMeeting = function _callee(req, res) {
  var _req$body, host, title, _req$body$requiresApp, requiresApproval, meetingId, meeting, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, host = _req$body.host, title = _req$body.title, _req$body$requiresApp = _req$body.requiresApproval, requiresApproval = _req$body$requiresApp === void 0 ? true : _req$body$requiresApp;
          meetingId = uuidv4();
          meeting = new Meeting({
            meetingId: meetingId,
            host: host,
            title: title,
            requiresApproval: requiresApproval,
            attendees: [{
              name: host,
              isHost: true
            }]
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(meeting.save());

        case 5:
          token = generateToken({
            meetingId: meetingId,
            isHost: true,
            name: host
          });
          res.json({
            meetingId: meetingId,
            link: "/meeting/".concat(meetingId),
            token: token
          });

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}; // Join meeting (add to waiting room)


exports.joinMeeting = function _callee2(req, res) {
  var meetingId, _req$body2, name, email, meeting, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          meetingId = req.params.meetingId;
          _req$body2 = req.body, name = _req$body2.name, email = _req$body2.email;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

        case 4:
          meeting = _context2.sent;

          if (meeting) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 7:
          token = generateToken({
            meetingId: meetingId,
            isHost: false,
            name: name,
            email: email
          });

          if (meeting.requiresApproval) {
            _context2.next = 13;
            break;
          }

          meeting.attendees.push({
            name: name,
            email: email
          });
          _context2.next = 12;
          return regeneratorRuntime.awrap(meeting.save());

        case 12:
          return _context2.abrupt("return", res.json({
            status: "admitted",
            meetingId: meetingId,
            token: token
          }));

        case 13:
          res.json({
            status: "waiting",
            meetingId: meetingId,
            token: token,
            requiresApproval: true
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  });
}; //   meeting.waitingRoom.push({ name });
//   await meeting.save();
//   res.json({ status: "waiting", meetingId });
// };
// Admit guest from waiting room


exports.admitGuest = function _callee3(req, res) {
  var meetingId, name, meeting, guestIndex, guest;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          meetingId = req.params.meetingId;
          name = req.body.name;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

        case 4:
          meeting = _context3.sent;

          if (meeting) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 7:
          guestIndex = meeting.waitingRoom.findIndex(function (g) {
            return g.name === name;
          });

          if (!(guestIndex === -1)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "Guest not found"
          }));

        case 10:
          guest = meeting.waitingRoom.splice(guestIndex, 1)[0];
          meeting.attendees.push(guest);
          _context3.next = 14;
          return regeneratorRuntime.awrap(meeting.save());

        case 14:
          res.json({
            status: "admitted",
            meetingId: meetingId
          });

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  });
}; // Add chat message


exports.addChat = function _callee4(req, res) {
  var meetingId, _req$body3, user, message, meeting;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          meetingId = req.params.meetingId;
          _req$body3 = req.body, user = _req$body3.user, message = _req$body3.message;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

        case 4:
          meeting = _context4.sent;

          if (meeting) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 7:
          meeting.chat.push({
            user: user,
            message: message
          });
          _context4.next = 10;
          return regeneratorRuntime.awrap(meeting.save());

        case 10:
          res.json({
            status: "ok"
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
}; // Add note


exports.addNote = function _callee5(req, res) {
  var meetingId, _req$body4, author, text, meeting;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          meetingId = req.params.meetingId;
          _req$body4 = req.body, author = _req$body4.author, text = _req$body4.text;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

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
          meeting.notes.push({
            author: author,
            text: text
          });
          _context5.next = 10;
          return regeneratorRuntime.awrap(meeting.save());

        case 10:
          res.json({
            status: "ok"
          });

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  });
}; // Upload recording (assume file upload handled elsewhere)


exports.addRecording = function _callee6(req, res) {
  var meetingId, _req$body5, url, by, meeting;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          meetingId = req.params.meetingId;
          _req$body5 = req.body, url = _req$body5.url, by = _req$body5.by;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

        case 4:
          meeting = _context6.sent;

          if (meeting) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 7:
          meeting.recordings.push({
            url: url,
            uploadedAt: new Date(),
            by: by
          });
          _context6.next = 10;
          return regeneratorRuntime.awrap(meeting.save());

        case 10:
          res.json({
            status: "ok"
          });

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  });
}; // GET /api/meetings/:meetingId


exports.getMeeting = function _callee7(req, res) {
  var meetingId, meeting;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          meetingId = req.params.meetingId;
          _context7.next = 3;
          return regeneratorRuntime.awrap(Meeting.findOne({
            meetingId: meetingId
          }));

        case 3:
          meeting = _context7.sent;

          if (meeting) {
            _context7.next = 6;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            error: "Meeting not found"
          }));

        case 6:
          res.json(meeting);

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
};
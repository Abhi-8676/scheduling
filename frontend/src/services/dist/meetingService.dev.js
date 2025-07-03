"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRecording = exports.addNote = exports.sendChat = exports.getMeeting = exports.admitGuest = exports.joinMeeting = exports.createMeeting = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API = "/api/meetings";

var createMeeting = function createMeeting(host) {
  var res;
  return regeneratorRuntime.async(function createMeeting$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/create"), {
            host: host
          }));

        case 2:
          res = _context.sent;
          return _context.abrupt("return", res.data);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.createMeeting = createMeeting;

var joinMeeting = function joinMeeting(meetingId, name) {
  var res;
  return regeneratorRuntime.async(function joinMeeting$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/").concat(meetingId, "/join"), {
            name: name
          }));

        case 2:
          res = _context2.sent;
          return _context2.abrupt("return", res.data);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.joinMeeting = joinMeeting;

var admitGuest = function admitGuest(meetingId, name) {
  var res;
  return regeneratorRuntime.async(function admitGuest$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/").concat(meetingId, "/admit"), {
            name: name
          }));

        case 2:
          res = _context3.sent;
          return _context3.abrupt("return", res.data);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.admitGuest = admitGuest;

var getMeeting = function getMeeting(meetingId) {
  var res;
  return regeneratorRuntime.async(function getMeeting$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("".concat(API, "/").concat(meetingId)));

        case 2:
          res = _context4.sent;
          return _context4.abrupt("return", res.data);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.getMeeting = getMeeting;

var sendChat = function sendChat(meetingId, user, message) {
  var res;
  return regeneratorRuntime.async(function sendChat$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/").concat(meetingId, "/chat"), {
            user: user,
            message: message
          }));

        case 2:
          res = _context5.sent;
          return _context5.abrupt("return", res.data);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.sendChat = sendChat;

var addNote = function addNote(meetingId, author, text) {
  var res;
  return regeneratorRuntime.async(function addNote$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/").concat(meetingId, "/note"), {
            author: author,
            text: text
          }));

        case 2:
          res = _context6.sent;
          return _context6.abrupt("return", res.data);

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
};

exports.addNote = addNote;

var addRecording = function addRecording(meetingId, url, by) {
  var res;
  return regeneratorRuntime.async(function addRecording$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(API, "/").concat(meetingId, "/recording"), {
            url: url,
            by: by
          }));

        case 2:
          res = _context7.sent;
          return _context7.abrupt("return", res.data);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.addRecording = addRecording;
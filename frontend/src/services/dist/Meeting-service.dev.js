"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRecording = exports.addNote = exports.sendChat = exports.admitGuest = exports.joinMeeting = exports.createMeeting = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var API = "http://localhost:3000/api/meetings";

var createMeeting = function createMeeting(host) {
  return _axios["default"].post("".concat(API, "/create"), {
    host: host
  });
};

exports.createMeeting = createMeeting;

var joinMeeting = function joinMeeting(meetingId, name) {
  return _axios["default"].post("".concat(API, "/").concat(meetingId, "/join"), {
    name: name
  });
};

exports.joinMeeting = joinMeeting;

var admitGuest = function admitGuest(meetingId, name) {
  return _axios["default"].post("".concat(API, "/").concat(meetingId, "/admit"), {
    name: name
  });
};

exports.admitGuest = admitGuest;

var sendChat = function sendChat(meetingId, user, message) {
  return _axios["default"].post("".concat(API, "/").concat(meetingId, "/chat"), {
    user: user,
    message: message
  });
};

exports.sendChat = sendChat;

var addNote = function addNote(meetingId, author, text) {
  return _axios["default"].post("".concat(API, "/").concat(meetingId, "/note"), {
    author: author,
    text: text
  });
};

exports.addNote = addNote;

var addRecording = function addRecording(meetingId, url, by) {
  return _axios["default"].post("".concat(API, "/").concat(meetingId, "/recording"), {
    url: url,
    by: by
  });
};

exports.addRecording = addRecording;
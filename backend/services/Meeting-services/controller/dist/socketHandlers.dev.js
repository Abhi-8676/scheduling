"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// PeerJS video conferencing: relay peer IDs to all users in the meeting
// This must be inside the io.on("connection") handler, after meetingId is available
// module.exports = (io) => {
//   // Middleware to authenticate socket connections
//   io.use(async (socket, next) => {
//     try {
//       const { token } = socket.handshake.query;
//       if (!token) throw new Error("Authentication error");
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.user = decoded;
//       next();
//     } catch (err) {
//       next(new Error("Authentication failed"));
//     }
//   });
var Meeting = require("../models/Meeting-service");

var jwt = require("jsonwebtoken");

module.exports = function (io) {
  // Middleware to authenticate socket connections
  io.use(function _callee(socket, next) {
    var token, decoded;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = socket.handshake.query.token;

            if (token) {
              _context.next = 4;
              break;
            }

            throw new Error("Authentication error");

          case 4:
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            next(new Error("Authentication failed"));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 9]]);
  }); // Handle attendee joining waiting room

  io.on("connection", function _callee9(socket) {
    var meetingId;
    return regeneratorRuntime.async(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            meetingId = socket.handshake.query.meetingId; // PeerJS video conferencing: relay peer IDs to all users in the meeting

            socket.on("peerId", function (peerId) {
              // Broadcast this peerId to all other sockets in the same meeting
              socket.to(meetingId).emit("userPeerId", peerId);
            });
            socket.on("joinWaitingRoom", function _callee2(_ref, callback) {
              var name, email, meeting, attendee;
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      name = _ref.name, email = _ref.email;
                      _context2.prev = 1;
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

                      throw new Error("Meeting not found");

                    case 7:
                      attendee = {
                        name: name,
                        email: email,
                        socketId: socket.id
                      };
                      meeting.waitingRoom.push(attendee);
                      _context2.next = 11;
                      return regeneratorRuntime.awrap(meeting.save());

                    case 11:
                      // Notify host about new attendee
                      io.to(meetingId).emit("attendeeJoined", {
                        attendee: attendee,
                        requiresApproval: meeting.requiresApproval
                      });
                      callback({
                        status: "waiting"
                      });
                      _context2.next = 18;
                      break;

                    case 15:
                      _context2.prev = 15;
                      _context2.t0 = _context2["catch"](1);
                      callback({
                        error: _context2.t0.message
                      });

                    case 18:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, null, null, [[1, 15]]);
            }); // Handle host admitting an attendee

            socket.on("admitAttendee", function _callee3(_ref2, callback) {
              var attendeeId, meeting, attendeeIndex, _meeting$waitingRoom$, _meeting$waitingRoom$2, attendee;

              return regeneratorRuntime.async(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      attendeeId = _ref2.attendeeId;
                      _context3.prev = 1;

                      if (socket.user.isHost) {
                        _context3.next = 4;
                        break;
                      }

                      throw new Error("Unauthorized");

                    case 4:
                      _context3.next = 6;
                      return regeneratorRuntime.awrap(Meeting.findOne({
                        meetingId: meetingId
                      }));

                    case 6:
                      meeting = _context3.sent;

                      if (meeting) {
                        _context3.next = 9;
                        break;
                      }

                      throw new Error("Meeting not found");

                    case 9:
                      attendeeIndex = meeting.waitingRoom.findIndex(function (a) {
                        return a._id.toString() === attendeeId;
                      });

                      if (!(attendeeIndex === -1)) {
                        _context3.next = 12;
                        break;
                      }

                      throw new Error("Attendee not found");

                    case 12:
                      _meeting$waitingRoom$ = meeting.waitingRoom.splice(attendeeIndex, 1), _meeting$waitingRoom$2 = _slicedToArray(_meeting$waitingRoom$, 1), attendee = _meeting$waitingRoom$2[0];
                      meeting.attendees.push(attendee);
                      _context3.next = 16;
                      return regeneratorRuntime.awrap(meeting.save());

                    case 16:
                      // Notify the admitted attendee
                      io.to(attendee.socketId).emit("admissionApproved"); // Notify all clients about the update

                      io.to(meetingId).emit("attendeeAdmitted", {
                        attendee: attendee,
                        attendees: meeting.attendees,
                        waitingRoom: meeting.waitingRoom
                      });
                      callback({
                        status: "success"
                      });
                      _context3.next = 24;
                      break;

                    case 21:
                      _context3.prev = 21;
                      _context3.t0 = _context3["catch"](1);
                      callback({
                        error: _context3.t0.message
                      });

                    case 24:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, null, null, [[1, 21]]);
            }); // Handle host rejecting an attendee

            socket.on("rejectAttendee", function _callee4(_ref3, callback) {
              var attendeeId, meeting, attendeeIndex, _meeting$waitingRoom$3, _meeting$waitingRoom$4, attendee;

              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      attendeeId = _ref3.attendeeId;
                      _context4.prev = 1;

                      if (socket.user.isHost) {
                        _context4.next = 4;
                        break;
                      }

                      throw new Error("Unauthorized");

                    case 4:
                      _context4.next = 6;
                      return regeneratorRuntime.awrap(Meeting.findOne({
                        meetingId: meetingId
                      }));

                    case 6:
                      meeting = _context4.sent;

                      if (meeting) {
                        _context4.next = 9;
                        break;
                      }

                      throw new Error("Meeting not found");

                    case 9:
                      attendeeIndex = meeting.waitingRoom.findIndex(function (a) {
                        return a._id.toString() === attendeeId;
                      });

                      if (!(attendeeIndex === -1)) {
                        _context4.next = 12;
                        break;
                      }

                      throw new Error("Attendee not found");

                    case 12:
                      _meeting$waitingRoom$3 = meeting.waitingRoom.splice(attendeeIndex, 1), _meeting$waitingRoom$4 = _slicedToArray(_meeting$waitingRoom$3, 1), attendee = _meeting$waitingRoom$4[0];
                      _context4.next = 15;
                      return regeneratorRuntime.awrap(meeting.save());

                    case 15:
                      // Notify the rejected attendee
                      io.to(attendee.socketId).emit("admissionRejected"); // Notify all clients about the update

                      io.to(meetingId).emit("attendeeRejected", {
                        attendeeId: attendeeId,
                        waitingRoom: meeting.waitingRoom
                      });
                      callback({
                        status: "success"
                      });
                      _context4.next = 23;
                      break;

                    case 20:
                      _context4.prev = 20;
                      _context4.t0 = _context4["catch"](1);
                      callback({
                        error: _context4.t0.message
                      });

                    case 23:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, null, null, [[1, 20]]);
            }); // Handle attendee leaving

            socket.on("leaveMeeting", function _callee5() {
              var meeting;
              return regeneratorRuntime.async(function _callee5$(_context5) {
                while (1) {
                  switch (_context5.prev = _context5.next) {
                    case 0:
                      _context5.prev = 0;
                      _context5.next = 3;
                      return regeneratorRuntime.awrap(Meeting.findOne({
                        meetingId: meetingId
                      }));

                    case 3:
                      meeting = _context5.sent;

                      if (meeting) {
                        _context5.next = 6;
                        break;
                      }

                      throw new Error("Meeting not found");

                    case 6:
                      // Remove attendee from attendees and waitingRoom
                      meeting.attendees = meeting.attendees.filter(function (a) {
                        return a.socketId !== socket.id;
                      });
                      meeting.waitingRoom = meeting.waitingRoom.filter(function (a) {
                        return a.socketId !== socket.id;
                      });
                      _context5.next = 10;
                      return regeneratorRuntime.awrap(meeting.save());

                    case 10:
                      // Notify all clients about the update
                      io.to(meetingId).emit("attendeeLeft", {
                        socketId: socket.id,
                        attendees: meeting.attendees,
                        waitingRoom: meeting.waitingRoom
                      });
                      _context5.next = 15;
                      break;

                    case 13:
                      _context5.prev = 13;
                      _context5.t0 = _context5["catch"](0);

                    case 15:
                    case "end":
                      return _context5.stop();
                  }
                }
              }, null, null, [[0, 13]]);
            }); // Handle attendee requesting to start the meeting

            socket.on("requestStartMeeting", function _callee6(data, callback) {
              var meeting, host;
              return regeneratorRuntime.async(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:
                      _context6.prev = 0;

                      if (!socket.user.isHost) {
                        _context6.next = 3;
                        break;
                      }

                      throw new Error("Host cannot request to start meeting");

                    case 3:
                      _context6.next = 5;
                      return regeneratorRuntime.awrap(Meeting.findOne({
                        meetingId: meetingId
                      }));

                    case 5:
                      meeting = _context6.sent;

                      if (meeting) {
                        _context6.next = 8;
                        break;
                      }

                      throw new Error("Meeting not found");

                    case 8:
                      // Find the host's socketId (must be in attendees with isHost true)
                      host = meeting.attendees.find(function (a) {
                        return a.isHost;
                      });

                      if (!(!host || !host.socketId)) {
                        _context6.next = 11;
                        break;
                      }

                      throw new Error("Host not connected");

                    case 11:
                      // Notify the host
                      io.to(host.socketId).emit("startMeetingRequested", {
                        requester: {
                          name: socket.user.name,
                          email: socket.user.email,
                          socketId: socket.id
                        }
                      }); // Notify the attendee (self) that the request is waiting

                      socket.emit("startMeetingWaiting");
                      callback && callback({
                        status: "requested"
                      });
                      _context6.next = 19;
                      break;

                    case 16:
                      _context6.prev = 16;
                      _context6.t0 = _context6["catch"](0);
                      callback && callback({
                        error: _context6.t0.message
                      });

                    case 19:
                    case "end":
                      return _context6.stop();
                  }
                }
              }, null, null, [[0, 16]]);
            }); // Host accepts the start meeting request

            socket.on("acceptStartMeeting", function _callee7(_ref4, callback) {
              var requesterSocketId;
              return regeneratorRuntime.async(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      requesterSocketId = _ref4.requesterSocketId;
                      _context7.prev = 1;

                      if (socket.user.isHost) {
                        _context7.next = 4;
                        break;
                      }

                      throw new Error("Only host can accept start meeting");

                    case 4:
                      // Notify all attendees that meeting has started
                      io.to(meetingId).emit("meetingStarted", {
                        startedBy: socket.user.name
                      }); // Optionally, notify the requester directly

                      if (requesterSocketId) io.to(requesterSocketId).emit("startMeetingAccepted");
                      callback && callback({
                        status: "accepted"
                      });
                      _context7.next = 12;
                      break;

                    case 9:
                      _context7.prev = 9;
                      _context7.t0 = _context7["catch"](1);
                      callback && callback({
                        error: _context7.t0.message
                      });

                    case 12:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, null, null, [[1, 9]]);
            }); // Host rejects the start meeting request

            socket.on("rejectStartMeeting", function _callee8(_ref5, callback) {
              var requesterSocketId;
              return regeneratorRuntime.async(function _callee8$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      requesterSocketId = _ref5.requesterSocketId;
                      _context8.prev = 1;

                      if (socket.user.isHost) {
                        _context8.next = 4;
                        break;
                      }

                      throw new Error("Only host can reject start meeting");

                    case 4:
                      if (requesterSocketId) io.to(requesterSocketId).emit("startMeetingRejected");
                      callback && callback({
                        status: "rejected"
                      });
                      _context8.next = 11;
                      break;

                    case 8:
                      _context8.prev = 8;
                      _context8.t0 = _context8["catch"](1);
                      callback && callback({
                        error: _context8.t0.message
                      });

                    case 11:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, null, null, [[1, 8]]);
            }); // ...existing code for leaveMeeting and other handlers...

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    });
  });
};
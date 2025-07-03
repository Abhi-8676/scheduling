"use strict";

var express = require("express");

var http = require('http');

var cors = require("cors");

var mongoose = require("mongoose");

var session = require("express-session");

var RedisStore = require("connect-redis")["default"];

var _require = require('redis'),
    createClient = _require.createClient;

var _require2 = require("socket.io"),
    Server = _require2.Server;

var chatRoutes = require("./routes/chatRoutes");

var ChatMessage = require("./models/ChatMessage"); // <-- Move require to top


require('dotenv').config();

var app = express();
var server = http.createServer(app);
var io = new Server(server, {
  cors: {
    origin: "*"
  }
});
mongoose.connect(process.env.MONGO_URI).then(function () {
  return console.log('MongoDB Connected');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
});
var redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.connect()["catch"](console.error);
app.use(cors());
app.use(express.json());
app.use("/uploads", express["static"]("uploads")); // Redis Store Setup

var redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:"
}); // Session Configuration

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || "session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours

  }
}));
app.use("/api/chat", chatRoutes); // Real-time chat with Socket.IO

io.on("connection", function (socket) {
  // New message
  socket.on("chat-message", function _callee(msg) {
    var savedMsg;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(ChatMessage.create(msg));

          case 3:
            savedMsg = _context.sent;
            io.emit("chat-message", savedMsg);
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            socket.emit("error", {
              type: "chat-message",
              error: _context.t0.message
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }); // Edit message

  socket.on("edit-message", function _callee2(_ref) {
    var id, text, attachments, updated;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = _ref.id, text = _ref.text, attachments = _ref.attachments;
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(ChatMessage.findByIdAndUpdate(id, {
              text: text,
              attachments: attachments,
              edited: true
            }, {
              "new": true
            }));

          case 4:
            updated = _context2.sent;
            io.emit("edit-message", updated);
            _context2.next = 11;
            break;

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](1);
            socket.emit("error", {
              type: "edit-message",
              error: _context2.t0.message
            });

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 8]]);
  }); // Delete message

  socket.on("delete-message", function _callee3(id) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(ChatMessage.findByIdAndDelete(id));

          case 3:
            io.emit("delete-message", id);
            _context3.next = 9;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);
            socket.emit("error", {
              type: "delete-message",
              error: _context3.t0.message
            });

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 6]]);
  }); // Pin/unpin message

  socket.on("pin-message", function _callee4(_ref2) {
    var id, pin, updated;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            id = _ref2.id, pin = _ref2.pin;
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(ChatMessage.findByIdAndUpdate(id, {
              pinned: !!pin
            }, {
              "new": true
            }));

          case 4:
            updated = _context4.sent;
            io.emit("pin-message", updated);
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            socket.emit("error", {
              type: "pin-message",
              error: _context4.t0.message
            });

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 8]]);
  }); // Add reaction

  socket.on("react-message", function _callee5(_ref3) {
    var id, user, emoji, updated;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = _ref3.id, user = _ref3.user, emoji = _ref3.emoji;
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(ChatMessage.findByIdAndUpdate(id, {
              $push: {
                reactions: {
                  user: user,
                  emoji: emoji
                }
              }
            }, {
              "new": true
            }));

          case 4:
            updated = _context5.sent;
            io.emit("react-message", updated);
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            socket.emit("error", {
              type: "react-message",
              error: _context5.t0.message
            });

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
});
var PORT = process.env.PORT || 4001;
server.listen(PORT, function () {
  console.log("Chat service running on port ".concat(PORT));
});
"use strict";

var express = require("express");

var router = express.Router();

var ChatMessage = require("../models/ChatMessage");

var multer = require("multer");

var upload = multer({
  dest: "uploads/"
}); // GET all messages (optionally filter by chatRoom)

router.get("/", function _callee(req, res) {
  var chatRoom, filter, messages;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          chatRoom = req.query.chatRoom;
          filter = chatRoom ? {
            chatRoom: chatRoom
          } : {};
          _context.next = 4;
          return regeneratorRuntime.awrap(ChatMessage.find(filter).sort({
            timestamp: 1
          }));

        case 4:
          messages = _context.sent;
          res.json(messages);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // SEARCH messages by text (case-insensitive)

router.get("/search", function _callee2(req, res) {
  var q, messages;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          q = req.query.q;

          if (q) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: "Missing search query"
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(ChatMessage.find({
            text: {
              $regex: q,
              $options: "i"
            }
          }));

        case 5:
          messages = _context2.sent;
          res.json(messages);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
}); // POST a new message (with optional replyTo)

router.post("/", function _callee3(req, res) {
  var _req$body, user, text, chatRoom, attachments, replyTo, message;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body = req.body, user = _req$body.user, text = _req$body.text, chatRoom = _req$body.chatRoom, attachments = _req$body.attachments, replyTo = _req$body.replyTo;
          message = new ChatMessage({
            user: user,
            text: text,
            chatRoom: chatRoom,
            attachments: attachments,
            replyTo: replyTo
          });
          _context3.next = 4;
          return regeneratorRuntime.awrap(message.save());

        case 4:
          res.status(201).json(message);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}); // PATCH to edit a message

router.patch("/:id", function _callee4(req, res) {
  var _req$body2, text, attachments, message;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, text = _req$body2.text, attachments = _req$body2.attachments;
          _context4.next = 3;
          return regeneratorRuntime.awrap(ChatMessage.findByIdAndUpdate(req.params.id, {
            text: text,
            attachments: attachments,
            edited: true
          }, {
            "new": true
          }));

        case 3:
          message = _context4.sent;
          res.json(message);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
}); // DELETE a message

router["delete"]("/:id", function _callee5(req, res) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ChatMessage.findByIdAndDelete(req.params.id));

        case 2:
          res.json({
            success: true
          });

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
}); // PATCH to pin/unpin a message

router.patch("/:id/pin", function _callee6(req, res) {
  var pin, message;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          pin = req.body.pin;
          _context6.next = 3;
          return regeneratorRuntime.awrap(ChatMessage.findByIdAndUpdate(req.params.id, {
            pinned: !!pin
          }, {
            "new": true
          }));

        case 3:
          message = _context6.sent;
          res.json(message);

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
}); // File upload endpoint

router.post("/upload", upload.single("file"), function (req, res) {
  if (!req.file) return res.status(400).json({
    error: "No file uploaded"
  });
  var fileUrl = "/uploads/".concat(req.file.filename);
  res.json({
    url: fileUrl,
    name: req.file.originalname,
    type: req.file.mimetype
  });
});
module.exports = router;
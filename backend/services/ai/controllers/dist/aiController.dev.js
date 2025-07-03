"use strict";

var axios = require("axios");

exports.getSmartReplies = function _callee(req, res) {
  var _req$body, lastMessage, context, prompt, aiRes, replies;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, lastMessage = _req$body.lastMessage, context = _req$body.context; // context: array of previous messages (for better suggestions)

          _context.prev = 1;
          // Call OpenAI or your AI provider
          prompt = "Given the conversation:\n".concat(context.map(function (m) {
            return m.user + ": " + m.text;
          }).join("\n"), "\nReply to: \"").concat(lastMessage, "\"\nSuggest 3 smart replies.");
          _context.next = 5;
          return regeneratorRuntime.awrap(axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: prompt
            }]
          }, {
            headers: {
              Authorization: "Bearer ".concat(process.env.OPENAI_API_KEY)
            }
          }));

        case 5:
          aiRes = _context.sent;
          // Parse AI response
          replies = aiRes.data.choices[0].message.content.split("\n").filter(Boolean);
          res.json({
            replies: replies
          });
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            error: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

exports.generateMeetingMinutes = function _callee2(req, res) {
  var transcript, prompt, aiRes;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          transcript = req.body.transcript;
          _context2.prev = 1;
          prompt = "Summarize the following meeting transcript. List key decisions and action items:\n".concat(transcript);
          _context2.next = 5;
          return regeneratorRuntime.awrap(axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: prompt
            }]
          }, {
            headers: {
              Authorization: "Bearer ".concat(process.env.OPENAI_API_KEY)
            }
          }));

        case 5:
          aiRes = _context2.sent;
          res.json({
            minutes: aiRes.data.choices[0].message.content
          });
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](1);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 9]]);
};

exports.analyzeSentiment = function _callee3(req, res) {
  var transcript, prompt, aiRes;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          transcript = req.body.transcript;
          _context3.prev = 1;
          prompt = "Analyze the sentiment (positive, negative, neutral) of this transcript and explain why:\n".concat(transcript);
          _context3.next = 5;
          return regeneratorRuntime.awrap(axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4o-mini",
            messages: [{
              role: "user",
              content: prompt
            }]
          }, {
            headers: {
              Authorization: "Bearer ".concat(process.env.OPENAI_API_KEY)
            }
          }));

        case 5:
          aiRes = _context3.sent;
          res.json({
            sentiment: aiRes.data.choices[0].message.content
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 9]]);
};
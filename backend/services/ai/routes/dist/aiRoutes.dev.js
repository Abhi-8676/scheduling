"use strict";

var express = require("express");

var router = express.Router();

var aiController = require("../controllers/aiController");

router.post("/suggest-replies", aiController.getSmartReplies);
router.post("/meeting-minutes", aiController.generateMeetingMinutes);
router.post("/sentiment", aiController.analyzeSentiment);
router.post('/summarize-text', function _callee(req, res) {
  var transcript, summary;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          transcript = req.body.transcript;

          if (transcript) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Transcript is required"
          }));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(summarizeWithOpenAI(transcript));

        case 6:
          summary = _context.sent;
          // your function
          res.json({
            summary: summary
          });
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error('Summarize error:', _context.t0);
          res.status(500).json({
            error: _context.t0.message
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
module.exports = router;
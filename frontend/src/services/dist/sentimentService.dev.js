"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyzeSentiment = analyzeSentiment;

function analyzeSentiment(transcript) {
  var res, data;
  return regeneratorRuntime.async(function analyzeSentiment$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/api/ai/sentiment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              transcript: transcript
            })
          }));

        case 2:
          res = _context.sent;

          if (res.ok) {
            _context.next = 5;
            break;
          }

          throw new Error("Sentiment API error");

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(res.json());

        case 7:
          data = _context.sent;
          return _context.abrupt("return", data.sentiment);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
}
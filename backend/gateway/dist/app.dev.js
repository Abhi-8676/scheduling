"use strict";

var express = require("express");

var cors = require("cors");

var morgan = require("morgan");

var _require = require("http-proxy-middleware"),
    createProxyMiddleware = _require.createProxyMiddleware;

require("dotenv").config();

var app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // Helper to create proxy with error handling and logging

function setupProxy(path, target) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  app.use(path, createProxyMiddleware({
    target: target,
    changeOrigin: true,
    ws: !!opts.ws,
    onError: function onError(err, req, res) {
      console.error("Error proxying ".concat(req.method, " ").concat(req.originalUrl, " to ").concat(target, ":"), err.message);

      if (!res.headersSent) {
        res.status(502).json({
          error: "Service unavailable"
        });
      }
    },
    onProxyReq: function onProxyReq(_proxyReq, req, res) {
      console.log("[Proxy] ".concat(req.method, " ").concat(req.originalUrl, " -> ").concat(target));
    }
  }));
} // Proxy routes (use env vars or default values)


setupProxy("/api/chat", process.env.CHAT_SERVICE_URL || "http://chat:4001", {
  ws: true
});
setupProxy("/api/meetings", process.env.MEETING_SERVICE_URL || "http://meeting:4002");
setupProxy("/api/media", process.env.MEDIA_SERVICE_URL || "http://media:4003");
setupProxy("/api/ai", process.env.AI_SERVICE_URL || "http://ai:4004");
setupProxy("/api/user", process.env.USER_SERVICE_URL || "http://user:4005");
setupProxy("/api/meetings", process.env.MEETING_URL || "http://meeting:4007"); // Health check endpoint

app.get("/health", function (req, res) {
  return res.json({
    status: "ok"
  });
});
var PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
  console.log("Gateway running on port ".concat(PORT));
});
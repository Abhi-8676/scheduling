"use strict";

var express = require("express");

var mongoose = require("mongoose");

var cors = require("cors");

var http = require("http");

var _require = require("socket.io"),
    Server = _require.Server;

var meetingRoutes = require("./routes/Meeting-serviceRoutes");

var socketHandlers = require("./controller/socketHandlers");

var fs = require("fs");

var path = require("path");

require("dotenv").config();

var app = express();
var server = http.createServer(app); // Configure Socket.IO

var io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  },
  path: "/socket.io"
});
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(function () {
  return console.log("MongoDB Connected");
})["catch"](function (err) {
  return console.error("MongoDB connection error:", err);
}); // Ensure uploads/recordings directory exists

var recordingsDir = path.join(__dirname, "uploads", "recordings");

if (!fs.existsSync(recordingsDir)) {
  fs.mkdirSync(recordingsDir, {
    recursive: true
  });
} // Serve static files from the uploads directory


app.use("/uploads", express["static"](path.join(__dirname, "uploads"))); // Socket.IO connection handler

io.on("connection", function (socket) {
  console.log("New connection: ".concat(socket.id));
  var _socket$handshake$que = socket.handshake.query,
      meetingId = _socket$handshake$que.meetingId,
      token = _socket$handshake$que.token;

  if (!meetingId || !token) {
    socket.disconnect();
    return;
  } // Join the meeting room


  socket.join(meetingId); // Handle disconnection

  socket.on("disconnect", function () {
    console.log("User disconnected: ".concat(socket.id));
    socket.leave(meetingId);
  });
}); // Attach io instance to app for use in controllers

app.set("io", io);
socketHandlers(io);
app.use("/api/meetings", meetingRoutes);
var PORT = process.env.PORT || 4007;
server.listen(PORT, function () {
  return console.log("Meeting-Service running on port ".concat(PORT));
});
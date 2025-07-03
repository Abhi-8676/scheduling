"use strict";

var express = require("express");

var router = express.Router();

var multer = require("multer");

var meetingController = require("../controller/Meeting-serviceController"); // Configure multer for file uploads


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/recordings/');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post("/create", meetingController.createMeeting); // Host starts the meeting

router.post("/:meetingId/start", meetingController.startMeeting);
router.post("/:meetingId/join", meetingController.joinMeeting);
router.post("/:meetingId/admit", meetingController.admitGuest);
router.post("/:meetingId/chat", meetingController.addChat);
router.post("/:meetingId/note", meetingController.addNote);
router.post("/:meetingId/recording", upload.single("file"), meetingController.addRecording);
router.get("/:meetingId", meetingController.getMeeting);
module.exports = router;
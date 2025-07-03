"use strict";

var express = require("express");

var router = express.Router();

var meetingController = require("../controllers/meetingController"); // GET all meetings


router.get("/", meetingController.getAllMeetings); // GET single meeting

router.get("/:id", meetingController.getMeetingById); // POST new meeting

router.post("/", meetingController.createMeeting); // PUT update meeting

router.put("/:id", meetingController.updateMeeting); // DELETE meeting

router["delete"]("/:id", meetingController.deleteMeeting);
module.exports = router;
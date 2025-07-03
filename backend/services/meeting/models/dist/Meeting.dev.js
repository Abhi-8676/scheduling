"use strict";

var mongoose = require("mongoose");

var MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: Date,
    required: true
  },
  participants: {
    type: [String],
    required: true,
    "default": []
  },
  summary: {
    type: String,
    "default": ""
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("Meeting", MeetingSchema);
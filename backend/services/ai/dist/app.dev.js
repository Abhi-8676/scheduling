"use strict";

var express = require("express");

var cors = require("cors");

var _require = require("./controllers/summarizeController"),
    summarizeTranscript = _require.summarizeTranscript;

var aiRoutes = require("./routes/aiRoutes");

require('dotenv').config();

var app = express();
app.use(cors());
app.use(express.json({
  limit: '100mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '100mb'
}));
app.post("/summarize", summarizeTranscript);
app.get("/", function (req, res) {
  return res.send("AI service running");
});
app.use("/api/ai", aiRoutes);
var PORT = process.env.PORT || 4004;
app.listen(PORT, function () {
  console.log("AI service running on port ".concat(PORT));
});
"use strict";

// const express = require("express");
// const multer = require("multer");
// const cors = require("cors");
// // const axios = require("axios");
// // const path = require("path");
// // const fs = require("fs");
// // const app = express();
// // require('dotenv').config();
// // const upload = multer({ dest: "/tmp/" });
// // app.use(cors());
// // app.use(express.json());
// // app.post("/upload", upload.single("file"), async (req, res) => {
// //   // Here, you would upload the file to S3/minio, then call AI microservice.
// //   const filePath = req.file.path;
// //   const fileData = fs.readFileSync(filePath);
// //   // (For demo: just send file buffer/content to AI summarization service)
// //   await axios.post("http://ai:4004/summarize", {
// //     filename: req.file.originalname,
// //     file: fileData.toString("base64")
// //   });
// //   fs.unlinkSync(filePath);
// //   res.json({ status: "uploaded" });
// // });
// // const PORT = process.env.PORT || 4003;
// // app.listen(PORT, () => {
// //   console.log(`Media service running on port ${PORT}`);
// // });
var express = require("express");

var cors = require("cors");

var path = require("path");

var mongoose = require('mongoose');

var fs = require("fs");

var mediaRoutes = require("./routes/media");

require("dotenv").config();

var app = express();
mongoose.connect(process.env.MONGO_URI).then(function () {
  return console.log('MongoDB Connected');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
});
app.use(cors({
  origin: "http://localhost:5173",
  // allow your frontend's origin
  credentials: true // if you use cookies/auth

}));
app.use(express.json()); // Ensure tmp directory exists (works for all OS)

var tmpDir = path.join(__dirname, "tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
} // API routes


app.use("/api/media", mediaRoutes); // Health check

app.get("/", function (req, res) {
  return res.send("Media service running");
}); // Start server

var PORT = process.env.PORT || 4003;
app.listen(PORT, function () {
  console.log("Media service running on port ".concat(PORT));
});
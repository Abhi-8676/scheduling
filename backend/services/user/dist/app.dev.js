"use strict";

var express = require("express");

var cors = require("cors");

require('dotenv').config();

var mongoose = require("mongoose");

var userRoutes = require("./routes/userRoutes"); // const profileRoutes =require("./routes/profileRoutes")


var session = require("express-session");

var passport = require("./passport");

var app = express();
mongoose.connect(process.env.MONGO_URI).then(function () {
  return console.log('MongoDB Connected');
})["catch"](function (err) {
  return console.error('MongoDB connection error:', err);
});
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes); // app.use("/api/profile",profileRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false
  } // set secure: true in production with HTTPS

}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", function (req, res) {
  return res.send("User service running");
});
var PORT = process.env.PORT || 4005;
app.listen(PORT, function () {
  console.log("User service running on port ".concat(PORT));
});
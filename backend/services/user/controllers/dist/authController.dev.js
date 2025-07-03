"use strict";

var jwt = require("jsonwebtoken");

exports.googleAuthCallback = function (req, res) {
  try {
    // Ensure req.user is populated by your passport strategy
    if (!req.user) {
      return res.redirect("".concat(process.env.CLIENT_URL || "http://localhost:5173", "/login?error=OAuthFailed"));
    } // Generate a JWT token


    var token = jwt.sign({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }, process.env.JWT_SECRET || "your_jwt_secret", {
      expiresIn: "1h"
    });
    var clientUrl = process.env.CLIENT_URL || "http://localhost:5173"; // Option 1: Redirect with token in query parameter (simple, less secure)

    res.redirect("".concat(clientUrl, "/navbar?token=").concat(token, "&username=").concat(encodeURIComponent(req.user.username))); // Option 2: (Recommended) Set HTTP-only cookie and redirect (uncomment if using cookies)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000 // 1 hour

    });
    res.redirect("".concat(clientUrl, "/navbar?username=").concat(encodeURIComponent(req.user.username)));
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("".concat(process.env.CLIENT_URL || "http://localhost:5173", "/login?error=ServerError"));
  }
};
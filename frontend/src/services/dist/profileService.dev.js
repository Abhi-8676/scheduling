"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfile = getProfile;
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import axios from "axios";
// const API = import.meta.env.VITE_USER_API_URL || "http://localhost:4005/api";
// export async function getProfile() {
//   const token = localStorage.getItem("token");
//   const res = await axios.get(`${API}/profile`, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// }
// export async function createProfile(profile) {
//   const token = localStorage.getItem("token");
//   const { data } = await axios.post("/api/profile", profile, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//   });
//   return data;
// }
// export async function updateProfile(form) {
//   const token = localStorage.getItem("token");
//   const res = await axios.put(`${API}/profile`, form, {
//     headers: { Authorization: `Bearer ${token}` }
//   });
//   return res.data;
// }
function getProfile() {
  var _ref, data;

  return regeneratorRuntime.async(function getProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].get("/api/profile", {
            headers: {
              Authorization: "Bearer ".concat(localStorage.getItem("token"))
            }
          }));

        case 2:
          _ref = _context.sent;
          data = _ref.data;
          return _context.abrupt("return", data);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

function createProfile(profile) {
  var _ref2, data;

  return regeneratorRuntime.async(function createProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].post("/api/profile", profile, {
            headers: {
              Authorization: "Bearer ".concat(localStorage.getItem("token"))
            }
          }));

        case 2:
          _ref2 = _context2.sent;
          data = _ref2.data;
          return _context2.abrupt("return", data);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function updateProfile(profile) {
  var _ref3, data;

  return regeneratorRuntime.async(function updateProfile$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_axios["default"].put("/api/profile", profile, {
            headers: {
              Authorization: "Bearer ".concat(localStorage.getItem("token"))
            }
          }));

        case 2:
          _ref3 = _context3.sent;
          data = _ref3.data;
          return _context3.abrupt("return", data);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}
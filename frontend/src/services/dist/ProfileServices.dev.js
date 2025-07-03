"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// This file contains functions that interact with the database for profile operations.
var Profile = require('../../../backend/services/profile-service-app/models/profile');

var ProfileService =
/*#__PURE__*/
function () {
  function ProfileService() {
    _classCallCheck(this, ProfileService);
  }

  _createClass(ProfileService, [{
    key: "createProfile",
    value: function createProfile(profileData) {
      var profile;
      return regeneratorRuntime.async(function createProfile$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              profile = new Profile(profileData);
              _context.next = 3;
              return regeneratorRuntime.awrap(profile.save());

            case 3:
              return _context.abrupt("return", _context.sent);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "getProfileById",
    value: function getProfileById(profileId) {
      return regeneratorRuntime.async(function getProfileById$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(Profile.findById(profileId));

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "updateProfile",
    value: function updateProfile(profileId, profileData) {
      return regeneratorRuntime.async(function updateProfile$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(Profile.findByIdAndUpdate(profileId, profileData, {
                "new": true
              }));

            case 2:
              return _context3.abrupt("return", _context3.sent);

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "deleteProfile",
    value: function deleteProfile(profileId) {
      return regeneratorRuntime.async(function deleteProfile$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(Profile.findByIdAndDelete(profileId));

            case 2:
              return _context4.abrupt("return", _context4.sent);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }]);

  return ProfileService;
}();

module.exports = new ProfileService();
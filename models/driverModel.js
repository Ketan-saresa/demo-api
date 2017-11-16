/*
FileName : driverModel.js
Date : 2nd July 2017
Description : This file consist of driver users data model
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var ObjectId = Schema.ObjectId;


/* set up a mongoose model */

var driverSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  nickName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  homeTown: {
    type: String
  },
  residence: {
    type: String
  },
  homeTrack: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip: {
    type: String
  },
  birthdate: {
    type: Date
  },
  experience: {
    type: String
  },
  bio: {
    type: String
  },
  sponsorshipPitch: {
    type: String
  },
  websiteUrl: {
    type: String
  },
  facebookUrl: {
    type: String
  },
  twitterUrl: {
    type: String
  },
  instagramUrl: {
    type: String
  },
  blogUrl: {
    type: String
  },
  profilePic: {
    type: String
  },
  sponsorshipPitchAttachment: {
    type: String
  },
  seriesType: {
    type: String
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  forgotPasswordToken: {
    type: String
  },
  createdOn: {
    type: Date
  }
});

/* define unique key */
driverSchema.index({ email: 1 }, { unique: true });


/* save encrypted password */
driverSchema.pre('save', function (next) {
  var user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
  else {
    return next();
  }
});


/* compare passwor method */
driverSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

var Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;

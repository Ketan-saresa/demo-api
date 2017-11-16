/*
 FileName : driverController.js
 Date : 20th July 2017
 Description : This file consist of driver controller functions
 */

/* DEPENDENCIES */
var driverModel = require('./../models/driverModel');
var jwt = require('jsonwebtoken');
var config = require('./../config/config.constants');
var planSubscriptionModel = require('./../models/planSubscriptionModel');
var emailHandler = require('./../helpers/emailHandler');
var randomstring = require("randomstring");

/* create driver account */
exports.createDriverAccount = function (req, res) {
  // check body parameters
  if (!req.body.email || !req.body.userName || !req.body.password || !req.body.firstName || !req.body.lastName)
    return res.status(400).json({ message: 'Given parameters are invalid' });

  var driverObj = {
    email: req.body.email,
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nickName: req.body.nickName,
    homeTown: req.body.homeTown,
    residence: req.body.residence,
    homeTrack: req.body.homeTrack,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    birthdate: req.body.birthdate,
    experience: req.body.experience,
    bio: req.body.bio,
    sponsorshipPitch: req.body.sponsorshipPitch,
    websiteUrl: req.body.websiteUrl,
    facebookUrl: req.body.facebookUrl,
    twitterUrl: req.body.twitterUrl,
    instagramUrl: req.body.instagramUrl,
    blogUrl: req.body.blogUrl,
    profilePic: req.body.profilePic,
    seriesType: req.body.seriesType,
    createdOn: new Date()
  };

  var driver = new driverModel(driverObj);
  driverModel.findOne({ userName: req.body.userName }, function (err, resultUserNameCheck) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultUserNameCheck === null) {
      driver.save(function (err, resultDriverCreate) {
        if (err) {
          return res.status(400).json(err);
        }
        var verificationLink = config.serverURL + '/api/driver/verifyUserAccount/' + resultDriverCreate._id;
        emailHandler.sendDriverRegistrationMail(req.body.email, req.body.password, req.body.userName, verificationLink);
        return res.status(200).json({ message: 'Driver has been successfully created' });
      });
    } else {
      return res.status(400).json({ message: 'Sorry this user name is already taken, please enter another user name' });
    }
  });
};

/* Verify driver's account */
exports.verifyDriversAccount = function (req, res) {
  driverModel.update({ _id: req.params.driverId }, { isVerified: true }, function (err, resultDriverVerified) {
    if (err) {
      return res.status(400).json(err);
    } else {
      if (resultDriverVerified.nModified) {
        return res.status(200).json({ message: 'Your account has been successfully verified' });
      } else {
        return res.status(400).json({ message: 'Error while verifying your account' });
      }
    }
  });
};

/* Authenticate driver */
exports.authenticateDriver = function (req, res) {
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ message: 'Invalid parameters' });

  /* check driver details by email id */
  driverModel.findOne({ email: req.body.email }, function (err, resultDriverUser) {
    if (err)
      return res.status(400).json(err);
    if (resultDriverUser) {
      if (resultDriverUser.isVerified) {
        // compare encrypted password
        resultDriverUser.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var encodedData = {
              userId: resultDriverUser._id,
              email: resultDriverUser.email
            };
            // generate accessToken using JWT
            var token = jwt.sign(encodedData, config.secret);
            return res.status(200).json({ data: { token: token, driver: resultDriverUser } });
          } else {
            return res.status(403).json({ message: 'Email or Password is invalid' });
          }
        });
      } else {
        // Email is not yet verified
        return res.status(400).json({ message: 'Please verify your email address to login' });
      }
    } else {
      return res.status(403).json({ message: 'Email or Password is invalid' });
    }
  })
};

/* update Driver user's information*/
exports.updateDriverAccount = function (req, res) {
  // check body parameters
  if (!req.body.firstName || !req.body.lastName)
    return res.status(400).json({ message: 'Given parameters are invalid' });

  var driverObj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nickName: req.body.nickName,
    homeTown: req.body.homeTown,
    residence: req.body.residence,
    homeTrack: req.body.homeTrack,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    birthdate: req.body.birthdate,
    experience: req.body.experience,
    bio: req.body.bio,
    sponsorshipPitch: req.body.sponsorshipPitch,
    sponsorshipPitchAttachment: req.body.sponsorshipPitchAttachment,
    websiteUrl: req.body.websiteUrl,
    facebookUrl: req.body.facebookUrl,
    twitterUrl: req.body.twitterUrl,
    instagramUrl: req.body.instagramUrl,
    blogUrl: req.body.blogUrl,
    profilePic: req.body.profilePic,
    seriesType: req.body.seriesType
  };

  driverModel.findOneAndUpdate({ _id: req.params.driverId }, { $set: driverObj }, { new: true }, function (err, resultDriverUpdate) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultDriverUpdate });
  });
};

/* delete driver information by driver id */
exports.deleteDriverAccount = function (req, res) {
  driverModel.update({ _id: req.params.driverId }, { isArchived: true }, function (err, resultDriverDelete) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultDriverDelete.nModified)
      return res.status(200).json({ message: 'Driver has been successfully deleted' });
    else
      return res.status(400).json({ message: 'Error while deleting driver' });
  });
};

/* Get all list of drivers */
exports.getDriverList = function (req, res) {
  driverModel.find({}, function (err, resultDriverList) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultDriverList });
  });
};

/* Get driver information by realtor id */
exports.getDriverInformationById = function (req, res) {
  driverModel.findOne({ _id: req.params.driverId }, function (err, resultDriverInformation) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultDriverInformation });
  });
};

/* Get driver information by driver's username */
exports.getDriverInformationByDriverName = function (req, res) {
  driverModel.findOne({ userName: req.params.driverUserName }, function (err, resultDriverInformation) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultDriverInformation });
  });
};

/* Get driver's plan subscription information */
exports.getDriverSubscriptionInfo = function (req, res) {
  planSubscriptionModel.findOne({ dirverId: req.decoded.userId })
    .populate('planId')
    .exec(function (err, resultDriverSubscriptionInfo) {
      if (err) {
        return res.status(400).json(err);
      }
      return res.status(200).json({ data: resultDriverSubscriptionInfo });
    });
};

/* Send forgot password mail */
exports.forgotPassword = function (req, res) {
  if (!req.body.email) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  var resetPasswordToken = randomstring.generate();
  driverModel.update({ email: req.body.email }, { forgotPasswordToken: resetPasswordToken }, function (err, resultFindDriverByMail) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultFindDriverByMail.nModified) {
      var resetPasswordLink = config.serverURL + '/#/resetPassword?token=' + resetPasswordToken;
      emailHandler.sendForgotPasswordMail(req.body.email, resetPasswordLink);
      return res.status(200).json({ message: 'Mail has been sent successfully to your email address' });
    } else {
      return res.status(400).json({ message: 'Error while sending mail' });
    }
  })
};

/* Reset password */
exports.resetPassword = function (req, res) {
  if (!req.body.token || !req.body.password) {
    return res.status(400) / json({ message: 'Invalid parameters' });
  }
  driverModel.findOne({ forgotPasswordToken: req.body.token }, function (err, resultFetchUser) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultFetchUser) {
      resultFetchUser.password = req.body.password;
      resultFetchUser.save(function (err, resultPasswordReset) {
        if (err) {
          logger.error(err);
          return res.status(400).json({ status: 'Failure', message: err });
        }
        return res.status(200).json({ status: 'Success', message: "Password has been successfully changed" });
      });
    } else {
      return res.status(400).json({status : 'Failure', message : 'Invalid link'});
    }
  });
};

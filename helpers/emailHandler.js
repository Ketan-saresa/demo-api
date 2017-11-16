/*
FileName : emailHandler.js
Date : 21st Sep 2017
Description : This file consist of function to send emails
*/

/* DEPENDENCIES */
var utf8 = require('utf8');
var config = require('./../config/config.constants');
var fs = require('fs');
var postmark = require("postmark");

// Send an email:
var client = new postmark.Client(config.postmarkClientKey);

/* Sends mail while creating user account or admin account*/
exports.sendDriverRegistrationMail = function (userMailAddress, userPassword, userName, verificationLink) {
  client.sendEmail({
    /*
      Sensitive
    */
  }, function (error, result) {
    if (error) {
      console.error("Unable to send via postmark: " + error.message);
      return;
    }
    console.info("Sent to postmark for delivery")
  });
};

/* Sends mail when a user contacts company */
exports.sendUserContactCompanyMessages = function (toMail, mailHash, subject, message, attachment) {
  client.sendEmail({
    /*
      Sensitive
    */
  }, function (error, result) {
    if (error) {
      console.error("Unable to send via postmark: " + error.message);
      return;
    }
    console.info("Sent to postmark for delivery")
  });
};

/* Send forgot password mail */
exports.sendForgotPasswordMail = function (email, resetPasswordLink) {
  client.sendEmail({
    /*
      Sensitive
    */
  }, function (error, result) {
    if (error) {
      console.error("Unable to send via postmark: " + error.message);
      return;
    }
    console.info("Sent to postmark for delivery")
  });
};

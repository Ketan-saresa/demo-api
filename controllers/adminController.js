/*
FileName : adminController.js
Date : 25th July 2017
Description : This file consist of admin controller functions
*/

/* DEPENDENCIES */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./../config/config.constants');

/* Authenticate admin */
exports.authenticateAdmin = function (req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(200).json({ message: 'Invalid parameters' });
  }
  if (req.body.email === config.adminEmail) {
    bcrypt.compare(req.body.password, config.adminPassword, function (err, isMatch) {
      if (err) {
        return res.status(403).json({ message: 'Invalid password' });
      }
      var encodedData = {
        email: req.body.email
      };
      var token = jwt.sign(encodedData, config.secret);
      return res.status(200).json({ data: { email: req.body.email, token: token } });
    });
  } else {
    return res.status(400).json({ message: 'Invalid email address' });
  }
};

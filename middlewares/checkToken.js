/*
FileName : checkToken.js
Date : 26th June 2017
Description : This file consist of middleware functions to use while requesting data
*/

var jwt = require('jsonwebtoken');
var config = require('./../config/config.constants');

// validates access token for user
exports.validateToken = function (req, res, next) {
    
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
    
    // decode token
    if (token) {
   
      // verifies secret 
      jwt.verify(token, config.secret , function(err, decoded) {      
        if (err) {
          return res.status(403).json({status : 'Failure', message: 'Invalid Token' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });
    } else {
      // if there is no token
      return res.status(403).json({ 
          status : 'Failure',
          message: 'Invalid Token'
      });
    }
};

// check if the requesting user is Admin user
exports.isAdminUser = function(req, res, next) {
  if(req.decoded.email !== config.adminEmail)
    return res.status(403).json({status : 'Failure', message : 'You are not authorized to perform this operation'});
  else
    next();  
};
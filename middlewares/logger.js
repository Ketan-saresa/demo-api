/*
FileName : logger.js
Date : 26th June 2017
Description : winston configuration file for application logs
*/

var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ level : 'info', handleExceptions : false, filename: __dirname + '/../debug.log', json: true })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: true, timestamp: true }),
    new winston.transports.File({ level : 'debug', handleExceptions : true, filename: __dirname + '/../exceptions.log', json: true })
  ],
  exitOnError: false
});

module.exports = logger;
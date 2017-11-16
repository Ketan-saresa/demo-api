/*
FileName : dbConnection.js
Date : 26th June 2017
Description : This file consist of code for MongoDB connection
*/

var config = require('./config.constants');
var mongoose = require('mongoose');

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database is successfully connected');
});
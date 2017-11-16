/*
FileName : planSubscription.js
Date : 8th Aug 2017
Description : This file consist of driver's plan subscription data model*/

var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var bcrypt = require('bcryptjs');
var ObjectId = Schema.ObjectId;


/* set up a mongoose model */
var planSubscriptionSchema = new Schema({
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Plan'
  },
  dirverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver'
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date
  }
});

var Subscription = mongoose.model('Subscription', planSubscriptionSchema);
module.exports = Subscription;

/*
FileName : planModel.js
Date : 8th Aug 2017
Description : This file consist of driver's plan details data model*/

var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

/* set up a mongoose model */
var planSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  price: {
    type: SchemaTypes.Double,
    required: true
  },
  createdOn: {
    type: Date
  }
});

var Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;

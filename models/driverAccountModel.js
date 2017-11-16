/*
FileName : driverAccountModel.js
Date : 10th Nov 2017
Description : This file consist of driver's acount details data model
*/

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = Schema.ObjectId;

/* set up a mongoose model */
var driverAccountSchema = new Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver'
  },
  cardId: {
    type : [{ type: Schema.Types.ObjectId, ref: 'Card' }]
  },
  nextBillDate: {
    type: Date
  },
  isPaymentApplied: {
    type: Boolean,
    default : false
  },
  createdOn: {
    type: Date,
    default : Date.now
  }
});

var DriverAccount = mongoose.model('DriverAccount', driverAccountSchema);
module.exports = DriverAccount;

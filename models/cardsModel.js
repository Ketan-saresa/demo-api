/*
FileName : cardsModel.js
Date : 12th Nov 2017
Description : This file consist of driver's card details data model
*/

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = Schema.ObjectId;

/* set up a mongoose model */
var cardsSchema = new Schema({
  cardNumber: {
    type: String
  },
  cardName : {
    type : String
  },
  stripeCardId: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  addressLine1: {
    type: String
  },
  addressLine2: {
    type: String
  },
  zipcode: {
    type: String
  },
  brand : {
    type : String
  },
  expiringMonth: {
    type: Number
  },
  expiringYear: {
    type: Number
  },
  createdOn: {
    type: Date,
    default : Date.now
  }
});

var Card = mongoose.model('Card', cardsSchema);
module.exports = Card;

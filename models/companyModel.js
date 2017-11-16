/*
 FileName : companyModel.js
 Date : 20th Aug 2017
 Description : This file consist of company data who uploded .csv data
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* set up a mongoose model */

var companySchema = new Schema({
  'EXECUTIVE EMAIL': {
    type: String,
    required: true
  },
  'COMPANY NAME': {
    type: String,
    required: true
  },
  'ADDRESS': {
    type: String,
    required: true
  },
  'CITY': {
    type: String,
    required: true
  },
  'STATE': {
    type: String,
    required: true
  },
  'ZIP CODE': {
    type: String,
    required: true
  },
  'COUNTY': {
    type: String,
    required: true
  },
  'PHONE NUMBER': {
    type: String
  },
  'LAST NAME': {
    type: String,
    required: true
  },
  'FIRST NAME': {
    type: String,
    required: true
  },
  'CONTACT TITLE': {
    type: String
  },
  'CONTACT GENDER': {
    type: String
  },
  'PRIMARY SIC': {
    type: String
  },
  'PRIMARY SIC DESCRIPTION': {
    type: String
  },
  'METRO AREA': {
    type: String
  },
  'WEB ADDRESS': {
    type: String
  },
  'ACTUAL EMPLOYEE SIZE': {
    type: Number
  },
  'EMPLOYEE SIZE RANGE': {
    type: String
  },
  'SALES VOLUME RANGE': {
    type: String
  },
  'CREDIT ALPHA SCORE': {
    type: String
  },
  'CREDIT NUMERIC SCORE': {
    type: Number
  },
  'PUBLIC/PRIVATE FLAG': {
    type: String
  },
  'HEADQUARTERS/BRANCH': {
    type: String
  },
  'FRANCHISE/SPECIALTY #1': {
    type: String
  },
  'FRANCHISE/SPECIALTY #2': {
    type: String
  },
  'Date List Produced': {
    type: String
  },
  'Record Obsolescence Date': {
    type: String
  },
  'Source': {
    type: String
  },
  'MAILING CARRIER ROUTE': {
    type: String
  },
  'MAILING DELIVERY POINT BAR CODE': {
    type: String
  },
  'SECONDARY SIC #2': {
    type: String
  },
  'SECONDARY SIC DESCRIPTION #2': {
    type: String
  },
  'SECONDARY SIC #1': {
    type: String
  },
  'SECONDARY SIC DESCRIPTION #1': {
    type: String
  },
  'OFFICE SIZE': {
    type: String
  },
  'ADSIZE IN YELLOW PAGES': {
    type: String
  },
  'LATITUDE': {
    type: String
  },
  'LONGITUDE': {
    type: String
  },
  'Match Code': {
    type: String
  },
  'INFOUSA ID': {
    type: String
  },
  'PC CODE': {
    type: String
  }
});

var Company = mongoose.model('Company', companySchema);
module.exports = Company;

/*
 FileName : driverFavorites.js
 Date : 23th Aug 2017
 Description : This file consist of driver's favorites company
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;
var ObjectId = Schema.ObjectId;

var driverFavoriteCompanySchema = new Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Driver'
  },
  companyIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  }],
  createdOn: {
    type: Date
  }
});

var Favorites = mongoose.model('driverFavoriteCompany', driverFavoriteCompanySchema);
module.exports = Favorites;



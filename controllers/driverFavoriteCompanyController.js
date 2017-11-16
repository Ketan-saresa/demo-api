/*
FileName : driverFavoriteCompanyController.js
Date : 27th July 2017
Description : This file consist of driver favorite company controller functions
*/

/* DEPENDENCIES */
var driverFavoriteCompanyModel = require('../models/driverFavoriteCompanyModel');
var async = require('async');
var utils = require('./../helpers/utils');

/* Add company to driver's favorite list */
exports.addDriversFavoriteCompany = function (req, res) {
  if (!req.body.companyId) {
    return res.status(200).json({ message: 'Invalid parameters' });
  }
  async.series([
    function (callback) {
      driverFavoriteCompanyModel.findOne({ driverId: req.decoded.userId }, function (err, resultDriverInfo) {
        if (err) {
          callback(err);
        }
        console.log(resultDriverInfo);
        if (resultDriverInfo) {
          var valueCheck = utils.checkArrayContainsValue(JSON.parse(JSON.stringify(resultDriverInfo.companyIds)), req.body.companyId);
          if (valueCheck) {
            callback({ message: 'This Company is already in the favorite list' });
          } else {
            callback(null, 'one');
          }
        } else {
          callback(null, 'one');
        }
      });
    },
    function (callback) {
      driverFavoriteCompanyModel.update({ driverId: req.decoded.userId }, { $push: { companyIds: req.body.companyId } }, { upsert: true }, function (err, resultAddCompanyToFavorite) {
        if (err) {
          callback(err);
        }
        callback(null, 'two');
      });
    }
  ], function (err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ message: 'Company has been successfully added to favorites' });
  });
};

/* Get the list of favorite companies for driver */
exports.getListOfDriversFavoriteCompany = function (req, res) {
  if (!req.query.page || !req.query.limit) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  if (req.query.search) {
    driverFavoriteCompanyModel.findOne({ driverId: req.decoded.userId }).populate('companyIds', null, { 'COMPANY NAME': { $regex: '.*' + req.query.search + '.*' } }).exec(function (err, resultDriverFavoriteList) {
      if (err) {
        return res.status(400).json(err);
      }
      var totalRecords = resultDriverFavoriteList.companyIds.length;
      var offset = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
      var resultData = utils.getValuesFromArrayByIndex(resultDriverFavoriteList.companyIds, offset, offset + parseInt(req.query.limit));
      return res.status(200).json({ totalRecords: totalRecords, companyList: resultData });
    });
  } else {
    driverFavoriteCompanyModel.findOne({ driverId: req.decoded.userId }).populate('companyIds').exec(function (err, resultDriverFavoriteList) {
      if (err) {
        return res.status(400).json(err);
      }
      var totalRecords = resultDriverFavoriteList.companyIds.length;
      var offset = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
      var resultData = utils.getValuesFromArrayByIndex(resultDriverFavoriteList.companyIds, offset, offset + parseInt(req.query.limit));
      return res.status(200).json({ totalRecords: totalRecords, companyList: resultData });
    });
  }
};

/* Remove the list from favorite */
exports.removeCompanyFromDriversFavorite = function (req, res) {
  if (!req.params.companyId) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  driverFavoriteCompanyModel.update({ driverId: req.decoded.userId }, { $pop: { companyIds: req.params.companyId } }, function (err, resultRemoveCompanyList) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ message: 'Company has been successfully removed from favorite list' });
  });
};

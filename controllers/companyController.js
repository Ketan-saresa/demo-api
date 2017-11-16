/*
 FileName : adminController.js
 Date : 23th Aug 2017
 Description : This file consist of company controller functions
 */

/* DEPENDENCIES */

var companyModel = require('../models/companyModel');
var utils = require('../helpers/utils');
var async = require('async');

exports.companyFilter = function (req, res) {

  if (!req.query.page || !req.query.limit) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  var filteredQuery = {};
  filteredQuery['ZIP CODE'] = req.query.zipcode ? { $regex: '^' + req.query.zipcode } : undefined;
  filteredQuery['CITY'] = req.query.city ? req.query.city : undefined;
  filteredQuery['STATE'] = req.query.state ? req.query.state : undefined;
  filteredQuery['METRO AREA'] = req.query.metroArea ? req.query.metroArea : undefined;
  filteredQuery['EMPLOYEE SIZE RANGE'] = req.query.empSizeRange ? req.query.empSizeRange : undefined;
  filteredQuery['SALES VOLUME RANGE'] = req.query.salseVolumeRange ? req.query.salseVolumeRange : undefined;

  filteredQuery = JSON.parse(JSON.stringify(filteredQuery));
  var resultObject = {
    companyData: [],
    totalRecords: 0
  };
  var offset = (parseInt(req.query.page) - 1) * parseInt(req.query.limit);
  async.parallel([
    function (callback) {
      companyModel.count(filteredQuery).exec(function (err, resultTotalCount) {
        if (err) {
          callback(err);
        }
        resultObject.totalRecords = resultTotalCount;
        callback(null, 'one');
      });
    },
    function (callback) {
      companyModel.find(filteredQuery).skip(offset).limit(parseInt(req.query.limit)).exec(function (err, resultCompanyList) {
        if (err) {
          callback(err);
        }
        resultObject.companyData = resultCompanyList;
        callback(null, 'two');
      });
    }
  ], function (err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultObject });
  });
};

exports.getCompanyStateList = function (req, res) {
  companyModel.find().distinct('STATE', function (err, resultStatesNameList) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultStatesNameList.sort() });
  });
};

exports.getCompanyMetroAreaList = function (req, res) {
  companyModel.find().distinct('METRO AREA', function (err, resultMetroAreaNameList) {
    if (err) {
      return res.status(400).json(err);
    }
    // resultMetroAreaNameList = utils.splitStringByCommaFromArray(resultMetroAreaNameList, ',');
    return res.status(200).json({ data: resultMetroAreaNameList });
  });
};

exports.getCompanyEmployeeSizeList = function (req, res) {
  companyModel.find().distinct('EMPLOYEE SIZE RANGE', function (err, resultEmployeeSizeList) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultEmployeeSizeList });
  });
};

exports.getCompanySalesVolumeList = function (req, res) {
  companyModel.find().distinct('SALES VOLUME RANGE', function (err, resultSalesVolumeList) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultSalesVolumeList });
  });
};

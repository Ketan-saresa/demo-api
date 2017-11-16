/*
 FileName : fileHandler.js
 Date : 26th Aug 2017
 Description : This file consist of file(media) related function.
 */

/* DEPENDENCIES */
var multer = require('multer');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var exec = require('child_process').exec;
var async = require('async');
var companyModel = require('./../models/companyModel');

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, appDir + '/../public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  }
});

var storageCsv = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, appDir + '/../public/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  }
});

var storagePdf = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, appDir + '/../public/uploads/pdf');
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + '_' + file.originalname);
  }
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var fileFormat = file.originalname.substr(file.originalname.lastIndexOf('.'), file.originalname.length);
    if (fileFormat !== '.jpg' && fileFormat !== '.jpeg' && fileFormat !== '.png') {
      cb(new Error('Only image files are allowed'))
    } else {
      cb(null, true)
    }
  }
}).fields([
  { name: 'file', maxCount: 1 }
]);

var uploadCsv = multer({
  storage: storageCsv,
  fileFilter: function (req, file, cb) {
    var fileFormat = file.originalname.substr(file.originalname.lastIndexOf('.'), file.originalname.length);
    if (fileFormat !== '.csv') {
      cb(new Error('Only CSV files are allowed'))
    } else {
      cb(null, true)
    }
  }
}).fields([
  { name: 'file', maxCount: 1 }
]);

var uploadPdf = multer({
  storage: storagePdf,
  fileFilter: function (req, file, cb) {
    var fileFormat = file.originalname.substr(file.originalname.lastIndexOf('.'), file.originalname.length);
    if (fileFormat !== '.pdf') {
      cb(new Error('Only PDF files are allowed'))
    } else {
      cb(null, true)
    }
  }
}).fields([
  { name: 'file', maxCount: 1 }
]);

exports.uploadObj = upload;
exports.uploadPdfObj = uploadPdf;
exports.uploadCsvObj = uploadCsv;

/* Upload CSV file and import data to CSV */
exports.importCsvToDB = function (req, res) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ status: 'Failure', message: 'No file is selected' });
  }
  if (process.platform === 'linux') {
    var command = 'mongoimport --host localhost --db raceagent-api --collection companies --type csv --headerline --file "' + req.files.file[0].path + '"';
  } else {
    var command = '"C:\\Program Files\\MongoDB\\Server\\3.2\\bin\\mongoimport" --host localhost --db raceagent-api --collection companies --type csv --headerline --file "' + req.files.file[0].path + '"';
  }
  exec(command, (err, stdout, stderr) => {
    if (err) {
      return res.status(400).json({ err: err });
    }
    companyModel.update({}, { $unset: { 'Date List Produced': 1, 'Record Obsolescence Date': 1, 'Source': 1, 'MAILING CARRIER ROUTE': 1, 'MAILING DELIVERY POINT BAR CODE': 1, 'SECONDARY SIC #2': 1, 'SECONDARY SIC DESCRIPTION #2': 1, 'SECONDARY SIC #1': 1, 'SECONDARY SIC DESCRIPTION #1': 1, 'OFFICE SIZE': 1, 'ADSIZE IN YELLOW PAGES': 1, 'SQUARE FOOTAGE': 1, 'LATITUDE': 1, 'LONGITUDE': 1, 'Match Code': 1, 'INFOUSA ID': 1, 'PC CODE': 1 } }, { multi: true, safe: true }, function (err, resultRemoveExtraFields) {
      if (err) {
        return res.status(400).json(err);
      }
      else {
        return res.status(200).json({ message: 'CSV has been successfully imported into DB' });
      }
    });
  });
};

/* Upload Driver's profile image */
exports.uploadDriverProfile = function (req, res) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ status: 'Failure', message: 'No file is selected' });
  }
  return res.status(200).json({ status: 'Success', message: 'Profile picture has been successfullly uploaded', fileName: req.files.file[0].filename });
};

/* Upload Driver's PDF file */
exports.uploadDriversPDF = function (req, res) {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ status: 'Failure', message: 'No file is selected' });
    }
    return res.status(200).json({ status: 'Success', message: 'PDF has been successfullly uploaded', fileName: req.files.file[0].filename });
  };

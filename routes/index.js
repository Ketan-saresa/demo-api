/*
 FileName : Index.js
 Date : 26th June 2017
 Description : This file consist of list of routes for the APIs
 */

/* DEPENDENCIES */
var express = require('express');
var router = express.Router();
var dbConnection = require('./../config/dbConnection');
var adminController = require('./../controllers/adminController');
var subscriptionController = require('./../controllers/subscriptionController');
var driverController = require('./../controllers/driverController');
var messageController = require('./../controllers/messageController');
var fileHandler = require('./../helpers/fileHandler');
var plan = require('./../helpers/createPlanScript');
var checkToken = require('./../middlewares/checkToken');
var comapnyController = require('./../controllers/companyController');
var driversAccountController = require('./../controllers/driversAccountController');
var driverFavoriteCompanyController = require('./../controllers/driverFavoriteCompanyController');

/* ----- API ROUTES -------- */

/* DRIVER */

/* Driver Register */
router.post('/driver', driverController.createDriverAccount);

/* Verify driver's email address */
router.get('/driver/verifyUserAccount/:driverId', driverController.verifyDriversAccount);

/* Driver Login */
router.post('/driver/login', driverController.authenticateDriver);

/* Update driver information */
router.put('/driver/:driverId', checkToken.validateToken, driverController.updateDriverAccount);

/* Delete driver information by driver id (Only for admin) */
router.delete('/driver/:driverId', checkToken.validateToken, checkToken.isAdminUser, driverController.deleteDriverAccount);

/* List of drivers (Only for admin) */
router.get('/driversList', checkToken.validateToken, checkToken.isAdminUser, driverController.getDriverList);

/* Get driver information by driver id */
router.get('/driver/:driverId', checkToken.validateToken, driverController.getDriverInformationById);

/* Get driver details by driver username */
router.get('/driver/username/:driverUserName', driverController.getDriverInformationByDriverName);

/* Upload driver's profile picture */
router.post('/driver/profilePicture', fileHandler.uploadObj, fileHandler.uploadDriverProfile);

/* Get Driver's plan subscription information */
router.get('/driver/plan/subscription', checkToken.validateToken, driverController.getDriverSubscriptionInfo);

/* Driver's forgot password */
router.post('/driver/forgotPassword', driverController.forgotPassword);

/* Driver's reset password */
router.post('/driver/resetPassword', driverController.resetPassword);

/* DRIVER'S BILLING INFO */

/* Add new card details */
router.post('/driver/account/card', checkToken.validateToken, driversAccountController.createCard);

/* Retrive driver's card information */
router.get('/driver/account/card', checkToken.validateToken, driversAccountController.getCardDetails);

/* Update driver's card information */
router.put('/driver/account/card/:cardId', checkToken.validateToken, driversAccountController.updateCard);

/* Delete driver's card information */
router.put('/driver/account/card/:cardId', checkToken.validateToken, driversAccountController.deleteCard);



/* EMAIL MESSAGES */

/* All messages for admin */
router.get('/messages', checkToken.validateToken, messageController.getMessages);

/* Get details of messages for driver */
router.get('/messages/:emailId', checkToken.validateToken, messageController.getMessageDetailsForDriver);

/* Message Save */
router.post('/messages', checkToken.validateToken, messageController.sendNewMessage);

/* Message Callback */
router.post('/messageCallback', messageController.messageOnThreadCallback);


/* ADMIN */

/* Admin Login */
router.post('/admin/login', adminController.authenticateAdmin);



/* UPLOAD CSV DATA */

/* Upload CSV and add data to DB */
router.post('/uploadCsv', checkToken.validateToken, fileHandler.uploadCsvObj, fileHandler.importCsvToDB);

/* Upload PDF file for driver */
router.post('/uploadPdf', fileHandler.uploadPdfObj, fileHandler.uploadDriversPDF);


/* SUBSCRIPTION */

/* Create plan */
router.get('/createPlan', plan.createPlan);

/* Get plan details */
router.get('/plan', subscriptionController.getListOfPlanDetails);

/* Subscribe plan for driver */
router.post('/plan/subscription', checkToken.validateToken, subscriptionController.planSubscription);

/* Upgrade or Downgrade plan for user */
router.put('/plan/subscription', checkToken.validateToken, subscriptionController.updatePlanSubscription);

/* Get subscription by Driver Id */
router.get('/plan/subscription', checkToken.validateToken, subscriptionController.getSubscription);


/* COMPANY */

/* Search in company with filter */
router.get('/company/filter', checkToken.validateToken, comapnyController.companyFilter);

/* Get state name list for dropdown from companyies */
router.get('/company/stateList', checkToken.validateToken, comapnyController.getCompanyStateList);

/* Get Metro Area list for dropdown from companyies */
router.get('/company/metroAreaList', checkToken.validateToken, comapnyController.getCompanyMetroAreaList);

/* Get Employee size list for dropdown from companyies */
router.get('/company/employeeSizeList', checkToken.validateToken, comapnyController.getCompanyEmployeeSizeList);

/* Get sales volume list for dropdown from companies */
router.get('/company/salesVolumeList', checkToken.validateToken, comapnyController.getCompanySalesVolumeList);


/* Driver's favorite company */
router.post('/driver/company/favorite', checkToken.validateToken, driverFavoriteCompanyController.addDriversFavoriteCompany);

/* Get list of driver's favorite comapnies */
router.get('/driver/company/favorite', checkToken.validateToken, driverFavoriteCompanyController.getListOfDriversFavoriteCompany);

/* Get list of driver's favorite comapnies */
router.delete('/driver/company/favorite/:companyId', checkToken.validateToken, driverFavoriteCompanyController.removeCompanyFromDriversFavorite);


module.exports = router;

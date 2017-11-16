/*
 FileName : driversAccountController.js
 Date : 12th Nov 2017
 Description : This file consist of driver's stripe account related functions
 */

/* DEPENDENCIES */
var configConstants = require('./../config/config.constants');
var stripe = require('stripe')(configConstants.stripeTestKey);
var async = require('async');
var planModel = require('./../models/cardsModel');
var cardsModel = require('./../models/cardsModel');
var driverAccountModel = require('./../models/driverAccountModel');
var planSubscriptionModel = require('../models/planSubscriptionModel');

/* Create Card for driver */
exports.createCard = function (req, res) {
  if (!req.body.cardNumber || !req.body.cvc || !req.body.expiringMonth || !req.body.expiringYear) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  /* Check if user already has plan */
  planSubscriptionModel.findOne({ driverId: req.decoded.userId }, function (err, resultPlanCheck) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultPlanCheck) {
      async.waterfall([
        function (callback) {
          stripe.tokens.create({
            card: {
              "number": req.body.cardNumber,
              "exp_month": req.body.expiringMonth,
              "exp_year": req.body.expiringYear,
              "cvc": req.body.cvc
            }
          }, function (err, token) {
            if (err) {
              callback(err);
            }
            callback(null, token);
          });
        },
        function (token, callback) {
          stripe.customers.createSource(
            resultPlanCheck.stripeCustomerId,
            { source: token.id },
            function (err, card) {
              var cardObj = {
                cardNumber: card.last4,
                stripeCardId: card.id,
                city: card.address_city,
                country: card.address_country,
                addressLine1: card.address_line1,
                addressLine2: card.address_line2,
                zipcode: card.address_zip,
                brand: card.brand,
                expiringMonth: card.exp_month,
                expiringYear: card.exp_year,
                cardName: card.name
              };
              var card = new cardsModel(cardObj);
              card.save(function (err, resultCardSave) {
                if (err) {
                  callback(err);
                } else {
                  callback(null, resultCardSave);
                }
              });
            }
          );
        },
        function (cardInfo, callback) {
          driverAccountModel.update({ driverId: req.decoded.userId }, { $push: { cardId: cardInfo._id } }, function (err, resultCardUpdate) {
            if (err) {
              callback(err);
            } else {
              callback(null, resultCardUpdate);
            }
          });
        }
      ], function (err, result) {
        if (err) {
          return res.status(400).json(err);
        } else {
          return res.status(200).json({ message: 'Card has been successfully added' });
        }
      })
    } else {
      return res.status(400).json({ message: 'You have not subscribed yet, Please subscribe a plan to add cards' });
    }
  });
};

/* Retrive details of all cards for driver */
exports.getCardDetails = function (req, res) {
  driverAccountModel.find({ driverId: req.decoded.userId }).populate('cardId').exec(function (err, resultCardDetails) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(resultCardDetails);
  });
};

/* Update card information */
exports.updateCard = function (req, res) {
  if (!req.body.cardName || !req.body.expiringMonth || !req.body.expiringYear) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  var cardObj = {
    city: req.body.city,
    country: req.body.country,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    zipcode: req.body.zipcode,
    expiringMonth: req.body.expiringMonth,
    expiringYear: req.body.expiringYear,
    cardName: req.body.cardName
  };
  cardsModel.update({ _id: req.params.cardId }, cardObj, function (err, resultCardUpdate) {
    if (err) {
      return res.status(400).json(err);
    } else {
      return res.status(200).json({ message: 'Card has been successfully updated' });
    }
  });
}

/* Delete card information */
exports.deleteCard = function (req, res) {
  driverAccountModel.update({ driverId: req.decoded.userId }, { $pull: { cardId: req.params.cardId } }, function(err, resultCardDelete){
    if(err) {
      return res.status(400).json(err);
    } else {
      return res.status(200).json({message : 'Card has been successfully removed'});
    }
  });
}

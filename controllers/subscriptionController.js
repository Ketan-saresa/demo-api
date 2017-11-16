/*
 FileName : subscriptionController.js
 Date : 3rd Aug 2017
 Description : This file consist of driver's stripe plan subscription
 */

/* DEPENDENCIES */
var configConstants = require('./../config/config.constants');
var stripe = require('stripe')(configConstants.stripeTestKey);
var async = require('async');
var planModel = require('./../models/planModel');
var moment = require('moment');
var cardsModel = require('./../models/cardsModel');
var driverAccountModel = require('./../models/driverAccountModel');
var planSubscriptionModel = require('../models/planSubscriptionModel');
var ObjectId = require('mongoose').Types.ObjectId;


/* Fetches the list of plan */
exports.getListOfPlanDetails = function (req, res) {
  planModel.find({}, function (err, resultPlan) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: resultPlan });
  });
};

/* Subscribes new plan for driver */
exports.planSubscription = function (req, res) {
  if (!req.body.email || !req.body.stripeToken || !req.body.planId) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  planModel.findOne({ _id: req.body.planId }, function (err, resultPlanDetails) {
    if (err) {
      return res.status(400).json(err);
    }
    if (resultPlanDetails !== null) {
      stripe.customers.create({
        email: req.body.email,
        source: req.body.stripeToken, // obtained with Stripe.js
        plan: resultPlanDetails.planId,
        quantity: 1
      }, function (err, customer) {
        if (err) {
          return res.status(400).json(err);
        }
        var planSubscriptionObj = {
          planId: resultPlanDetails._id,
          dirverId: req.decoded.userId,
          stripeCustomerId: customer.id,
          createdOn: new Date()
        };
        planSubscription = new planSubscriptionModel(planSubscriptionObj);
        planSubscription.save(function (err, resultPlanSubscribe) {
          if (err) {
            return res.status(400).json(err);
          }
          saveCardForDriver(req.decoded.userId, customer.id, req.body.stripeToken);
          return res.status(200).json({ data: resultPlanSubscribe });
        });
      });
    } else {
      return res.status(400).json({ message: 'Plan does not exists' });
    }
  });
};

/* Upgrade or downgrade plan subscription for driver */
exports.updatePlanSubscription = function (req, res) {
  if (!req.body.planId) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  async.waterfall([
    function (callback) {
      planSubscriptionModel.findOne({ dirverId: req.decoded.userId })
        .exec(function (err, resultPlanInformation) {
          if (err || resultPlanInformation === null) {
            callback({ err: 'No plan exists' });
          } else {
            callback(null, resultPlanInformation);
          }
        });
    },
    function (planInfo, callback) {
      planModel.findOne({ _id: req.body.planId }, function (err, resultPlanObj) {
        if (err) {
          callback(err);
        }
        callback(null, planInfo, resultPlanObj);
      });
    },
    function (planInfo, newPlanInfo, callback) {
      // Retrive stripe customer based on stripe client id
      stripe.customers.retrieve(planInfo.stripeCustomerId, function (err, resultStripeCustomer) {
        if (err) {
          callback(err);
        } else {
          callback(null, planInfo, newPlanInfo, resultStripeCustomer);
        }
      });
    },
    function (planInfo, newPlanInfo, stripeCustomerInfo, callback) {
      // Retrive subscription based on customer
      stripe.subscriptions.retrieve(stripeCustomerInfo.subscriptions.data[0].id, function (err, resultCustomerSubscription) {
        if (err) {
          callback(err);
        } else {
          callback(null, planInfo, newPlanInfo, resultCustomerSubscription);
        }
      });
    },
    function (planInfo, newPlanInfo, customerSubscriptionInfo, callback) {
      // Update customer subscription
      var item_id = customerSubscriptionInfo.items.data[0].id;
      stripe.subscriptions.update(customerSubscriptionInfo.id, {
        items: [{
          id: item_id,
          plan: newPlanInfo.planId
        }]
      }, function (err, subscription) {
        if (err) {
          callback(err);
        } else {
          callback(null, { message: "User subscription updated successfully" })
        }
      });
    }
  ], function (err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json(result);
  });
};

exports.getSubscription = function (req, res) {
  planSubscriptionModel.find({ dirverId: ObjectId(req.query.driverId) }, function (err, result) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ data: result });
  });
};

var saveCardForDriver = function (driverId, customerId, stripeToken) {
  async.waterfall([
    function (callback) {
      stripe.customers.listCards(customerId, function (err, cards) {
        if (err) {
          callback(err);
        } else {
          callback(null, cards);
        }
      });
    },
    function (cardInfo, callback) {
      var card = cardInfo.data[0];
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
        cardName : card.name
      };
      var card = new cardsModel(cardObj);
      card.save(function (err, resultCardSave) {
        if (err) {
          callback(err);
        } else {
          callback(null, resultCardSave);
        }
      });
    },
    function(resultCardInfo, callback) {
      var driverAccountObj = {
        driverId : driverId,
        cardId : [resultCardInfo._id],
        nextBillDate : moment(resultCardInfo.createdOn).add(1, 'months'),
        isPaymentApplied : true
      };
      driverAccount = new driverAccountModel(driverAccountObj);
      driverAccount.save(function(err, resultDriverAccountSave){
        if(err) {
          callback(err);
        } else {
          callback(null, resultDriverAccountSave);
        }
      });
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  })
}

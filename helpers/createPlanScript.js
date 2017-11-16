/*
 FileName : createPlanScript.js
 Date : 13th Aug 2017
 Description : This file consist script for create paln.
 */

/* DEPENDENCIES */
var planModel = require('../models/planModel');
var dbConnection = require('./../config/dbConnection');

var planName = ["test", "test"];
var planId = ["RC1", "RC2"];
var planPrice = ["29.99", "49.99"];

exports.createPlan = function () {

  // Check if plan exists
  planModel.find({}, function (err, resultPlanList) {
    if (err) {
      console.log(err);
    }
    if (resultPlanList.length) {
      console.log("plans already exists in DB");
    } else {
      console.log("No plans found, Creating plans");
      for (var i = 0; i < planName.length; i++) {
        planObj = {
          name: planName[i],
          planId: planId[i],
          price: planPrice[i],
          createdOn: new Date()
        };
        var plan = new planModel(planObj);
        plan.save(function (err, resultPlanCreate) {
          if (err) {
            console.log(err);
          }
          console.log("Plan created");
        });
      }
    }
  });
}

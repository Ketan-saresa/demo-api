/*
 FileName : utils.js
 Date : 26th Aug 2017
 Description : This file consist of utility functions.
 */

/* DEPENDENCIES */
var _ = require('lodash');

/* Split the string by ',' */
exports.splitStringByCommaFromArray = function (arr, delimeter) {
  _.forEach(arr, function (value, index) {
    arr[index] = value.split(delimeter)[0];
  });
  return arr;
};

/* Check if the array contains the value */
exports.checkArrayContainsValue = function (arr, value) {
  return _.includes(arr, value.toLowerCase());
};

/* Slice from array */
exports.getValuesFromArrayByIndex = function (arr, start, end) {
  return _.slice(arr, start, end);
};

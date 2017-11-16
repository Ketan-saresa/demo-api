/*
FileName : messageModel.js
Date : 26th Sep 2017
Description : This file consist of message data model*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

/* set up a mongoose model */
var messageSchema = mongoose.Schema({
  senderMailId: {
    type: String,
    required: true
  },
  receiverMailId: {
    type: String,
    required: true
  },
  sentOn: {
    type: Date,
    default: Date.now
  },
  messageContents: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  messageHash: {
    type: String,
    required: true
  }
});

var Message = mongoose.model('Message', messageSchema);
module.exports = Message;

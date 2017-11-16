/*
 FileName : messageController.js
 Date : 26th Sept 2017
 Description : This file consist of driver's stripe plan subscription
 */

/* DEPENDENCIES */
var configConstants = require('./../config/config.constants');
var messageModel = require('./../models/messageModel');
var driverModel = require('./../models/driverModel');
var mailHandler = require('./../helpers/emailHandler');
var async = require('async');
var fs = require('fs');

/* Get all messages */
exports.getMessages = function (req, res) {
  messageModel.find({}, function (err, messages) {
    if (err) {
      return res.status(400).json(err);
    }
    return res.status(200).json({ messages: messages});
  });
};

/* Fetches the message details for driver by email address */
exports.getMessageDetailsForDriver = function (req, res) {
  var resultObj = {
    inbox: [],
    sentbox: []
  };
  async.parallel([
    function (callback) {
      messageModel.find({ senderMailId: req.params.emailId }, function (err, resultSentBox) {
        if (err) {
          callback(err);
        }
        resultObj.sentbox = resultSentBox;
        callback(null, 'one');
      });
    },
    function (callback) {
      messageModel.find({ receiverMailId: req.params.emailId }, function (err, resultInBox) {
        if (err) {
          callback(err);
        }
        resultObj.inbox = resultInBox;
        callback(null, 'two');
      });
    }
  ], function (err, result) {
    if (err) {
      return res.status(400).json(err);
    } else {
      return res.status(200).json(resultObj);
    }
  })
}

/* Send new messages */
exports.sendNewMessage = function (req, res) {
  if (!req.body.senderMailId || !req.body.receiverMailId || !req.body.messageContents || !req.body.subject) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }
  //Need to save message here.
  var messageObj = {
    senderMailId: req.body.senderMailId,
    receiverMailId: req.body.receiverMailId,
    messageContents: req.body.messageContents,
    subject: req.body.subject,
    messageHash: Math.random().toString(36).substring(7)
  };
  var attachments = [];
  async.series([
    function (callback) {
      var message = new messageModel(messageObj);
      message.save(function (err, resultNewMessage) {
        if (err) {
          callback(err);
        } else {
          callback(null, 'one');
        }
      });
    },
    function (callback) {
      if (req.body.profileAttached) {
        driverModel.findOne({ _id: req.decoded.userId }, { sponsorshipPitchAttachment: 1 }, function (err, resultAttachment) {
          if (err) {
            callback(err);
          } else {
            if (resultAttachment) {
              var fileData = fs.readFileSync(__dirname + '/../public/uploads/pdf/' + resultAttachment.sponsorshipPitchAttachment);
              var obj = {
                'Name': resultAttachment.sponsorshipPitchAttachment,
                'Content': fileData,
                'ContentType': 'application/octet-stream'
              };
              attachments.push(obj);
            }
            callback(null, 'two');
          }
        })
      } else {
        callback(null, 'two');
      }
    }
  ], function (err, result) {
    if (err) {
      return res.status(400).json(err);
    } else {
      mailHandler.sendUserContactCompanyMessages(req.body.receiverMailId, messageObj.messageHash, req.body.subject, req.body.messageContents, attachments);
      return res.status(200).json({ message: 'Message successfully sent' });
    }
  })
}

/* Reply Message on thread Callback */
exports.messageOnThreadCallback = function (req, res) {
  console.log("================CALLBACK BODY============");
  console.log(req.body);
  console.log("========================================");
  var mailHash = req.body.MailboxHash;

  messageModel.findOne({ messageHash: mailHash }, function (err, resultFoundMessage) {
    if (err) {
      console.log(err);
      return res.status(200).json(err);
    }
    if (resultFoundMessage) {
      console.log("================RESULT FOUND MESSAGE========================");
      console.log(resultFoundMessage);
      console.log("========================================");

      if (resultFoundMessage.receiverMailId === req.body.From) {
        var receiverMailId = resultFoundMessage.senderMailId;
      } else if (resultFoundMessage.senderMailId === req.body.From) {
        var receiverMailId = resultFoundMessage.receiverMailId;
      }

      /* Save new message */
      var messageObj = {
        senderMailId: req.body.From,
        receiverMailId: receiverMailId,
        messageContents: req.body.HtmlBody,
        subject: req.body.Subject,
        messageHash: resultFoundMessage.messageHash
      };

      var message = new messageModel(messageObj);
      message.save(function (err, resultNewMessage) {
        if (err) {
          console.log(err);
          return res.status(200).json(err);
        }
        mailHandler.sendUserContactCompanyMessages(receiverMailId, resultFoundMessage.messageHash, resultFoundMessage.subject, req.body.HtmlBody);
        return res.status(200).json({ message: 'message sent successfully' });
      })
    } else {
      console.log("No message found for this hash ::" + req.body.MailboxHash);
      return res.status(200).json({ message: 'No message found for this hash ::' + req.body.MailboxHash });
    }
  });
}

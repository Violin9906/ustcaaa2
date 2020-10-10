var User = require('../models/user');
var mongoose = require('mongoose');

var CheckMail = {
  check: function (code, id, callback) {
    User.findById(id, function (error, user) {
      var now = new Date();
      var err = "Failed";
      if((now - user.checkCodeGenTime <= 1800000) && code === user.checkCode && code.length === 20) {
        user.emailChecked = true;
        user.isUSTC = !!user.email.match(/ustc.edu.cn$/);
        user.save();
        err = 0;
      }
      callback(err);
    })
  }
};

module.exports = CheckMail;

var User = require('../models/user');
var mongoose = require('mongoose');

var CheckMail = {
  check: function (code, id, callback) {
    User.findById(id, function (err, user) {
      var now = new Date();
      var err = "Failed";
      if((now - user.checkCodeGenTime <= 1800000) && code === user.checkCode && code.length === 20) {
        user.emailChecked = true;
        // TODO 检查是否科大邮箱
        user.save();
        err = 0;
      }
      callback(err);
    })
  }
};

module.exports = CheckMail;

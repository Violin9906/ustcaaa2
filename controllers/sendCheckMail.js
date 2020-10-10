var credentials = require('../credentials.js');
var config = require('../config.js');
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(credentials.sendgrid.apiKey);

var sendCheckMail = {
  errorCode: 0,
  send: function (address, code, id) {
    const msg = {
      to: address,
      from: 'noreply@ustcaaa.club',
      subject: '中科大学生天文爱好者协会邮箱验证',
      html: '<a href="http://' + config.domain + '/emailcheck/' + id + '/' + code + '">点击链接完成邮箱验证</a>',
    };
    sgMail.send(msg)
        .then(() => {
          this.errorCode = 0;
        })
        .catch(error => {
          console.error(error.toString());
          this.errorCode = error.code;
        });
  }
};

module.exports = sendCheckMail;

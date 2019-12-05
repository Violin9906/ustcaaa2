var credentials = require('../credentials.js');
var sgMail = require('@sendgrid/mail');
sgMail.setApiKey(credentials.sendgrid.apiKey);

var sendCheckMail = {
  errorCode: 0,
  send: function (address, code) {
    const msg = {
      to: address,
      from: 'ustcaaa.club',
      subject: '中科大学生天文爱好者协会邮箱验证',
      text: 'and easy to do anywhere, even with Node.js',
      html: '' + code,
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

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  checkCode: String,
  checkCodeGenTime: Date,
  authentication: String,
  points: Number,
  paid: Boolean,
  isUSTC: Boolean,
  stuNo: String,
  available: Boolean,
  achievements: [String],
  advancements: [String],
  medals: [String],
  watchedUser: [String],
  portrait: String,
  description: String,
  celebrity: Boolean,
  equipmentLevel: Number,
  academyLevel: Number,
  publicLevel: Number,
  financeLevel: Number,
  administrator: Boolean
});

userSchema.methods.genCheckCode = function (codeLength) {
  var code = Math.random().toString(36).substring(2);
  while(code.length < codeLength) {
    code += Math.random().toString(36).substring(2);
  }
  this.checkCode = code.substring(0, codeLength).toUpperCase();
  this.checkCodeGenTime = new Date();
  this.save();
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPwd = function (password) {
  return bcrypt.hashSync(password, 12);
};

var User = mongoose.model('User', userSchema);
module.exports = User;

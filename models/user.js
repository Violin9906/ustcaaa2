var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  username: String, // 用户名
  email: String, // 邮箱
  password: String, // 密码（加密）
  checkCode: String, // 验证码
  checkCodeGenTime: Date, // 验证码生成时间
  emailChecked: Boolean, // 邮箱已校验
  lostPassword: Boolean, // 已提交找回密码申请
  points: Number, // 用户积分
  paid: Boolean, // 是否付费成为正式会员
  isUSTC: Boolean, // 是否采用科大邮箱注册（校验邮箱时更新）
  stuNo: String, // 学号
  available: Boolean, // 账户可用性
  achievements: [String], // 成就列表
  advancements: [String], // 进度列表
  medals: [String], // 勋章列表
  watchedUser: [String], // 关注的用户列表
  homepagePublic: Boolean, // 个人主页是否开放
  portrait: String, // 头像文件名
  description: String, // 个人描述
  celebrity: Boolean, // 是否认证用户
  equipmentLevel: Number, // 装备部管理权级
  academyLevel: Number, // 学术部管理权级
  publicLevel: Number, // 宣传部管理权级
  systemLevel: Number, // 总务部管理权级
  administrator: Boolean // 是否系统超级管理员
});

userSchema.methods.genCheckCode = function (codeLength) {
  var code = Math.random().toString(36).substring(2);
  while (code.length < codeLength) {
    code += Math.random().toString(36).substring(2);
  }
  this.checkCode = code.substring(0, codeLength).toUpperCase();
  this.checkCodeGenTime = new Date();
  this.save();
  return this.checkCode;
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPwd = function (password) {
  return bcrypt.hashSync(password, 12);
};

var User = mongoose.model('User', userSchema);
module.exports = User;

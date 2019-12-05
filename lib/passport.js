var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use('local.login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, username, password, done) {
    User.findOne({ 'username': username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !user.validPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.use('local.register', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
},
  function (req, username, password, done) {
    User.findOne({ '$or': [{ 'username': username }, { 'email': req.body.email }] }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, false, req.flash('error', '该用户名或邮箱已注册！'));
      }
      let newUser = new User();
      newUser.username = username;
      newUser.email = req.body.email;
      newUser.password = newUser.hashPwd(password);
      newUser.available = true;
      newUser.save(function (err, result) {
        if (err) {
          return done(err);
        }
        return done(null, newUser);
      });
    });
  }
));

module.exports = passport;

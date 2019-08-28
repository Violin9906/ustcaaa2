var express = require('express');
var User = require('../models/user');
var passport = require('../lib/passport.js');
const {check, validationResult} = require('express-validator');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  // TODO 处理登录逻辑，重定向
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', [
      check('username').isLength({min: 1}).withMessage('Empty Username'),
      check('email').isLength({min: 1}).isEmail().withMessage('Wrong Email'),
      check('password').isLength({min: 4}).withMessage('Wrong Password'),
      check('checkCode').isLength({min: 1}).withMessage('Empty CheckCode')
    ],
    function (req, res, next) {
      const errors = validationResult(req).array();
      if (errors.length > 0) {
        req.flash('error', errors[0].msg);
        res.redirect(303, '/register');
      } else {
        next();
      }
    },
    function (req, res, next) {
    },
    passport.authenticate('local.register',
        {
          successRedirect: '/',
          failureRedirect: '/register',
          successFlash: 'register success'
        }
    )
);

router.get('/:username', function(req, res, next) {
  // TODO 用户主页
});


module.exports = router;

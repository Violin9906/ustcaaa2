var express = require('express');
var User = require('../models/user');
var passport = require('../lib/passport.js');
const { check, validationResult } = require('express-validator');
var cookieParser = require('cookie-parser');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var router = express.Router();

var csrfProtection = csrf({cookie: true});
var parseForm = bodyParser.urlencoded({extended: false});

router.use(cookieParser());

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.user) {
    res.redirect(303, '/users/' + req.user.username);
  } else {
    res.redirect(303, '/users/login');
  }
});

router.get('/login', csrfProtection, function (req, res, next) {
  if (req.user) {
    res.redirect(303, '/users/' + req.user.username);
  } else {
    res.render('login', { 'csrf': req.csrfToken() });
  }
});

router.post('/login', parseForm, csrfProtection,
  passport.authenticate('local.login',
    {
      failureRedirect: '/users/login',
      successFlash: { type: 'success', message: '登录成功！' },
      failureFlash: { type: 'error', message: '登录失败！' }
    }
  ),
  function (req, res) {
    res.redirect('/users/' + req.user.username);
  }
);

router.get('/register', csrfProtection, function (req, res, next) {
  res.render('register', { 'csrf': req.csrfToken() });
});

router.post('/register',
  parseForm,
  csrfProtection,
  [
    check('username').isLength({ min: 1 }).withMessage('用户名不能为空！'),
    check('email').isLength({ min: 1 }).isEmail().withMessage('不是有效的Email地址！'),
    check('password').isLength({ min: 4 }).withMessage('密码长度不足！'),
  ],
  function (req, res, next) {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      req.flash('error', errors[0].msg);
      res.redirect(303, '/users/register');
    } else {
      next();
    }
  },
  passport.authenticate('local.register',
    {
      successRedirect: '/users/login',
      failureRedirect: '/users/register',
      successFlash: '注册成功！'
    }
  )
);

router.get('/:username',
    csrfProtection,
    function (req, res, next) {
      if (!(req.user)) {
        req.flash('info', '需要登录才可查看！');
        res.redirect(303, '/users/login');
      }
      next();
    },
    function (req, res, next) {
      if (req.user.username !== req.params.username) {
        req.flash('info', '该用户设置了权限，无法查看');
        res.redirect(303, '/users/' + req.user.username); // TODO 查看他人用户界面
      }
      next();
    },
    function (req, res, next) {
      // TODO 用户主页
      res.render('userPage', {
        'emailChecked': req.user.emailChecked,
        'email': req.user.email,
        'csrf': req.csrfToken()
      });
    }
);

router.get('/:username/checkEmail',
    csrfProtection,
    function (req, res, next) {
      if (!req.user) {
        res.redirect(303, '/users/login');
      }
      next();
    },
    function (req, res, next) {
      var sendCheckMail = require('../controllers/sendCheckMail');
      sendCheckMail.send(req.user.email, 'haha');
      console.log(sendCheckMail.errorCode);
      if (sendCheckMail.errorCode === 0) {
        req.flash('success', '发送成功');
      } else {
        req.flash('error', '发送失败，错误码' + sendCheckMail.errorCode);
      }
      next();
    },
    function (req, res, next) {
      res.redirect(303, '/');
    }
);

module.exports = router;

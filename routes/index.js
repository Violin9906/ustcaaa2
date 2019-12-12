var express = require('express');
var router = express.Router();
var CheckMail = require('../controllers/checkMail')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { home: true });
});

router.get('/about', function(req, res, next) {
  res.render('about', { about: true });
});

router.get('/emailcheck/:id/:code', function (req, res, next) {
  CheckMail.check(req.params.code, req.params.id, function (err) {
    if(!err){
      req.flash('success', '验证成功！')
    } else {
      req.flash('error', '验证失败！')
    }
    res.redirect('/');
  })
});

module.exports = router;

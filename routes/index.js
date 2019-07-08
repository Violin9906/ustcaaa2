var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { home: true });
});

router.get('/about', function(req, res, next) {
  res.render('about', { about: true });
});

module.exports = router;

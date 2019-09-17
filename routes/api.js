var express = require('express');
var apiRouter = express.Router();

apiRouter.get('/', function(req, res) {
  res.send('{api: true}');
});

module.exports = apiRouter;
